import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { fetchNotifications, markNotificationRead, Notification } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

export default function NotificationMenu() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications
  });
  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Notification[]>({ queryKey: ['notifications'] }, old =>
        old?.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1">
              {unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{t('notificationMenu.title')}</DropdownMenuLabel>
        {notifications.length === 0 && (
          <DropdownMenuItem asChild>
            <div className="text-sm text-muted-foreground">{t('notificationMenu.noNotifications')}</div>
          </DropdownMenuItem>
        )}
        {notifications.map(n => (
          <DropdownMenuItem
            key={n.id}
            className={n.read ? 'opacity-50' : 'font-medium'}
            onSelect={() => !n.read && markRead.mutate(n.id)}
          >
            <div className="flex flex-col">
              <span className="truncate">{n.content}</span>
              <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}