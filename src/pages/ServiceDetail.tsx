import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceById } from '@/lib/api';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Star, ArrowLeft, ShoppingCart, Clock, DollarSign, User, Package } from 'lucide-react';

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchServiceById(serviceId!),
    enabled: !!serviceId
  });

  const handleCreateOrder = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/create-order/${serviceId}` } });
      return;
    }
    navigate(`/create-order/${serviceId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-6xl py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold">Завантаження...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="container max-w-6xl py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold">Послугу не знайдено</h1>
            <Button className="mt-4" onClick={() => navigate('/services')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Повернутися до послуг
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Основна інформація */}
          <div className="lg:col-span-2 space-y-6">
            {/* Зображення */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={service.images?.[0] || '/placeholder.svg'}
                    alt={service.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Опис */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{service.rating?.toFixed(1) || '0.0'}</span>
                    <span className="ml-1 text-muted-foreground">({service.review_count || 0} відгуків)</span>
                  </div>
                  <Badge>{service.category?.name}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {service.tags && service.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Теги:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag: any) => (
                        <Badge key={tag.id} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Інформація про виконавця */}
            <Card>
              <CardHeader>
                <CardTitle>Про виконавця</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={service.performer?.avatar_url || '/placeholder.svg'} 
                      alt={service.performer?.name} 
                    />
                    <AvatarFallback>
                      {service.performer?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg">{service.performer?.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {service.rating?.toFixed(1) || '0.0'}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Досвідчений виконавець
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Професійний виконавець на платформі
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Панель замовлення */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Замовити послугу</span>
                  <div className="text-2xl font-bold text-green-600">
                    ${service.price}
                  </div>
                </CardTitle>
                <CardDescription>
                  Натисніть кнопку нижче, щоб створити замовлення
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Час виконання:</span>
                    </div>
                    <span className="font-medium">{service.delivery_time} днів</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Валюта:</span>
                    </div>
                    <span className="font-medium">{service.currency}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Категорія:</span>
                    </div>
                    <span className="font-medium">{service.category?.name}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Вартість послуги:</span>
                    <span>${service.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Комісія платформи:</span>
                    <span>$0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Загальна сума:</span>
                    <span>${service.price}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCreateOrder}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {user ? 'Замовити послугу' : 'Увійти та замовити'}
                </Button>

                {!user && (
                  <p className="text-xs text-center text-muted-foreground">
                    Для створення замовлення необхідно увійти в акаунт
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Додаткова інформація */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Що включено в послугу:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <span>Професійне виконання роботи</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <span>Підтримка під час виконання</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <span>Можливість доопрацювання</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <span>Гарантія якості</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
