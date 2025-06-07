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
import { fetchAdminDashboardStats, fetchRecentActivities, fetchSupportTickets, fetchMonthlySales, fetchCategoryDistribution, DashboardStats, Activity, SupportTicket, MonthlySales, CategoryDistribution } from '@/lib/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Real data for monthly sales and category distribution
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [errorMonthly, setErrorMonthly] = useState<string | null>(null);
  const [categoryDist, setCategoryDist] = useState<CategoryDistribution[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Load dashboard stats
      try {
        const dd = await fetchAdminDashboardStats();
        setStats(dd);
      } catch (err: any) {
        console.error(err);
        setErrorStats(err.message);
      } finally {
        setLoadingStats(false);
      }
      // Load monthly sales
      try {
        const ms = await fetchMonthlySales();
        setMonthlySales(ms);
      } catch (err: any) {
        console.error(err);
        setErrorMonthly(err.message);
      } finally {
        setLoadingMonthly(false);
      }
      // Load category distribution
      try {
        const cd = await fetchCategoryDistribution();
        setCategoryDist(cd);
      } catch (err: any) {
        console.error(err);
        setErrorCategory(err.message);
      } finally {
        setLoadingCategory(false);
      }
      // Load recent activities
      try {
        const ra = await fetchRecentActivities();
        setActivities(ra);
      } catch (err) {
        console.error(err);
      }
      // Load support tickets
      try {
        const st = await fetchSupportTickets();
        setTickets(st);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // Navigate to detailed analytics for selected month
  const handleMonthClick = (month: string) => {
    navigate(`/admin/analytics?month=${encodeURIComponent(month)}`);
  };

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
            {errorStats ? (
              <p className="text-red-500 mb-4">Помилка завантаження: {errorStats}</p>
            ) : loadingStats ? (
              <p className="mb-4">Завантаження статистики...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsCardsDynamic.map((card, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-muted-foreground">{card.title}</p>
                          <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
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
            )}

            {/* Графіки (спрощена версія без recharts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Продажі за місяць</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {errorMonthly ? (
                      <p className="text-red-500">Помилка завантаження: {errorMonthly}</p>
                    ) : loadingMonthly ? (
                      <p>Завантаження місячних даних...</p>
                    ) : (
                      monthlySales.map((item, index) => (
                        <div
                          key={index}
                          className="cursor-pointer flex justify-between items-center"
                          onClick={() => handleMonthClick(item.month)}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm underline hover:text-primary">{item.month}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium">{item.value}%</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Розподіл за категоріями</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {errorCategory ? (
                      <p className="text-red-500">Помилка завантаження: {errorCategory}</p>
                    ) : loadingCategory ? (
                      <p>Завантаження розподілу за категоріями...</p>
                    ) : (
                      categoryDist.map((item, index) => (
                        <div
                          key={index}
                          className="cursor-pointer"
                          onClick={() => navigate(`/admin/analytics?category=${encodeURIComponent(item.name)}`)}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm underline hover:text-primary">{item.name}</span>
                            <span className="text-sm font-medium">{item.value}%</span>
                          </div>
                          <Progress value={item.value} className="h-2" />
                        </div>
                      ))
                    )}
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
          {/* Dynamic quick links for key resources */}
          {[
            { title: 'Користувачі', icon: Users, link: '/admin/users', count: stats?.totalUsers },
            { title: 'Сервіси', icon: FileText, link: '/admin/services', count: stats?.totalServices },
            { title: 'Виконавці', icon: Shield, link: '/admin/performers', count: stats?.totalPerformers },
            { title: 'Замовлення', icon: ShoppingCart, link: '/admin/orders', count: stats?.totalOrders },
            { title: 'Підтримка', icon: MessageSquare, link: '/admin/support', count: tickets.length }
          ].map((item, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-6 w-6" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <span className="text-xl font-bold">{item.count?.toLocaleString() ?? '—'}</span>
                </div>
                <Button variant="link" asChild>
                  <Link to={item.link}>Перейти</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          {/* Static quick links for other admin sections */}
          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" asChild>
            <Link to="/admin/services">
              <FileText className="h-6 w-6 mb-2" />
              <span>Послуги</span>
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
