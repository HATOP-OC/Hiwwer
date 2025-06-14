import Layout from '@/components/Layout/Layout';
import { fetchOrderById, updateOrder, deleteOrder, fetchMessages, sendMessage, fetchAdditionalOptions, proposeAdditionalOption, updateAdditionalOptionStatus, fetchOrderAttachments, uploadOrderAttachment, deleteOrderAttachment, fetchReview, createReview } from '@/lib/api';
import { fetchPayments, authorizePaymentApi, capturePaymentApi, refundPaymentApi, Payment } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Review } from '@/lib/api';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [msgFileUrl, setMsgFileUrl] = useState('');
  const [msgFileName, setMsgFileName] = useState('');
  const [optionTitle, setOptionTitle] = useState('');
  const [optionDesc, setOptionDesc] = useState('');
  const [optionPrice, setOptionPrice] = useState<number | ''>('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payProvider, setPayProvider] = useState<string>('stripe');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id
  });
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages', id],
    queryFn: () => fetchMessages(id!),
    enabled: !!order
  });
  const { data: options = [] } = useQuery<AdditionalOption[]>({
    queryKey: ['options', id],
    queryFn: () => fetchAdditionalOptions(id!),
    enabled: !!order
  });
  const { data: attachments = [] } = useQuery({
    queryKey: ['attachments', id],
    queryFn: () => fetchOrderAttachments(id!),
    enabled: !!order
  });
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ['payments', id],
    queryFn: () => fetchPayments(id!),
    enabled: !!order
  });
  const { data: review, refetch: refetchReview } = useQuery<Review>({
    queryKey: ['review', id],
    queryFn: () => fetchReview(id!),
    enabled: !!order && order.status === 'completed'
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Order>) => updateOrder(id!, data),
    onSuccess: () => {
        toast({ title: 'Оновлено', description: 'Замовлення успішно оновлено' });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['order', id] });
      },
      onError: () => {
        toast({ title: 'Помилка', description: 'Не вдалося оновити замовлення', variant: 'destructive' });
      }
    }
  );

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrder(id!),
    onSuccess: () => {
      toast({ title: 'Видалено', description: 'Замовлення видалено' });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/my-orders');
    },
    onError: () => {
      toast({ title: 'Помилка', description: 'Не вдалося видалити замовлення', variant: 'destructive' });
    }
  });

  const attachMutation = useMutation({
    mutationFn: () => file ? uploadOrderAttachment(id!, file) : Promise.reject(),
    onSuccess: () => {
      toast({ title: 'Файл додано' });
      queryClient.invalidateQueries({ queryKey: ['attachments', id] });
      setFile(null);
    },
    onError: () => {
      toast({ title: 'Помилка', description: 'Не вдалося додати файл', variant: 'destructive' });
    }
  });
  const deleteAttachmentMutation = useMutation({
    mutationFn: (attId: string) => deleteOrderAttachment(id!, attId),
    onSuccess: () => {
      toast({ title: 'Файл видалено' });
      queryClient.invalidateQueries({ queryKey: ['attachments', id] });
    }
  });

  const sendMsgMutation = useMutation({
    mutationFn: () => sendMessage(id!, { content: messageContent, attachments: msgFileUrl && msgFileName ? [{ fileUrl: msgFileUrl, fileName: msgFileName }] : undefined }),
    onSuccess: () => {
      toast({ title: 'Повідомлення відправлено' });
      setMessageContent(''); setMsgFileUrl(''); setMsgFileName('');
      queryClient.invalidateQueries({ queryKey: ['messages', id] });
    },
    onError: () => {
      toast({ title: 'Помилка', description: 'Не вдалося відправити повідомлення', variant: 'destructive' });
    }
  });

  // Mutations for additional options
  const proposeOptionMutation = useMutation({
    mutationFn: () => proposeAdditionalOption(id!, { title: optionTitle, description: optionDesc, price: Number(optionPrice) }),
    onSuccess: () => {
      toast({ title: 'Опція запропонована' });
      setOptionTitle(''); setOptionDesc(''); setOptionPrice('');
      queryClient.invalidateQueries({ queryKey: ['options', id] });
    }
  });
  const updateOptionStatusMutation = useMutation({
    mutationFn: ({ optId, status }: { optId: string; status: 'accepted' | 'rejected' }) => updateAdditionalOptionStatus(id!, optId, status),
    onSuccess: () => {
      toast({ title: 'Статус опції оновлено' });
      queryClient.invalidateQueries({ queryKey: ['options', id] });
    }
  });
  const authorizeMutation = useMutation({
    mutationFn: () => authorizePaymentApi(id!, payAmount, payProvider),
    onSuccess: () => {
      toast({ title: 'Платіж авторизовано' });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
    }
  });
  const captureMutation = useMutation({
    mutationFn: (paymentId: string) => capturePaymentApi(id!, paymentId),
    onSuccess: () => {
      toast({ title: 'Платіж списано' });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
    }
  });
  const refundMutation = useMutation({
    mutationFn: (paymentId: string) => refundPaymentApi(id!, paymentId),
    onSuccess: () => {
      toast({ title: 'Платіж повернуто' });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
    }
  });
  const createReviewMutation = useMutation({
    mutationFn: () => createReview(id!, { rating, comment }),
    onSuccess: () => {
      toast({ title: 'Відгук додано' });
      queryClient.invalidateQueries({ queryKey: ['review', id] });
    }
  });

  if (isLoading) return <Layout><div className="py-12 text-center">Завантаження...</div></Layout>;
  if (error || !order) return <Layout><div className="py-12 text-center text-red-500">Не знайдено замовлення</div></Layout>;

  const statusOptions = ['pending', 'in_progress', 'revision', 'completed', 'canceled', 'disputed'];
  const isClient = user?.id === order.client.id;
  const isPerformer = user?.id === order.performer.id;

  const handleStatusChange = (value: string) => {
    updateMutation.mutate({ status: value });
  };

  const handleAddAttachment = () => {
    if (!file) return;
    attachMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm('Ви впевнені, що хочете видалити замовлення?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold">Замовлення: {order.title}</h1>
        <p>{order.description}</p>

        <div className="flex items-center space-x-4">
          <label className="font-medium">Статус:</label>
          <Select onValueChange={handleStatusChange} defaultValue={order.status} disabled={updateMutation.isLoading}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h2 className="font-medium">Файли:</h2>
          <ul className="list-disc ml-6 mb-2">
            {attachments.map(att => (
              <li key={att.id} className="flex justify-between items-center">
                <a href={att.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {att.fileName}
                </a>
                <Button size="icon" variant="ghost" onClick={() => deleteAttachmentMutation.mutate(att.id)}>
                  🗑️
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-2">
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
            <Button onClick={() => attachMutation.mutate()} disabled={!file || attachMutation.isLoading}>Завантажити</Button>
          </div>
        </div>

        <div className="space-x-2">
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isLoading}>Видалити замовлення</Button>
        </div>

        {/* Chat section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Чат</h2>
          <div className="border rounded p-4 h-64 overflow-y-auto mb-4 space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={msg.senderId === order.client.id ? 'text-left' : 'text-right'}>
                <div className="inline-block bg-gray-200 p-2 rounded">
                  <p>{msg.content}</p>
                  {msg.attachments?.map(a => (
                    <a key={a.id} href={a.fileUrl} target="_blank" rel="noreferrer" className="block text-blue-600 text-sm">{a.fileName}</a>
                  ))}
                  <div className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <textarea className="w-full border p-2 rounded" rows={3} placeholder="Написати повідомлення..." value={messageContent} onChange={e => setMessageContent(e.target.value)} />
            <div className="flex space-x-2">
              <Input placeholder="URL вкладення" value={msgFileUrl} onChange={e => setMsgFileUrl(e.target.value)} />
              <Input placeholder="Ім'я файлу" value={msgFileName} onChange={e => setMsgFileName(e.target.value)} />
              <Button onClick={() => sendMsgMutation.mutate()} disabled={sendMsgMutation.isLoading || !messageContent}>Відправити</Button>
            </div>
          </div>
        </div>

        {/* Additional Options Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Додаткові опції</h2>
          <ul className="space-y-2 mb-4">
            {options.map(opt => (
              <li key={opt.id} className="border p-2 rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{opt.title} — ${opt.price}</div>
                    <div className="text-sm text-muted-foreground">{opt.description}</div>
                  </div>
                  <div>
                    <span className="text-sm px-2 py-1 border rounded">{opt.status}</span>
                  </div>
                </div>
                {isClient && opt.status === 'proposed' && (
                  <div className="mt-2 space-x-2">
                    <Button size="sm" onClick={() => updateOptionStatusMutation.mutate({ optId: opt.id, status: 'accepted' })}>Прийняти</Button>
                    <Button size="sm" variant="destructive" onClick={() => updateOptionStatusMutation.mutate({ optId: opt.id, status: 'rejected' })}>Відхилити</Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {isPerformer && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Запропонувати нову опцію</h3>
              <Input placeholder="Заголовок опції" value={optionTitle} onChange={e => setOptionTitle(e.target.value)} className="mb-2" />
              <Input placeholder="Опис" value={optionDesc} onChange={e => setOptionDesc(e.target.value)} className="mb-2" />
              <Input type="number" placeholder="Ціна" value={optionPrice} onChange={e => setOptionPrice(Number(e.target.value))} className="mb-2" />
              <Button onClick={() => proposeOptionMutation.mutate()} disabled={proposeOptionMutation.isLoading || !optionTitle || !optionPrice}>Запропонувати</Button>
            </div>
          )}
        </div>

        {/* Payments Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Платежі</h2>
          <ul className="space-y-2 mb-4">
            {payments.map(p => (
              <li key={p.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{p.provider}: {p.amount} {p.currency}</div>
                  <div className="text-sm text-muted-foreground">{p.status} - {new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <div className="space-x-2">
                  {p.status === 'authorized' && (
                    <Button size="sm" onClick={() => captureMutation.mutate(p.id)} disabled={captureMutation.isLoading}>Capture</Button>
                  )}
                  {p.status === 'completed' && (
                    <Button size="sm" variant="destructive" onClick={() => refundMutation.mutate(p.id)} disabled={refundMutation.isLoading}>Refund</Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {user?.role === 'client' && (
            <div className="border-t pt-4">
              <div className="flex space-x-2 items-center mb-2">
                <Input type="number" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} />
                <Select value={payProvider} onValueChange={val => setPayProvider(val)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="liqpay">LiqPay</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => authorizeMutation.mutate()} disabled={authorizeMutation.isLoading}>Authorize</Button>
              </div>
            </div>
          )}
        </div>

        {/* Review Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Відгук</h2>
          {order.status !== 'completed' && (
            <p className="text-muted-foreground">Відгук доступний після завершення замовлення</p>
          )}
          {order.status === 'completed' && review && (
            <div className="border p-4 rounded">
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx}>{idx < review.rating ? '★' : '☆'}</span>
                ))}
              </div>
              <p className="mt-2">{review.comment}</p>
            </div>
          )}
          {order.status === 'completed' && !review && (
            <div className="space-y-2">
              <label className="font-medium">Оцініть (1-5):</label>
              <Input type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} />
              <textarea className="w-full border p-2 rounded" rows={3} placeholder="Коментар (опційно)" value={comment} onChange={e => setComment(e.target.value)} />
              <Button onClick={() => createReviewMutation.mutate()} disabled={createReviewMutation.isLoading}>Надіслати відгук</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
