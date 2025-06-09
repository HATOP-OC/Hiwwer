import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ShoppingCart, 
  MessageSquare, 
  CheckCircle, 
  Users, 
  Shield, 
  Clock, 
  Star,
  ArrowRight,
  Play,
  FileText,
  CreditCard,
  Smartphone
} from 'lucide-react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);

  const clientSteps = [
    {
      id: 1,
      title: 'Знайдіть послугу',
      description: 'Переглядайте тисячі професійних послуг або використовуйте пошук для знаходження потрібного.',
      icon: <Search className="h-8 w-8" />,
      details: [
        'Переглядайте категорії послуг',
        'Використовуйте фільтри для пошуку',
        'Порівнюйте різних виконавців',
        'Читайте відгуки та рейтинги'
      ]
    },
    {
      id: 2,
      title: 'Оберіть виконавця',
      description: 'Вивчіть профілі виконавців, їхні роботи та відгуки клієнтів.',
      icon: <Users className="h-8 w-8" />,
      details: [
        'Перевірте портфоліо виконавця',
        'Прочитайте відгуки попередніх клієнтів',
        'Перегляньте рейтинг та статистику',
        'Зв\'яжіться для уточнення деталей'
      ]
    },
    {
      id: 3,
      title: 'Оформіть замовлення',
      description: 'Опишіть ваші вимоги та здійсніть безпечну оплату через платформу.',
      icon: <ShoppingCart className="h-8 w-8" />,
      details: [
        'Детально опишіть ваше завдання',
        'Узгодьте терміни виконання',
        'Безпечна оплата через платформу',
        'Отримайте підтвердження замовлення'
      ]
    },
    {
      id: 4,
      title: 'Отримуйте оновлення',
      description: 'Слідкуйте за прогресом через Telegram-бот та спілкуйтесь з виконавцем.',
      icon: <MessageSquare className="h-8 w-8" />,
      details: [
        'Автоматичні сповіщення в Telegram',
        'Прямий зв\'язок з виконавцем',
        'Відстеження етапів виконання',
        'Можливість коригувати завдання'
      ]
    },
    {
      id: 5,
      title: 'Отримайте результат',
      description: 'Перевірте готову роботу, запросіть правки та залиште відгук.',
      icon: <CheckCircle className="h-8 w-8" />,
      details: [
        'Перевірка якості виконаної роботи',
        'Можливість запросити правки',
        'Завершення угоди після схвалення',
        'Залишення відгуку про роботу'
      ]
    }
  ];

  const performerSteps = [
    {
      id: 1,
      title: 'Створіть профіль',
      description: 'Зареєструйтесь та створіть привабливий профіль з описом ваших навичок.',
      icon: <FileText className="h-8 w-8" />,
      details: [
        'Заповніть детальну інформацію про себе',
        'Додайте портфоліо ваших робіт',
        'Опишіть ваші навички та досвід',
        'Пройдіть верифікацію профілю'
      ]
    },
    {
      id: 2,
      title: 'Створіть послуги',
      description: 'Опишіть ваші послуги, встановіть ціни та терміни виконання.',
      icon: <Star className="h-8 w-8" />,
      details: [
        'Створіть детальний опис послуги',
        'Встановіть конкурентну ціну',
        'Вкажіть терміни виконання',
        'Додайте приклади попередніх робіт'
      ]
    },
    {
      id: 3,
      title: 'Отримуйте замовлення',
      description: 'Реагуйте на замовлення клієнтів та спілкуйтесь через платформу.',
      icon: <Smartphone className="h-8 w-8" />,
      details: [
        'Отримуйте сповіщення про нові замовлення',
        'Спілкуйтесь з клієнтами в реальному часі',
        'Уточнюйте деталі завдання',
        'Підтверджуйте або відхиляйте замовлення'
      ]
    },
    {
      id: 4,
      title: 'Виконуйте роботу',
      description: 'Працюйте над проектом та надавайте регулярні оновлення клієнту.',
      icon: <Clock className="h-8 w-8" />,
      details: [
        'Розпочніть роботу після підтвердження',
        'Надавайте регулярні звіти про прогрес',
        'Дотримуйтесь обумовлених термінів',
        'Залучайте клієнта до процесу'
      ]
    },
    {
      id: 5,
      title: 'Отримайте оплату',
      description: 'Здавайте готову роботу та отримуйте гарантовану оплату.',
      icon: <CreditCard className="h-8 w-8" />,
      details: [
        'Здавайте якісну готову роботу',
        'Отримуйте схвалення від клієнта',
        'Автоматичне зарахування коштів',
        'Будуйте репутацію для майбутніх замовлень'
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: 'Безпечні платежі',
      description: 'Всі платежі проходять через захищену систему. Кошти утримуються до завершення роботи.'
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      title: 'Telegram інтеграція',
      description: 'Отримуйте сповіщення та спілкуйтесь через зручний Telegram-бот.'
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: 'Швидке виконання',
      description: 'Більшість послуг виконуються протягом 1-7 днів завдяки професійним виконавцям.'
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: 'Гарантія якості',
      description: 'Система рейтингів та відгуків забезпечує високу якість виконання.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-brand-blue to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Як працює Hiwwer?
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Простий і безпечний спосіб знайти професійні цифрові послуги або почати заробляти на своїх навичках
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/services">
                  <Play className="mr-2 h-5 w-5" />
                  Почати як клієнт
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/become-performer">
                  Стати виконавцем
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="client" className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Простий процес</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Виберіть вашу роль, щоб дізнатися, як користуватися платформою
                </p>
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="client">Для клієнтів</TabsTrigger>
                  <TabsTrigger value="performer">Для виконавців</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="client">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {clientSteps.map((step, index) => (
                    <Card 
                      key={step.id} 
                      className={`relative transition-all duration-300 cursor-pointer ${
                        activeStep === step.id ? 'ring-2 ring-brand-blue shadow-lg' : 'hover:shadow-md'
                      }`}
                      onClick={() => setActiveStep(step.id)}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 p-3 bg-brand-blue/10 rounded-full text-brand-blue">
                          {step.icon}
                        </div>
                        <Badge variant="secondary" className="mx-auto mb-2">
                          Крок {step.id}
                        </Badge>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {step.description}
                        </p>
                        {activeStep === step.id && (
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                      {index < clientSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performer">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {performerSteps.map((step, index) => (
                    <Card 
                      key={step.id} 
                      className={`relative transition-all duration-300 cursor-pointer ${
                        activeStep === step.id ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
                      }`}
                      onClick={() => setActiveStep(step.id)}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 p-3 bg-purple-500/10 rounded-full text-purple-500">
                          {step.icon}
                        </div>
                        <Badge variant="secondary" className="mx-auto mb-2">
                          Крок {step.id}
                        </Badge>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {step.description}
                        </p>
                        {activeStep === step.id && (
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                      {index < performerSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Чому обирають Hiwwer?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-blue to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Готові почати?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Приєднуйтесь до тисяч задоволених клієнтів та професійних виконавців на Hiwwer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/services">
                  Знайти послугу
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/become-performer">
                  Стати виконавцем
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HowItWorks;
