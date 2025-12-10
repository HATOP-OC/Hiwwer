import Layout from '@/components/Layout/Layout';
import { fetchOrderById, updateOrder, deleteOrder, fetchMessages, sendMessage, fetchAdditionalOptions, proposeAdditionalOption, updateAdditionalOptionStatus, fetchReview, createReview, fetchDispute, deleteDispute, Dispute } from '@/lib/api';
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
import { useTranslation } from 'react-i18next';

export default function OrderDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  console.log('OrderDetail component start, id:', id);

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('OrderDetail useEffect auth check, user:', !!user, 'token:', !!localStorage.getItem('token'));
    if (!user && !localStorage.getItem('token')) {
      navigate('/login', { state: { returnTo: `/order/${id}` } });
      return;
    }
  }, [user, id, navigate]);
  
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
  const [deletingDispute, setDeletingDispute] = useState(false);

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id && !!user
  });

  console.log('OrderDetail render:', { id, isLoading, error, order, user });

  // Debug logs above — normal render below
  
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages', id],
    queryFn: () => fetchMessages(id!),
    enabled: !!id && !!order && !!user
  });
  
  const { data: options = [] } = useQuery<AdditionalOption[]>({
    queryKey: ['options', id],
    queryFn: () => fetchAdditionalOptions(id!),
    enabled: !!id && !!order && !!user
  });
  
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ['payments', id],
    queryFn: () => fetchPayments(id!),
    enabled: !!id && !!order && !!user
  });
  
  const { data: review, refetch: refetchReview } = useQuery<Review>({
    queryKey: ['review', id],
    queryFn: async () => {
      try {
        return await fetchReview(id!);
      } catch (error: any) {
        if (error.message?.includes('404') || error.message?.includes('Failed to fetch review')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!id && !!order && order.status === 'completed' && !!user,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: dispute, refetch: refetchDispute } = useQuery({
    queryKey: ['dispute', id],
    queryFn: async () => {
      try {
        return await fetchDispute(id!);
      } catch (error: any) {
        if (error.message?.includes('404') || error.message?.includes('Failed to fetch dispute')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!id && !!order && !!user,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Order>) => updateOrder(id!, data),
    onSuccess: () => {
        toast({ title: t('orderDetailPage.updateSuccess') });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['order', id] });
      },
      onError: () => {
        toast({ title: t('toast.errorTitle'), description: t('orderDetailPage.updateError'), variant: 'destructive' });
      }
    }
  );

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrder(id!),
    onSuccess: () => {
      toast({ title: t('orderDetailPage.deleteSuccess') });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/my-orders');
    },
    onError: () => {
      toast({ title: t('toast.errorTitle'), description: t('orderDetailPage.deleteError'), variant: 'destructive' });
    }
  });

  const sendMsgMutation = useMutation({
    mutationFn: () => sendMessage(id!, { content: messageContent, attachments: msgFileUrl && msgFileName ? [{ fileUrl: msgFileUrl, fileName: msgFileName }] : undefined }),
    onSuccess: () => {
      toast({ title: t('orderDetailPage.messageSent') });
      setMessageContent(''); setMsgFileUrl(''); setMsgFileName('');
      queryClient.invalidateQueries({ queryKey: ['messages', id] });
    },
    onError: () => {
      toast({ title: t('toast.errorTitle'), description: t('orderDetailPage.messageError'), variant: 'destructive' });
    }
  });

  const proposeOptionMutation = useMutation({
    mutationFn: () => proposeAdditionalOption(id!, { title: optionTitle, description: optionDesc, price: Number(optionPrice) }),
    onSuccess: () => {
      toast({ title: t('orderDetailPage.optionProposed') });
      setOptionTitle(''); setOptionDesc(''); setOptionPrice('');
      queryClient.invalidateQueries({ queryKey: ['options', id] });
    }
  });
  
  const updateOptionStatusMutation = useMutation({
    mutationFn: ({ optId, status }: { optId: string; status: 'accepted' | 'rejected' }) => updateAdditionalOptionStatus(id!, optId, status),
    onSuccess: () => {
      toast({ title: t('orderDetailPage.optionStatusUpdated') });
      queryClient.invalidateQueries({ queryKey: ['options', id] });
    }
  });
  
  const authorizeMutation = useMutation({
    mutationFn: () => authorizePaymentApi(id!, payAmount, payProvider),
    onSuccess: () => {
      toast({ title: t('orderDetailPage.paymentAuthorized') });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
    }
  });
  
  const captureMutation = useMutation({
    mutationFn: (paymentId: string) => capturePaymentApi(id!, paymentId),
    onSuccess: () => {
      toast({ title: t('orderDetailPage.paymentCaptured') });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
    }
  });
  
  const refundMutation = useMutation({
    mutationFn: (paymentId: string) => refundPaymentApi(id!, paymentId),
    onSuccess: () => {
      toast({ title: t('orderDetailPage.paymentRefunded') });
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
    }
  });
  
  const createReviewMutation = useMutation({
    mutationFn: () => createReview(id!, { rating, comment }),
    onSuccess: () => {
      toast({ title: t('orderDetailPage.reviewAdded') });
      queryClient.invalidateQueries({ queryKey: ['review', id] });
    }
  });

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
          throw new Error(t('orderDetailPage.disputeExistsError'));
        }
        throw new Error(errorData.message || t('orderDetailPage.disputeCreateError'));
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: t('orderDetailPage.disputeCreated') });
      setDisputeReason('');
      setShowDisputeForm(false);
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['dispute', id] });
      refetchDispute();
    },
    onError: (error: any) => {
      toast({ title: t('toast.errorTitle'), description: error.message || t('orderDetailPage.disputeCreateError'), variant: 'destructive' });
    }
  });

  useEffect(() => {
    if (!order) return;
    const locState = (location.state || {}) as any;
    console.debug('OrderDetail: location.hash, location.state, orderId:', location.hash, locState, order.id);
    // Prefer explicit state.openChat over hash, because browsers may persist hashes across navigation
    // Only open chat explicitly if location.state.openChat === true.
    // We avoid relying on URL hash to prevent accidental chat opens due to preserved URL state.
    const shouldOpenChat = locState?.openChat === true;
    if (shouldOpenChat) {
      const timer = setTimeout(() => {
        const chatElement = document.getElementById('order-chat');
        if (chatElement) {
          chatElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }

    // If we explicitly asked to clear the hash, remove it from URL to prevent future navigations from auto-scrolling
    if (locState?.clearChat && window.location.hash) {
      const url = window.location.pathname + window.location.search;
      window.history.replaceState({}, '', url);
    }
  }, [location.hash, location.state, order]);

  if (isLoading) {
    console.log('OrderDetail: showing loading');
    return <Layout><div className="py-12 text-center">{t('orderDetailPage.loading')}</div></Layout>;
  }
  if (error || !order) {
    console.error('OrderDetail error:', error);
    console.log('OrderDetail: showing error/not found');
    return <Layout><div className="py-12 text-center text-red-500">
      <h2 className="text-xl font-bold mb-2">{t('orderDetailPage.notFound')}</h2>
      {error && <p className="text-sm">Помилка: {error.message}</p>}
      <p className="text-sm mt-2">ID замовлення: {id}</p>
    </div></Layout>;
  }

  console.log('OrderDetail: rendering order content', order);

  const statusOptions = ['pending', 'in_progress', 'revision', 'completed', 'canceled', 'disputed'];
  const isClient = user?.id === order.client.id;
  const isPerformer = order.performer && user?.id === order.performer.id;

  const handleDelete = () => {
    if (window.confirm(t('orderDetailPage.deleteConfirmation'))) {
      deleteMutation.mutate();
    }
  };

  const handleCreateDispute = () => {
    if (!disputeReason.trim()) {
      toast({ title: t('toast.errorTitle'), description: t('orderDetailPage.disputeReasonRequired'), variant: 'destructive' });
      return;
    }
    createDisputeMutation.mutate(disputeReason);
  };

  const handleDeleteDispute = async () => {
    if (!dispute) return;
    
    if (!window.confirm(t('orderDetailPage.disputeDeleteConfirmation'))) {
      return;
    }

    setDeletingDispute(true);
    try {
      await deleteDispute(order.id, dispute.id);
      
      queryClient.setQueryData(['dispute', id], null);
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      
      toast({ 
        title: t('toast.successTitle'),
        description: t('orderDetailPage.disputeDeleteSuccess'),
        variant: 'default' 
      });
    } catch (error) {
      console.error('Error deleting dispute:', error);
      toast({ 
        title: t('toast.errorTitle'),
        description: t('orderDetailPage.disputeDeleteError'),
        variant: 'destructive' 
      });
    } finally {
      setDeletingDispute(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold">{t('orderDetailPage.orderTitle', { title: order.title })}</h1>
        <p>{order.description}</p>

        <div className="flex items-center space-x-4">
          <label className="font-medium">{t('orderDetailPage.statusLabel')}</label>
          <Select onValueChange={(value) => updateMutation.mutate({ status: value })} defaultValue={order.status} disabled={updateMutation.status === 'pending'}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-x-2">
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.status === 'pending'}>{t('orderDetailPage.deleteButton')}</Button>
        </div>

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

        {order.status !== 'disputed' && (isClient || isPerformer) && (
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <h3 className="text-lg font-semibold mb-2 text-orange-800">{t('orderDetailPage.openDispute')}</h3>
            <p className="text-sm text-orange-700 mb-3">
              {t('orderDetailPage.openDisputePrompt')}
            </p>
            {!showDisputeForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowDisputeForm(true)}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                {t('orderDetailPage.openDisputeButton')}
              </Button>
            ) : (
              <div className="space-y-3">
                <textarea
                  className="w-full border rounded p-2 resize-none"
                  rows={3}
                  placeholder={t('orderDetailPage.disputeReasonPlaceholder')}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreateDispute}
                    disabled={createDisputeMutation.status === 'pending' || !disputeReason.trim()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {createDisputeMutation.status === 'pending' ? t('orderDetailPage.submittingDisputeButton') : t('orderDetailPage.submitDisputeButton')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDisputeForm(false);
                      setDisputeReason('');
                    }}
                  >
                    {t('orderDetailPage.cancelButton')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {dispute && (
          <div className="space-y-4">
            <div className={`border rounded-lg p-4 ${dispute.status === 'resolved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${dispute.status === 'resolved' ? 'text-green-800' : 'text-red-800'}`}>
                    {dispute.status === 'resolved' ? t('orderDetailPage.resolvedDispute') : t('orderDetailPage.activeDispute')}
                  </h3>
                  <p className={`text-sm mb-2 ${dispute.status === 'resolved' ? 'text-green-700' : 'text-red-700'}`}>
                    <strong>{t('orderDetailPage.reason')}:</strong> {dispute.reason}
                  </p>
                  <p className={`text-sm ${dispute.status === 'resolved' ? 'text-green-700' : 'text-red-700'}`}>
                    <strong>{t('orderDetailPage.statusLabel')}</strong> {t(`orderDetailPage.status.${dispute.status}`)}
                  </p>
                </div>
                
                {dispute.status === 'resolved' && (user?.role === 'admin' || user?.id === dispute.clientId) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteDispute}
                    disabled={deletingDispute}
                    className="ml-4"
                  >
                    {deletingDispute ? t('orderDetailPage.deletingDisputeButton') : t('orderDetailPage.deleteDisputeButton')}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="h-[600px]">            <DisputeChat
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
                  name: 'Moderator',
                  avatar: undefined
                } : undefined
              }}
              canResolve={user?.role === 'admin' || user?.id === dispute.clientId}
              disputeStatus={dispute.status}
              userRole={user?.role}
              onDisputeResolve={() => {
                refetchDispute();
                queryClient.invalidateQueries({ queryKey: ['order', id] });
              }}
            />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-2">{t('orderDetailPage.additionalOptions')}</h2>
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
                    <Button size="sm" onClick={() => updateOptionStatusMutation.mutate({ optId: opt.id, status: 'accepted' })}>{t('orderDetailPage.acceptButton')}</Button>
                    <Button size="sm" variant="destructive" onClick={() => updateOptionStatusMutation.mutate({ optId: opt.id, status: 'rejected' })}>{t('orderDetailPage.rejectButton')}</Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {isPerformer && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">{t('orderDetailPage.proposeOption')}</h3>
              <Input placeholder={t('orderDetailPage.optionTitlePlaceholder')} value={optionTitle} onChange={e => setOptionTitle(e.target.value)} className="mb-2" />
              <Input placeholder={t('orderDetailPage.optionDescPlaceholder')} value={optionDesc} onChange={e => setOptionDesc(e.target.value)} className="mb-2" />
              <Input type="number" placeholder={t('orderDetailPage.optionPricePlaceholder')} value={optionPrice} onChange={e => setOptionPrice(Number(e.target.value))} className="mb-2" />
              <Button onClick={() => proposeOptionMutation.mutate()} disabled={proposeOptionMutation.status === 'pending' || !optionTitle || !optionPrice}>{t('orderDetailPage.proposeButton')}</Button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">{t('orderDetailPage.payments')}</h2>
          <ul className="space-y-2 mb-4">
            {payments.map(p => (
              <li key={p.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{p.provider}: {p.amount} {p.currency}</div>
                  <div className="text-sm text-muted-foreground">{p.status} - {new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <div className="space-x-2">
                  {p.status === 'authorized' && (
                    <Button size="sm" onClick={() => captureMutation.mutate(p.id)} disabled={captureMutation.status === 'pending'}>{t('orderDetailPage.captureButton')}</Button>
                  )}
                  {p.status === 'completed' && (
                    <Button size="sm" variant="destructive" onClick={() => refundMutation.mutate(p.id)} disabled={refundMutation.status === 'pending'}>{t('orderDetailPage.refundButton')}</Button>
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
                <Button onClick={() => authorizeMutation.mutate()} disabled={authorizeMutation.status === 'pending'}>{t('orderDetailPage.authorizeButton')}</Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">{t('orderDetailPage.review')}</h2>
          {order.status !== 'completed' && (
            <p className="text-muted-foreground">{t('orderDetailPage.reviewAvailable')}</p>
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
              <label className="font-medium">{t('orderDetailPage.ratingLabel')}</label>
              <Input type="number" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} />
              <textarea className="w-full border p-2 rounded" rows={3} placeholder={t('orderDetailPage.commentPlaceholder')} value={comment} onChange={e => setComment(e.target.value)} />
              <Button onClick={() => createReviewMutation.mutate()} disabled={createReviewMutation.status === 'pending'}>{t('orderDetailPage.submitReviewButton')}</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}