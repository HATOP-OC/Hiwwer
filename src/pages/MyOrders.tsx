import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrders, Order } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarSrc } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Star,
  Package,
  TrendingUp,
  PlusCircle,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function MyOrders() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders', statusFilter, searchTerm],
    queryFn: () => fetchOrders({ status: statusFilter, search: searchTerm }),
    enabled: !!user
  });

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login', { state: { returnTo: '/my-orders' } });
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('myOrdersPage.loading')}</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.error('MyOrders error:', error);
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Помилка завантаження замовлень</h1>
            <p className="mt-2">{error.message}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'revision':
        return <Eye className="h-4 w-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'revision':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const totalEarnings = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.price, 0);

  const OrderCard = ({ order }: { order: Order }) => {
    const isClient = user?.role === 'client';
    const otherParty = isClient ? order.performer : order.client;
    const isCustomOrder = !order.serviceId;
    const deadline = new Date(order.deadline);
    const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{order.title}</h3>
                {order.unreadMessages > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {t('myOrdersPage.orderCard.newMessages', { count: order.unreadMessages })}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {order.description}
              </p>
            </div>
            <div className="ml-4 text-right">
              <div className="text-2xl font-bold">
                  {formatCurrency(Number(order.price), order.currency)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {order.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              #{order.id.substring(0, 8)}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {isCustomOrder && isClient && !order.performer ? (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-600">C</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-orange-600">{t('myOrdersPage.orderCard.customOrder')}</div>
                    <div className="text-xs text-muted-foreground">{t('myOrdersPage.orderCard.awaitingPerformer')}</div>
                  </div>
                </div>
              ) : otherParty ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatarSrc(otherParty.avatar)} alt={otherParty.name} />
                    <AvatarFallback>
                      {otherParty.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{otherParty.name}</div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {otherParty.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">?</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">{t('myOrdersPage.orderCard.noPerformer')}</div>
                    <div className="text-xs text-muted-foreground">{t('myOrdersPage.orderCard.awaitingAssignment')}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {daysLeft > 0 ? t('myOrdersPage.orderCard.daysLeft', { count: daysLeft }) :
                   daysLeft === 0 ? t('myOrdersPage.orderCard.today') :
                   t('myOrdersPage.orderCard.overdueBy', { count: Math.abs(daysLeft) })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { console.debug('Navigating to details for order', order.id); navigate({ pathname: `/order/${order.id}`, hash: '' }, { state: { clearChat: true }, replace: true }); setTimeout(() => { try { window.history.replaceState({}, '', `/order/${order.id}`); } catch (e) { /* ignore */ } }, 20); }}>
                <Eye className="h-4 w-4 mr-2" />
                {t('myOrdersPage.orderCard.details')}
              </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => { console.debug('Navigating to chat for order', order.id); navigate({ pathname: `/order/${order.id}`, hash: '#chat' }, { state: { openChat: true }, replace: true }); setTimeout(() => { try { window.history.replaceState({}, '', `/order/${order.id}#chat`); } catch (e) { /* ignore */ } }, 20); }}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('myOrdersPage.orderCard.chat')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-7xl py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">{t('myOrdersPage.loading')}</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-7xl py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('myOrdersPage.title')}</h1>
              <p className="text-muted-foreground mt-2">
                {t('myOrdersPage.subtitle')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/services">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t('myOrdersPage.createOrder')}
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/services">
                  <Search className="h-4 w-4 mr-2" />
                  {t('myOrdersPage.browseServices')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <div className="text-sm text-muted-foreground">{t('myOrdersPage.stats.totalOrders')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{getOrdersByStatus('in_progress').length}</div>
                  <div className="text-sm text-muted-foreground">{t('myOrdersPage.stats.inProgress')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{getOrdersByStatus('completed').length}</div>
                  <div className="text-sm text-muted-foreground">{t('myOrdersPage.stats.completed')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">${totalEarnings}</div>
                  <div className="text-sm text-muted-foreground">{t('myOrdersPage.stats.totalValue')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('myOrdersPage.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('myOrdersPage.filterPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('myOrdersPage.statuses.all')}</SelectItem>
              <SelectItem value="pending">{t('myOrdersPage.statuses.pending')}</SelectItem>
              <SelectItem value="in_progress">{t('myOrdersPage.statuses.in_progress')}</SelectItem>
              <SelectItem value="revision">{t('myOrdersPage.statuses.revision')}</SelectItem>
              <SelectItem value="completed">{t('myOrdersPage.statuses.completed')}</SelectItem>
              <SelectItem value="canceled">{t('myOrdersPage.statuses.canceled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">{t('myOrdersPage.tabs.all')}</TabsTrigger>
            <TabsTrigger value="pending">{t('myOrdersPage.tabs.pending')}</TabsTrigger>
            <TabsTrigger value="in_progress">{t('myOrdersPage.tabs.in_progress')}</TabsTrigger>
            <TabsTrigger value="completed">{t('myOrdersPage.tabs.completed')}</TabsTrigger>
            <TabsTrigger value="canceled">{t('myOrdersPage.tabs.canceled')}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{t('myOrdersPage.emptyStates.all_title')}</h3>
                    <p className="text-muted-foreground max-w-md">
                      {searchTerm || statusFilter !== 'all' 
                        ? t('myOrdersPage.emptyStates.all_subtitle_filtered')
                        : t('myOrdersPage.emptyStates.all_subtitle_initial')
                      }
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/services">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('myOrdersPage.emptyStates.all_button')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {getOrdersByStatus('pending').length > 0 ? (
              getOrdersByStatus('pending').map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('myOrdersPage.emptyStates.pending_title')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('myOrdersPage.emptyStates.pending_subtitle')}
                  </p>
                  <Button asChild>
                    <Link to="/services">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('myOrdersPage.createOrder')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            {getOrdersByStatus('in_progress').length > 0 ? (
              getOrdersByStatus('in_progress').map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('myOrdersPage.emptyStates.in_progress_title')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('myOrdersPage.emptyStates.in_progress_subtitle')}
                  </p>
                  <Button asChild>
                    <Link to="/services">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('myOrdersPage.createOrder')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {getOrdersByStatus('completed').length > 0 ? (
              getOrdersByStatus('completed').map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('myOrdersPage.emptyStates.completed_title')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('myOrdersPage.emptyStates.completed_subtitle')}
                  </p>
                  <Button asChild>
                    <Link to="/services">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('myOrdersPage.createOrder')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            {getOrdersByStatus('canceled').length > 0 ? (
              getOrdersByStatus('canceled').map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('myOrdersPage.emptyStates.canceled_title')}</h3>
                  <p className="text-muted-foreground">
                    {t('myOrdersPage.emptyStates.canceled_subtitle')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}