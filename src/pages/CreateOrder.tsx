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

export default function CreateOrder() {
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
        title: 'Замовлення створено',
        description: 'Ваше замовлення успішно створено. Ви можете відстежувати його статус в розділі "Мої замовлення".'
      });
      navigate('/my-orders');
    },
    onError: (error: any) => {
      toast({
        title: 'Помилка',
        description: error.message || 'Не вдалося створити замовлення',
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
          title: 'Помилка',
          description: 'Будь ласка, вкажіть назву замовлення',
          variant: 'destructive'
        });
        return;
      }
      
      if (!customDescription.trim()) {
        toast({
          title: 'Помилка',
          description: 'Будь ласка, опишіть ваше замовлення',
          variant: 'destructive'
        });
        return;
      }
      
      if (!customBudget.trim()) {
        toast({
          title: 'Помилка',
          description: 'Будь ласка, вкажіть ваш бюджет',
          variant: 'destructive'
        });
        return;
      }
    }

    if (!requirements.trim()) {
      toast({
        title: 'Помилка',
        description: 'Будь ласка, опишіть ваші вимоги до замовлення',
        variant: 'destructive'
      });
      return;
    }

    if (!deadline) {
      toast({
        title: 'Помилка',
        description: 'Будь ласка, вкажіть бажаний термін виконання',
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

  // Early return AFTER all hooks
  if (!user) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Увійдіть, щоб створити замовлення</h1>
            <p className="text-muted-foreground mb-8">Для створення замовлення необхідно мати аккаунт на платформі</p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/login')}>
                Увійти
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')}>
                Зареєструватися
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
            <h1 className="text-2xl font-bold">Завантаження...</h1>
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
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">
            {isCustomOrder ? 'Створити власне замовлення' : 'Створити замовлення'}
          </h1>
          <p className="text-muted-foreground">
            {isCustomOrder 
              ? 'Опишіть ваше замовлення і знайдіть ідеального виконавця'
              : 'Заповніть форму нижче, щоб створити замовлення'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Ліва колонка */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isCustomOrder ? 'Деталі замовлення' : 'Обрана послуга'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isCustomOrder ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="customTitle">Назва замовлення*</Label>
                      <Input
                        id="customTitle"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="Наприклад: Розробка логотипу для стартапу"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customDescription">Опис замовлення*</Label>
                      <Textarea
                        id="customDescription"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Детально опишіть, що вам потрібно..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customBudget">Бюджет (USD)*</Label>
                        <Input
                          id="customBudget"
                          type="number"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          placeholder="100"
                          min="1"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customCategory">Категорія</Label>
                        <select
                          id="customCategory"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        >
                          <option value="">Оберіть категорію</option>
                          <option value="web-development">Веб-розробка</option>
                          <option value="design">Дизайн</option>
                          <option value="marketing">Маркетинг</option>
                          <option value="copywriting">Копірайтинг</option>
                          <option value="translation">Переклад</option>
                          <option value="video">Відео</option>
                          <option value="audio">Аудіо</option>
                          <option value="other">Інше</option>
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
                      <span>Ціна:</span>
                      <span className="font-bold">${service?.price} USD</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Права колонка */}
            <Card>
              <CardHeader>
                <CardTitle>Деталі замовлення</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Ваші вимоги*</Label>
                  <Textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Опишіть детально, що саме вам потрібно..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Бажаний термін виконання*</Label>
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
                      <h4 className="font-medium">Підсумок</h4>
                      <div className="flex justify-between">
                        <span>Вартість:</span>
                        <span>${service?.price} USD</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Загалом:</span>
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
                  {createOrderMutation.isPending ? 'Створення...' : 'Створити замовлення'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </Layout>
  );
}
