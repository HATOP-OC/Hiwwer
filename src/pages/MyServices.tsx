import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service } from '@/lib/api';

export default function MyServices() {
  const { user } = useAuth();
  
  // Отримання послуг користувача
  const { data: services = [], isLoading, refetch } = useQuery<Service[]>({
    queryKey: ['my-services'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/v1/services/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      return data.services;
    },
    enabled: !!user && user.role === 'performer',
  });

  // Перевірка доступу ПІСЛЯ всіх хуків
  if (user?.role !== 'performer') {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600">Доступ заборонено</h1>
          <p className="mt-2">Ця сторінка доступна тільки для виконавців.</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="py-12 text-center">Завантаження...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Мої послуги</h1>
            <p className="text-muted-foreground mt-2">
              Керуйте своїми послугами та переглядайте статистику
            </p>
          </div>
          <Button asChild>
            <Link to="/create-service">
              <Plus className="h-4 w-4 mr-2" />
              Створити послугу
            </Link>
          </Button>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground mb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Plus className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Поки що немає послуг</h3>
                <p>Створіть свою першу послугу, щоб почати отримувати замовлення</p>
              </div>
              <Button asChild>
                <Link to="/create-service">
                  Створити послугу
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/services/${service.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/edit-service/${service.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      {service.currency} {Number(service.price).toFixed(2)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {service.rating ? service.rating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{service.category.name}</Badge>
                    <div className="text-sm text-muted-foreground">
                      {service.delivery_time} днів
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {service.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                    {service.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{service.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
