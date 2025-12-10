import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceById, getImageUrl } from '@/lib/api';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarSrc, formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, ArrowLeft, ShoppingCart, Clock, DollarSign, User, Package, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ServiceDetail() {
  const { t } = useTranslation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Перевірка чи це UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchServiceById(serviceId!),
    enabled: !!serviceId && uuidRegex.test(serviceId)
  });

  // Якщо serviceId не є UUID, перенаправляємо на сторінку послуг
  if (serviceId && !uuidRegex.test(serviceId)) {
    navigate('/services', { replace: true });
    return null;
  }

  const handleCreateOrder = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/create-order/${serviceId}` } });
      return;
    }
    if (service && service.performer.id === user.id) {
      toast({
        title: t('serviceDetailPage.cannotOrderOwnService', 'You cannot order your own service.'),
        variant: 'destructive',
      });
      return;
    }
    navigate(`/create-order/${serviceId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold">{t('serviceDetailPage.loading')}</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-red-600">
              {error ? 'Помилка завантаження послуги' : t('serviceDetailPage.serviceNotFound')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {error ? `Сталася помилка: ${error.message}` : 'Послуга не знайдена або недоступна.'}
            </p>
            <p className="mt-2 text-sm">Service ID: {serviceId}</p>
            <Button className="mt-4" onClick={() => navigate('/services')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('serviceDetailPage.backToServices')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('serviceDetailPage.back')}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Основна інформація */}
          <div className="lg:col-span-2 space-y-6">
            {/* Зображення */}
            {service.images && service.images.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {service.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-video relative overflow-hidden rounded-t-lg">
                            <img
                              src={getImageUrl(image)}
                              alt={`${service.title} ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {service.images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Інформація про послугу */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                        <span>({service.review_count} відгуків)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{t('serviceDetailPage.days', { count: service.delivery_time })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(service.price, service.currency)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Опис */}
                <div>
                  <h3 className="font-semibold mb-2">{t('serviceDetailPage.description')}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{service.description}</p>
                </div>

                {/* Категорія */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{t('serviceDetailPage.category')}</span>
                  <Badge variant="secondary">{service.category?.name}</Badge>
                </div>

                {/* Теги */}
                {service.tags && service.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">{t('serviceDetailPage.tags')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map(tag => (
                        <Badge key={tag.id} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Інформація про виконавця */}
                <div>
                  <h3 className="font-semibold mb-3">{t('serviceDetailPage.aboutPerformer')}</h3>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getAvatarSrc(service.performer?.avatar_url)} />
                      <AvatarFallback>
                        {service.performer?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{service.performer?.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {t('serviceDetailPage.experiencedPerformer')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{service.performer?.rating || 0}</span>
                        </div>
                        <span>{t('serviceDetailPage.professionalOnPlatform')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Панель замовлення */}
          <div className="space-y-6">
            <Card className="lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('serviceDetailPage.orderService')}</span>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(service.price, service.currency)}
                  </div>
                </CardTitle>
                <CardDescription>
                  {t('serviceDetailPage.orderServiceDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t('serviceDetailPage.serviceCost')}</span>
                    <span>{formatCurrency(service.price, service.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{t('serviceDetailPage.platformFee')}</span>
                    <span>{formatCurrency(0, service.currency)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-bold">
                    <span>{t('serviceDetailPage.totalAmount')}</span>
                    <span>{formatCurrency(service.price, service.currency)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreateOrder}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {user ? t('serviceDetailPage.orderNow') : t('serviceDetailPage.loginToOrder')}
                </Button>

                {!user && (
                  <p className="text-xs text-center text-muted-foreground">
                    {t('serviceDetailPage.loginRequired')}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Додаткова інформація */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('serviceDetailPage.whatIsIncluded')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t('serviceDetailPage.professionalExecution')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t('serviceDetailPage.supportDuringExecution')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t('serviceDetailPage.possibilityOfRevision')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{t('serviceDetailPage.qualityGuarantee')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
