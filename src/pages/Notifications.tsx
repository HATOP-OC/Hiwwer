import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Check, 
  MessageSquare, 
  ShoppingCart, 
  AlertCircle,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';
import { fetchNotifications, markNotificationRead, Notification } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const notificationIcons: Record<string, any> = {
  'message': MessageSquare,
  'new_order': ShoppingCart,
  'status_change': AlertCircle,
  'deadline': Clock,
  'payment': DollarSign,
  'review': Star,
  'dispute': AlertCircle,
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications
  });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => markRead.mutateAsync(n.id)));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markRead.mutate(notification.id);
    }

    // Навігація залежно від типу
    if (notification.relatedId) {
      if (notification.type === 'message') {
        navigate(`/orders/${notification.relatedId}`);
      } else if (notification.type === 'new_order' || notification.type === 'status_change') {
        navigate(`/orders/${notification.relatedId}`);
      } else if (notification.type === 'review') {
        navigate('/profile');
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Завантаження...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Сповіщення</h1>
            <p className="text-muted-foreground mt-2">
              {unreadCount > 0 
                ? `У вас ${unreadCount} непрочитаних сповіщень` 
                : 'Немає нових сповіщень'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Відмітити всі прочитаними
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Немає сповіщень</h3>
                <p className="text-muted-foreground">
                  Ви будете отримувати сповіщення про нові замовлення, повідомлення та оновлення статусів
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || Bell;
              
              return (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-950 border-blue-200' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        !notification.read 
                          ? 'bg-blue-100 dark:bg-blue-900' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          !notification.read ? 'text-blue-600' : 'text-muted-foreground'
                        }`} />
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { 
                            addSuffix: true, 
                            locale: uk 
                          })}
                        </p>
                      </div>

                      {!notification.read && (
                        <Badge variant="default" className="bg-blue-600">
                          Нове
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
