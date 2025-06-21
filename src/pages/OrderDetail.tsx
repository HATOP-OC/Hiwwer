import Layout from '@/components/Layout/Layout';
import { fetchOrderById, updateOrder, deleteOrder, fetchMessages, sendMessage, fetchAdditionalOptions, proposeAdditionalOption, updateAdditionalOptionStatus, fetchReview, createReview, fetchDispute } from '@/lib/api';
import { fetchPayments, authorizePaymentApi, capturePaymentApi, refundPaymentApi, Payment } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import OrderChat from '@/components/OrderChat';
import DisputeChat from '@/components/DisputeChat';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { Order, Message, AdditionalOption, Review } from '@/lib/api';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // All state hooks first - never conditionally call hooks
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
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  // All query hooks - never conditionally call
  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id
  });
  
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages', id],
    queryFn: () => fetchMessages(id!),
    enabled: !!id && !!order
  });
  
  const { data: options = [] } = useQuery<AdditionalOption[]>({
    queryKey: ['options', id],
    queryFn: () => fetchAdditionalOptions(id!),
    enabled: !!id && !!order
  });
  
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ['payments', id],
    queryFn: () => fetchPayments(id!),
    enabled: !!id && !!order
  });
  
  const { data: review, refetch: refetchReview } = useQuery<Review>({
    queryKey: ['review', id],
    queryFn: () => fetchReview(id!),
    enabled: !!id && !!order && order.status === 'completed'
  });

  // Dispute queries
  const { data: dispute, refetch: refetchDispute } = useQuery({
    queryKey: ['dispute', id],
    queryFn: () => fetchDispute(id!),
    enabled: !!id && !!order,
    retry: false, // Don't retry if dispute doesn't exist
    refetchOnWindowFocus: false
  });

  // All mutation hooks
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

  // Dispute mutations
  const createDisputeMutation = useMutation({
    mutationFn: async (reason: string) => {
      const response = await fetch(`/v1/orders/${id}/disputes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error('Спір для цього замовлення вже існує');
        }
        throw new Error(errorData.message || 'Failed to create dispute');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Спір відкрито' });
      setDisputeReason('');
      setShowDisputeForm(false);
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['dispute', id] });
      refetchDispute(); // Refresh dispute data
    },
    onError: (error: any) => {
      toast({ title: 'Помилка', description: error.message || 'Не вдалося відкрити спір', variant: 'destructive' });
    }
  });

  // useEffect hooks
  useEffect(() => {
    if (location.hash === '#chat' && order) {
      const timer = setTimeout(() => {
        const chatElement = document.getElementById('order-chat');
        if (chatElement) {
          chatElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.hash, order]);

  // Early returns after all hooks
  if (isLoading) return <Layout><div className="py-12 text-center">Завантаження...</div></Layout>;
  if (error || !order) return <Layout><div className="py-12 text-center text-red-500">Не знайдено замовлення</div></Layout>;

  // Computed values after early returns
  const statusOptions = ['pending', 'in_progress', 'revision', 'completed', 'canceled', 'disputed'];
  const isClient = user?.id === order.client.id;
  const isPerformer = order.performer && user?.id === order.performer.id;

  // Event handlers
  const handleStatusChange = (value: string) => {
    updateMutation.mutate({ status: value });
  };

  const handleDelete = () => {
    if (window.confirm('Ви впевнені, що хочете видалити замовлення?')) {
      deleteMutation.mutate();
    }
  };

  const handleCreateDispute = () => {
    if (!disputeReason.trim()) {
      toast({ title: 'Помилка', description: 'Вкажіть причину спору', variant: 'destructive' });
      return;
    }
    createDisputeMutation.mutate(disputeReason);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold">Замовлення: {order.title}</h1>
        <p>{order.description}</p>

        <div className="flex items-center space-x-4">
          <label className="font-medium">Статус:</label>
          <Select onValueChange={handleStatusChange} defaultValue={order.status} disabled={updateMutation.status === 'pending'}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-x-2">
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.status === 'pending'}>Видалити замовлення</Button>
        </div>

        {/* Chat section */}
        <div id="order-chat">
          <OrderChat 
            orderId={order.id}
            participants={{
              client: {
                id: order.client.id,
                name: order.client.name,
                avatar: order.client.avatar
              },
              performer: order.performer ? {
                id: order.performer.id,
                name: order.performer.name,  
                avatar: order.performer.avatar
              } : undefined
            }}
          />
        </div>

        {/* Dispute Section */}
        {order.status !== 'disputed' && (isClient || isPerformer) && (
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <h3 className="text-lg font-semibold mb-2 text-orange-800">Відкрити спір</h3>
            <p className="text-sm text-orange-700 mb-3">
              Якщо у вас є проблема з цим замовленням, ви можете відкрити спір для вирішення конфлікту.
            </p>
            {!showDisputeForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowDisputeForm(true)}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Відкрити спір
              </Button>
            ) : (
              <div className="space-y-3">
                <textarea
                  className="w-full border rounded p-2 resize-none"
                  rows={3}
                  placeholder="Опишіть причину спору..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreateDispute}
                    disabled={createDisputeMutation.status === 'pending' || !disputeReason.trim()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {createDisputeMutation.status === 'pending' ? 'Відкриваю...' : 'Відкрити спір'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDisputeForm(false);
                      setDisputeReason('');
                    }}
                  >
                    Скасувати
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Dispute Chat */}
        {dispute && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Активний спір</h3>
              <p className="text-sm text-red-700 mb-2">
                <strong>Причина:</strong> {dispute.reason}
              </p>
              <p className="text-sm text-red-700">
                <strong>Статус:</strong> {dispute.status === 'open' ? 'Відкритий' : dispute.status === 'in_review' ? 'На розгляді' : 'Вирішений'}
              </p>
            </div>
            
            <DisputeChat
              disputeId={dispute.id}
              orderId={order.id}
              participants={{
                client: {
                  id: order.client.id,
                  name: order.client.name,
                  avatar: order.client.avatar
                },
                performer: {
                  id: order.performer!.id,
                  name: order.performer!.name,
                  avatar: order.performer!.avatar
                },
                moderator: dispute.moderatorId ? {
                  id: dispute.moderatorId,
                  name: 'Модератор',
                  avatar: undefined
                } : undefined
              }}
            />
          </div>
        )}

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
              <Button onClick={() => proposeOptionMutation.mutate()} disabled={proposeOptionMutation.status === 'pending' || !optionTitle || !optionPrice}>Запропонувати</Button>
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
                    <Button size="sm" onClick={() => captureMutation.mutate(p.id)} disabled={captureMutation.status === 'pending'}>Capture</Button>
                  )}
                  {p.status === 'completed' && (
                    <Button size="sm" variant="destructive" onClick={() => refundMutation.mutate(p.id)} disabled={refundMutation.status === 'pending'}>Refund</Button>
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
                <Button onClick={() => authorizeMutation.mutate()} disabled={authorizeMutation.status === 'pending'}>Authorize</Button>
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
              <Button onClick={() => createReviewMutation.mutate()} disabled={createReviewMutation.status === 'pending'}>Надіслати відгук</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
