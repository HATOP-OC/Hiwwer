import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchServiceById, createOrder } from '@/lib/api';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CreateOrder() {
  const { t } = useTranslation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customBudget, setCustomBudget] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const isCustomOrder = !serviceId;

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchServiceById(serviceId!),
    enabled: !!serviceId
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) => createOrder(orderData),
    onSuccess: () => {
      toast({
        title: t('createOrderPage.toast.orderCreated'),
        description: t('createOrderPage.toast.orderCreatedDesc')
      });
      navigate('/my-orders');
    },
    onError: (error: any) => {
      toast({
        title: t('createOrderPage.toast.error'),
        description: error.message || t('createOrderPage.toast.createFailed'),
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (isCustomOrder) {
      if (!customTitle.trim()) {
        toast({
          title: t('createOrderPage.toast.error'),
          description: t('createOrderPage.toast.titleRequired'),
          variant: 'destructive'
        });
        return;
      }
      
      if (!customDescription.trim()) {
        toast({
          title: t('createOrderPage.toast.error'),
          description: t('createOrderPage.toast.descriptionRequired'),
          variant: 'destructive'
        });
        return;
      }
      
      if (!customBudget.trim()) {
        toast({
          title: t('createOrderPage.toast.error'),
          description: t('createOrderPage.toast.budgetRequired'),
          variant: 'destructive'
        });
        return;
      }
    }

    if (!requirements.trim()) {
      toast({
        title: t('createOrderPage.toast.error'),
        description: t('createOrderPage.toast.requirementsRequired'),
        variant: 'destructive'
      });
      return;
    }

    if (!deadline) {
      toast({
        title: t('createOrderPage.toast.error'),
        description: t('createOrderPage.toast.deadlineRequired'),
        variant: 'destructive'
      });
      return;
    }

    const orderData = isCustomOrder ? {
      title: customTitle,
      description: customDescription,
      requirements,
      deadline: new Date(deadline).toISOString(),
      budget: parseFloat(customBudget),
      category: customCategory || 'other',
      currency: 'USD',
      isCustom: true
    } : {
      serviceId: serviceId!,
      requirements,
      deadline: new Date(deadline).toISOString(),
      price: service?.price || 0,
      currency: 'USD',
      isCustom: false
    };

    createOrderMutation.mutate(orderData);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('createOrderPage.pleaseLoginTitle')}</h1>
            <p className="text-muted-foreground mb-8">{t('createOrderPage.pleaseLoginSubtitle')}</p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/login')}>
                {t('createOrderPage.login')}
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')}>
                {t('createOrderPage.register')}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading && !isCustomOrder) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('createOrderPage.loading')}</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (!service && !isCustomOrder) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t('createOrderPage.serviceNotFound')}</h1>
            <Button className="mt-4" onClick={() => navigate('/services')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('createOrderPage.backToServices')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('createOrderPage.back')}
          </Button>
          <h1 className="text-3xl font-bold">
            {isCustomOrder ? t('createOrderPage.createCustomOrderTitle') : t('createOrderPage.createOrderTitle')}
          </h1>
          <p className="text-muted-foreground">
            {isCustomOrder 
              ? t('createOrderPage.customOrderSubtitle')
              : t('createOrderPage.orderSubtitle')
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isCustomOrder ? t('createOrderPage.orderDetailsTitle') : t('createOrderPage.selectedServiceTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isCustomOrder ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="customTitle">{t('createOrderPage.customOrderNameLabel')}</Label>
                      <Input
                        id="customTitle"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder={t('createOrderPage.customOrderNamePlaceholder')}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customDescription">{t('createOrderPage.customOrderDescLabel')}</Label>
                      <Textarea
                        id="customDescription"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder={t('createOrderPage.customOrderDescPlaceholder')}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customBudget">{t('createOrderPage.budgetLabel')}</Label>
                        <Input
                          id="customBudget"
                          type="number"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          placeholder={t('createOrderPage.budgetPlaceholder')}
                          min="1"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customCategory">{t('createOrderPage.categoryLabel')}</Label>
                        <select
                          id="customCategory"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        >
                          <option value="">{t('createOrderPage.selectCategory')}</option>
                          <option value="web-development">{t('createOrderPage.categories.web-development')}</option>
                          <option value="design">{t('createOrderPage.categories.design')}</option>
                          <option value="marketing">{t('createOrderPage.categories.marketing')}</option>
                          <option value="copywriting">{t('createOrderPage.categories.copywriting')}</option>
                          <option value="translation">{t('createOrderPage.categories.translation')}</option>
                          <option value="video">{t('createOrderPage.categories.video')}</option>
                          <option value="audio">{t('createOrderPage.categories.audio')}</option>
                          <option value="other">{t('createOrderPage.categories.other')}</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-4">
                      <img 
                        src={service?.images?.[0] || '/placeholder.svg'} 
                        alt={service?.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{service?.title}</h3>
                        <p className="text-sm text-muted-foreground">{service?.description}</p>
                        <Badge className="mt-2">{service?.category?.name}</Badge>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span>{t('createOrderPage.price')}</span>
                      <span className="font-bold">${service?.price} USD</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('createOrderPage.orderDetailsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requirements">{t('createOrderPage.requirementsLabel')}</Label>
                  <Textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder={t('createOrderPage.requirementsPlaceholder')}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">{t('createOrderPage.deadlineLabel')}</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                {!isCustomOrder && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">{t('createOrderPage.summaryTitle')}</h4>
                      <div className="flex justify-between">
                        <span>{t('createOrderPage.cost')}</span>
                        <span>${service?.price} USD</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>{t('createOrderPage.total')}</span>
                        <span>${service?.price} USD</span>
                      </div>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createOrderMutation.isPending}
                >
                  <Package className="mr-2 h-4 w-4" />
                  {createOrderMutation.isPending ? t('createOrderPage.creating') : t('createOrderPage.createOrderButton')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </Layout>
  );
}