import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, ShoppingCart, AlertCircle, Clock, DollarSign, Star } from 'lucide-react';
import { fetchNotifications, markNotificationRead, Notification } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useWebSocket } from '@/hooks/useWebSocket';

const notificationIcons: Record<string, any> = {
  'message': MessageSquare,
  'new_order': ShoppingCart,
  'status_change': AlertCircle,
  'deadline': Clock,
  'payment': DollarSign,
  'review': Star,
  'dispute': AlertCircle,
};

export default function NotificationMenu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket, isConnected, connect, onNotification } = useWebSocket();

  // Підключаємось до WebSocket при mount
  useEffect(() => {
    connect();
  }, [connect]);

  const { data: notifications = [] } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Real-time оновлення через WebSocket
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    onNotification(handleNewNotification);

    return () => {
      // Cleanup handled by hook
    };
  }, [socket, isConnected, onNotification, queryClient]);

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markRead.mutate(notification.id);
    }

    if (notification.relatedId) {
      if (notification.type === 'message' || notification.type === 'new_order' || notification.type === 'status_change') {
        navigate(`/orders/${notification.relatedId}`);
      } else if (notification.type === 'review') {
        navigate('/profile');
      }
    }
  };

  const latestNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Сповіщення</span>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} нових</Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {latestNotifications.length === 0 ? (
          <div className="py-8 px-4 text-center text-sm text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Немає сповіщень</p>
          </div>
        ) : (
          <>
            {latestNotifications.map(notification => {
              const Icon = notificationIcons[notification.type] || Bell;
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`cursor-pointer flex items-start gap-3 p-3 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-950' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`p-1.5 rounded-full ${
                    !notification.read 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      !notification.read ? 'text-blue-600' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm leading-tight ${
                      !notification.read ? 'font-semibold' : ''
                    }`}>
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
                    <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                  )}
                </DropdownMenuItem>
              );
            })}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center justify-center font-medium text-blue-600 cursor-pointer"
              onClick={() => navigate('/notifications')}
            >
              Переглянути всі сповіщення
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
