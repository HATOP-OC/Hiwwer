import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  PlusCircle
} from 'lucide-react';

interface Order {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'revision' | 'completed' | 'cancelled';
  price: number;
  currency: string;
  deadline: Date;
  createdAt: Date;
  client: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  performer: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  category: string;
  unreadMessages: number;
}

// Мок-дані замовлень
const mockOrders: Order[] = [
  {
    id: '1',
    title: 'Professional Logo Design',
    description: 'Need a modern logo for my startup company. Looking for something clean and professional.',
    status: 'in_progress',
    price: 299,
    currency: 'USD',
    deadline: new Date('2024-02-15'),
    createdAt: new Date('2024-01-20'),
    client: {
      id: 'c1',
      name: 'John Smith',
      avatar: '/placeholder.svg',
      rating: 4.8
    },
    performer: {
      id: 'p1',
      name: 'Alice Designer',
      avatar: '/placeholder.svg',
      rating: 4.9
    },
    category: 'Design',
    unreadMessages: 2
  },
  {
    id: '2',
    title: 'Website Development',
    description: 'E-commerce website for selling handmade crafts. Need responsive design and payment integration.',
    status: 'pending',
    price: 1500,
    currency: 'USD',
    deadline: new Date('2024-03-01'),
    createdAt: new Date('2024-01-25'),
    client: {
      id: 'c2',
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
      rating: 4.6
    },
    performer: {
      id: 'p2',
      name: 'Mike Developer',
      avatar: '/placeholder.svg',
      rating: 4.7
    },
    category: 'Development',
    unreadMessages: 0
  },
  {
    id: '3',
    title: 'Social Media Content',
    description: 'Monthly social media content creation for Instagram and Facebook.',
    status: 'completed',
    price: 450,
    currency: 'USD',
    deadline: new Date('2024-01-31'),
    createdAt: new Date('2024-01-01'),
    client: {
      id: 'c3',
      name: 'David Wilson',
      avatar: '/placeholder.svg',
      rating: 4.5
    },
    performer: {
      id: 'p3',
      name: 'Emma Marketer',
      avatar: '/placeholder.svg',
      rating: 4.8
    },
    category: 'Marketing',
    unreadMessages: 0
  },
  {
    id: '4',
    title: 'Mobile App UI Design',
    description: 'UI/UX design for a fitness tracking mobile application.',
    status: 'revision',
    price: 800,
    currency: 'USD',
    deadline: new Date('2024-02-20'),
    createdAt: new Date('2024-01-15'),
    client: {
      id: 'c4',
      name: 'Lisa Brown',
      avatar: '/placeholder.svg',
      rating: 4.7
    },
    performer: {
      id: 'p4',
      name: 'Tom Designer',
      avatar: '/placeholder.svg',
      rating: 4.6
    },
    category: 'Design',
    unreadMessages: 1
  }
];

export default function MyOrders() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders] = useState<Order[]>(mockOrders);

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Please log in to view your orders</h1>
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
      case 'cancelled':
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
      case 'cancelled':
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
    const isClient = user.role === 'client';
    const otherParty = isClient ? order.performer : order.client;
    const daysLeft = Math.ceil((order.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{order.title}</h3>
                {order.unreadMessages > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {order.unreadMessages} new
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
              #{order.id}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={otherParty.avatar} alt={otherParty.name} />
                <AvatarFallback>
                  {otherParty.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{otherParty.name}</div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {otherParty.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {daysLeft > 0 ? `${daysLeft} days left` : 
                   daysLeft === 0 ? 'Due today' : 
                   `${Math.abs(daysLeft)} days overdue`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
              <p className="text-muted-foreground mt-2">
                Manage your orders and track their progress
              </p>
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Order
            </Button>
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
                  <div className="text-sm text-muted-foreground">Total Orders</div>
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
                  <div className="text-sm text-muted-foreground">In Progress</div>
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
                  <div className="text-sm text-muted-foreground">Completed</div>
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
                  <div className="text-sm text-muted-foreground">Total Value</div>
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
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="revision">Revision</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'You haven\'t created any orders yet'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {getOrdersByStatus('pending').map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            {getOrdersByStatus('in_progress').map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {getOrdersByStatus('completed').map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {getOrdersByStatus('cancelled').length > 0 ? (
              getOrdersByStatus('cancelled').map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No cancelled orders</h3>
                  <p className="text-muted-foreground">
                    Great! You don't have any cancelled orders.
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
