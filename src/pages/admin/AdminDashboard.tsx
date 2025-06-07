import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  Database,
  MessageSquare,
  FileText,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { fetchAdminDashboardStats, fetchRecentActivities, fetchSupportTickets, DashboardStats, Activity, SupportTicket } from '@/lib/api';

// Статистичні картки
const statsCards = [
  {
    title: 'Користувачі',
    value: '2,845',
    change: '+12.5%',
    trend: 'up',
    icon: <Users className="h-8 w-8" />,
    link: '/admin/users'
  },
  {
    title: 'Замовлення',
    value: '1,257',
    change: '+23.1%',
    trend: 'up',
    icon: <ShoppingCart className="h-8 w-8" />,
    link: '/admin/orders'
  },
  {
    title: 'Дохід',
    value: '$45,678',
    change: '+18.2%',
    trend: 'up',
    icon: <DollarSign className="h-8 w-8" />,
    link: '/admin/finance'
  },
  {
    title: 'Конверсія',
    value: '3.2%',
    change: '-0.4%',
    trend: 'down',
    icon: <TrendingUp className="h-8 w-8" />,
    link: '/admin/analytics'
  },
];

// Дані для статистики продажів
const salesData = [
  { month: 'Січень', value: 70 },
  { month: 'Лютий', value: 55 },
  { month: 'Березень', value: 85 },
  { month: 'Квітень', value: 50 },
  { month: 'Травень', value: 40 },
  { month: 'Червень', value: 65 },
];

// Дані для категорій
const categoryData = [
  { name: 'Дизайн', value: 40 },
  { name: 'Розробка', value: 30 },
  { name: 'Маркетинг', value: 20 },
  { name: 'Консультації', value: 10 },
  { name: 'Інше', value: 8 },
];

// Останні дії користувачів
const recentActivities = [
  {
    id: 1,
    user: 'Олександр П.',
    action: 'створив нове замовлення',
    target: 'Дизайн логотипу',
    time: '10 хв тому'
  },
  {
    id: 2,
    user: 'Марія К.',
    action: 'стала виконавцем',
    target: '',
    time: '1 год тому'
  },
  {
    id: 3,
    user: 'Іван С.',
    action: 'залишив відгук',
    target: '★★★★★',
    time: '3 год тому'
  },
  {
    id: 4,
    user: 'Анна Д.',
    action: 'оновила профіль',
    target: '',
    time: '5 год тому'
  },
  {
    id: 5,
    user: 'Микола В.',
    action: 'завершив замовлення',
    target: 'Розробка веб-сайту',
    time: '1 день тому'
  },
];

