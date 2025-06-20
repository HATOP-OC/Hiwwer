import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrders, Order } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  DollarSign,
  User,
  Star,
  Package,
  TrendingUp,
  PlusCircle,
  Loader2
} from 'lucide-react';

export default function MyOrders() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Always call useQuery, but disable it when no user
  const { data: orders = [], refetch, isLoading } = useQuery({
    queryKey: ['orders', statusFilter, searchTerm],
    queryFn: () => fetchOrders({ status: statusFilter, search: searchTerm }),
    enabled: !!user
  });

  // Early return AFTER all hooks
  if (!user) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Будь ласка, увійдіть для перегляду замовлень</h1>
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
    const isCustomOrder = !order.serviceId; // Кастомне замовлення - без прив'язки до конкретної послуги
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
                    {order.unreadMessages} новых
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {order.description}
              </p>
            </div>
            <div className="ml-4 text-right">
              <div className="text-2xl font-bold">
                ${order.price}
              </div>
              <div className="text-sm text-muted-foreground">
                {order.currency}
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
                    <span className="text-sm font-medium text-orange-600">К</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-orange-600">Кастомне замовлення</div>
                    <div className="text-xs text-muted-foreground">Очікує виконавця</div>
                  </div>
                </div>
              ) : otherParty ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={otherParty.avatar || '/placeholder.svg'} alt={otherParty.name} />
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
                    <div className="text-sm font-medium text-gray-600">Без виконавця</div>
                    <div className="text-xs text-muted-foreground">Очікує призначення</div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {daysLeft > 0 ? `${daysLeft} днів` : 
                   daysLeft === 0 ? 'Сьогодні' : 
                   `Прострочено на ${Math.abs(daysLeft)} днів`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to={`/order/${order.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                Деталі
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to={`/order/${order.id}#chat`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Чат
              </Link>
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
            <span className="ml-2">Завантаження замовлень...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Мої замовлення</h1>
              <p className="text-muted-foreground mt-2">
                Керуйте вашими замовленнями та слідкуйте за прогресом
              </p>
            </div>
            <div className="flex space-x-3">
              <Button asChild>
                <Link to="/services">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Створити замовлення
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/services">
                  <Search className="h-4 w-4 mr-2" />
                  Переглянути послуги
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <div className="text-sm text-muted-foreground">Всього замовлень</div>
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
                  <div className="text-sm text-muted-foreground">В роботі</div>
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
                  <div className="text-sm text-muted-foreground">Завершені</div>
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
                  <div className="text-sm text-muted-foreground">Загальна вартість</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Пошук замовлень..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Фільтр за статусом" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі статуси</SelectItem>
              <SelectItem value="pending">Очікують</SelectItem>
              <SelectItem value="in_progress">В роботі</SelectItem>
              <SelectItem value="revision">На доопрацюванні</SelectItem>
              <SelectItem value="completed">Завершені</SelectItem>
              <SelectItem value="canceled">Скасовані</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Всі замовлення</TabsTrigger>
            <TabsTrigger value="pending">Очікують</TabsTrigger>
            <TabsTrigger value="in_progress">В роботі</TabsTrigger>
            <TabsTrigger value="completed">Завершені</TabsTrigger>
            <TabsTrigger value="canceled">Скасовані</TabsTrigger>
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
                    <h3 className="text-xl font-semibold">Ваші замовлення з'являться тут</h3>
                    <p className="text-muted-foreground max-w-md">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Спробуйте змінити фільтри пошуку або створіть нове замовлення'
                        : 'Почніть роботу з платформою Hiwwer та створіть ваше перше замовлення'
                      }
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/services">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Створити нове замовлення
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
                  <h3 className="text-lg font-semibold mb-2">Немає замовлень що очікують</h3>
                  <p className="text-muted-foreground mb-4">
                    У вас немає замовлень, які очікують на підтвердження.
                  </p>
                  <Button asChild>
                    <Link to="/services">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Створити нове замовлення
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
                  <h3 className="text-lg font-semibold mb-2">Немає замовлень в роботі</h3>
                  <p className="text-muted-foreground mb-4">
                    У вас немає активних замовлень в процесі виконання.
                  </p>
                  <Button asChild>
                    <Link to="/services">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Створити нове замовлення
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
                  <h3 className="text-lg font-semibold mb-2">Немає завершених замовлень</h3>
                  <p className="text-muted-foreground mb-4">
                    Ваші завершені замовлення з'являться тут.
                  </p>
                  <Button asChild>
                    <Link to="/services">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Створити нове замовлення
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
                  <h3 className="text-lg font-semibold mb-2">Немає скасованих замовлень</h3>
                  <p className="text-muted-foreground">
                    Чудово! У вас немає скасованих замовлень.
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