// Останні повідомлення підтримки
const supportTickets = [
  {
    id: 1,
    user: 'Ольга Р.',
    subject: 'Проблема з оплатою',
    status: 'Відкрито',
    priority: 'Високий',
    time: '30 хв тому'
  },
  {
    id: 2,
    user: 'Сергій М.',
    subject: 'Питання про верифікацію',
    status: 'В обробці',
    priority: 'Середній',
    time: '2 год тому'
  },
  {
    id: 3,
    user: 'Юлія П.',
    subject: 'Запит на повернення коштів',
    status: 'В обробці',
    priority: 'Високий',
    time: '5 год тому'
  },
  {
    id: 4,
    user: 'Віктор К.',
    subject: 'Технічна проблема',
    status: 'Відкрито',
    priority: 'Низький',
    time: '1 день тому'
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchAdminDashboardStats()
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoadingStats(false));
    fetchRecentActivities()
      .then(data => setActivities(data))
      .catch(console.error);
    fetchSupportTickets()
      .then(data => setTickets(data))
      .catch(console.error);
  }, []);

  const statsCardsDynamic = [
    { title: 'Користувачі', value: stats?.totalUsers.toLocaleString() ?? '0', icon: <Users className="h-8 w-8" />, link: '/admin/users' },
    { title: 'Сервіси', value: stats?.totalServices.toLocaleString() ?? '0', icon: <FileText className="h-8 w-8" />, link: '/admin/services' },
    { title: 'Виконавці', value: stats?.totalPerformers.toLocaleString() ?? '0', icon: <Shield className="h-8 w-8" />, link: '/admin/performers' },
    { title: 'Замовлення', value: stats?.totalOrders.toLocaleString() ?? '0', icon: <ShoppingCart className="h-8 w-8" />, link: '/admin/orders' },
  ];

  // Функція для визначення кольору тренду
  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  // Функція для визначення іконки тренду
  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Функція для визначення кольору статусу тікета
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Відкрито':
        return 'text-red-500';
      case 'В обробці':
        return 'text-yellow-500';
      case 'Закрито':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  // Функція для визначення кольору пріоритету
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Високий':
        return 'text-red-500 font-medium';
      case 'Середній':
        return 'text-yellow-500 font-medium';
      case 'Низький':
        return 'text-green-500 font-medium';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Панель адміністратора</h1>
            <p className="text-muted-foreground">Вітаємо у панелі управління Hiwwer</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Налаштування
            </Button>
            <Button size="sm" onClick={() => navigate('/admin/support')}>
              <AlertCircle className="h-4 w-4 mr-2" />
              Підтримка
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Огляд</TabsTrigger>
            <TabsTrigger value="users">Користувачі</TabsTrigger>
            <TabsTrigger value="orders">Замовлення</TabsTrigger>
            <TabsTrigger value="support">Підтримка</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Картки зі статистикою */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsCardsDynamic.map((card, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-muted-foreground">{card.title}</p>
                        <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                        {/* <p className={`text-sm mt-1 flex items-center ${getTrendColor(card.trend)}`}>
                          {getTrendIcon(card.trend)}
                          <span className="ml-1">{card.change} з минулого місяця</span>
                        </p> */}
                      </div>
                      <div className="bg-primary/10 p-3 rounded-full">
                        {card.icon}
                      </div>
                    </div>
                    <Button variant="link" className="px-0 mt-2" asChild>
                      <Link to={card.link}>Детальніше</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Графіки (спрощена версія без recharts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Продажі за місяць</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{item.month}</span>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                        <Progress value={item.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Розподіл за категоріями</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                        <Progress value={item.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Активність та тікети підтримки */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Остання активність</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start pb-3 border-b last:border-0 last:pb-0">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                            {activity.target && <span> "{activity.target}"</span>}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/admin/activity">Переглянути всю активність</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Останні звернення в підтримку</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-start pb-3 border-b last:border-0 last:pb-0">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{ticket.subject}</p>
                          <div className="flex items-center text-xs mt-1">
                            <span className="text-muted-foreground">{ticket.user}</span>
                            <span className="mx-2">•</span>
                            <span className={getStatusColor(ticket.status)}>{ticket.status}</span>
                            <span className="mx-2">•</span>
                            <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{ticket.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/admin/support">Перейти до всіх звернень</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">Управління користувачами</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Ця сторінка дозволяє переглядати та керувати всіма користувачами платформи, включаючи клієнтів та виконавців.
                  </p>
                  <Button asChild>
                    <Link to="/admin/users">Перейти до управління користувачами</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">Управління замовленнями</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Ця сторінка дозволяє переглядати всі замовлення, їх статуси, керувати спорами та здійснювати модерацію послуг.
                  </p>
                  <Button asChild>
                    <Link to="/admin/orders">Перейти до управління замовленнями</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">Запити в підтримку</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Ця сторінка дозволяє переглядати та відповідати на запити користувачів до служби підтримки.
                  </p>
                  <Button asChild>
                    <Link to="/admin/support">Перейти до запитів підтримки</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Швидкі посилання */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/users">
              <Users className="h-6 w-6 mb-2" />
              <span>Користувачі</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/orders">
              <ShoppingCart className="h-6 w-6 mb-2" />
              <span>Замовлення</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/services">
              <FileText className="h-6 w-6 mb-2" />
              <span>Послуги</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/finance">
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Фінанси</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/support">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span>Підтримка</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/security">
              <Shield className="h-6 w-6 mb-2" />
              <span>Безпека</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/settings">
              <Settings className="h-6 w-6 mb-2" />
              <span>Налаштування</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/database">
              <Database className="h-6 w-6 mb-2" />
              <span>База даних</span>
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
