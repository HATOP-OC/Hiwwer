
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, CheckCircle, ArrowRight, Star, Palette, Code, PenSquare, TrendingUp, Film, Music, Briefcase, BookOpen, ClipboardList, Smartphone } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  design: Palette,
  development: Code,
  writing: PenSquare,
  marketing: TrendingUp,
  video: Film,
  audio: Music,
  business: Briefcase,
  learning: BookOpen,
  search: Search,
  order: ClipboardList,
  updates: Smartphone,
  result: CheckCircle,
};

// Презентаційні послуги для демонстрації можливостей платформи
const showcaseServices = [
  {
    id: 'showcase-1',
    title: 'Креативний Дизайн',
    description: 'Професійний дизайн для вашого бренду від досвідчених креативних спеціалістів.',
    category: 'design',
    tags: ['Логотипи', 'Брендинг', 'UI/UX'],
    price: 'від 50',
    currency: 'USD',
    deliveryTime: '1-3 дні',
    rating: '4.9',
    reviewCount: 'Багато позитивних відгуків',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&h=350&fit=crop&q=80'
  },
  {
    id: 'showcase-2',
    title: 'Веб-розробка',
    description: 'Сучасні веб-додатки та сайти з використанням найновіших технологій.',
    category: 'development',
    tags: ['React', 'Next.js', 'TypeScript'],
    price: 'від 200',
    currency: 'USD',
    deliveryTime: '5-14 днів',
    rating: '4.8',
    reviewCount: 'Високі оцінки клієнтів',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=350&fit=crop&q=80'
  },
  {
    id: 'showcase-3',
    title: 'Цифровий Маркетинг',
    description: 'Ефективні маркетингові стратегії для росту вашого бізнесу.',
    category: 'marketing',
    tags: ['SEO', 'SMM', 'Реклама'],
    price: 'від 100',
    currency: 'USD',
    deliveryTime: '3-7 днів',
    rating: '4.7',
    reviewCount: 'Доведена ефективність',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=350&fit=crop&q=80'
  },
  {
    id: 'showcase-4',
    title: 'Контент-створення',
    description: 'Якісний контент для ваших проектів та соціальних мереж.',
    category: 'writing',
    tags: ['Тексти', 'Блоги', 'Копірайтинг'],
    price: 'від 30',
    currency: 'USD',
    deliveryTime: '1-2 дні',
    rating: '4.6',
    reviewCount: 'Швидко та якісно',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=350&fit=crop&q=80'
  }
];

// Популярні категорії послуг
const serviceCategories = [
  { id: '1', name: 'Дизайн', icon: 'design', description: 'Креативні рішення' },
  { id: '2', name: 'Розробка', icon: 'development', description: 'Веб та мобільні додатки' },
  { id: '3', name: 'Тексти', icon: 'writing', description: 'Якісний контент' },
  { id: '4', name: 'Маркетинг', icon: 'marketing', description: 'Просування бізнесу' },
  { id: '5', name: 'Відео', icon: 'video', description: 'Відеопродукція' },
  { id: '6', name: 'Аудіо', icon: 'audio', description: 'Звукові рішення' },
  { id: '7', name: 'Бізнес', icon: 'business', description: 'Консалтинг' },
  { id: '8', name: 'Навчання', icon: 'learning', description: 'Освітні послуги' }
];

// Як працює платформа Hiwwer
const workflowSteps = [
  {
    id: '1',
    title: 'Знайдіть послугу',
    description: 'Оберіть потрібну послугу з широкого асортименту талановитих виконавців.',
    icon: 'search'
  },
  {
    id: '2',
    title: 'Оформте замовлення',
    description: 'Опишіть ваші вимоги і безпечно здійсніть оплату.',
    icon: 'order'
  },
  {
    id: '3',
    title: 'Отримуйте оновлення',
    description: 'Слідкуйте за прогресом через зручний Telegram-бот.',
    icon: 'updates'
  },
  {
    id: '4',
    title: 'Отримайте результат',
    description: 'Перевірте роботу і запросіть правки за потреби.',
    icon: 'result'
  }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue to-brand-darkBlue text-white py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Знайдіть ідеальну цифрову послугу
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl opacity-90 animate-slide-in">
            Підключайтесь до експертів та реалізовуйте проекти з інтеграцією Telegram
          </p>
          
          <div className="w-full max-w-md mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Шукайте послуги..."
                className="pl-10 pr-4 py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button size="lg" asChild className="rounded-full px-8 bg-brand-amber hover:bg-brand-amber/90 text-white">
              <Link to="/services">Переглянути послуги</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 border-white/20 text-white hover:bg-white/10">
              <Link to="/services">Створити замовлення</Link>
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>Якісна робота</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>Безпечні платежі</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>Telegram оновлення</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>24/7 підтримка</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Популярні категорії</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {serviceCategories.map(category => {
              const Icon = iconMap[category.icon];
              return (
                <Link to={`/services?category=${category.name.toLowerCase()}`} key={category.id}>
                  <div className="bg-card hover-card rounded-lg p-4 flex flex-col items-center justify-center text-center h-32 group transition-all duration-300">
                    {Icon && <Icon className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300" />}
                    <h3 className="font-medium mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold">Рекомендовані послуги</h2>
            <Button variant="outline" asChild className="self-start sm:self-auto">
              <Link to="/services">
                Переглянути всі <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseServices.map(service => (
              <Link to={`/services/${service.id}`} key={service.id}>
                <Card className="overflow-hidden hover-card border group transition-all duration-300 hover:shadow-lg">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-brand-teal hover:bg-brand-teal text-white">
                        {service.price} {service.currency}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-amber-500">
                        <Star className="fill-amber-500 stroke-amber-500 h-4 w-4" />
                        <span className="ml-1 text-sm font-semibold">{service.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{service.deliveryTime}</span>
                    </div>
                    
                    <h3 className="font-bold mb-2 line-clamp-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {service.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Як це працює</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => {
              const Icon = iconMap[step.icon];
              return (
                <div key={step.id} className="flex flex-col items-center text-center relative">
                  {Icon && <Icon className="text-4xl mb-4" />}
                  <div className="text-2xl font-bold mb-2 text-primary">{step.title}</div>
                  <p className="text-muted-foreground">{step.description}</p>

                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                      <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button size="lg" asChild>
              <Link to="/register">Почати роботу</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Telegram Integration Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Безшовна інтеграція з Telegram</h2>
              <p className="text-lg mb-6 opacity-90">
                Слідкуйте за замовленнями та спілкуйтесь з виконавцями безпосередньо через наш Telegram-бот.
                Отримуйте сповіщення, керуйте замовленнями та спілкуйтесь - все не виходячи з Telegram.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>Миттєві сповіщення про замовлення</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>Прямий чат з клієнтами/виконавцями</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>Оновлення статусу замовлень</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>Нагадування про дедлайни</span>
                </li>
              </ul>
              
              <Button size="lg" asChild className="bg-brand-amber hover:bg-brand-amber/90 text-white">
                <Link to="https://t.me/hiwwer_bot" target="_blank">
                  Підключити Telegram
                </Link>
              </Button>
            </div>
            
            <div className="md:w-1/2 md:pl-8">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="ml-3">
                    <div className="font-bold">Hiwwer Bot</div>
                    <div className="text-xs opacity-70">Онлайн</div>
                  </div>
                </div>
                
                {/* Презентаційний чат */}
                <div className="space-y-3 mb-4">
                  <div className="flex flex-col">
                    <div className="bg-blue-600 text-white p-2 rounded-t-lg rounded-r-lg self-start max-w-[80%]">
                      Вітаємо в Hiwwer Bot! Я допоможу вам керувати замовленнями та спілкуватися з виконавцями.
                    </div>
                    <span className="text-xs opacity-50 mt-1">Hiwwer Bot, 10:45</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="bg-white/20 p-2 rounded-t-lg rounded-l-lg self-end max-w-[80%]">
                      Привіт! Хочу перевірити статус замовлення.
                    </div>
                    <span className="text-xs opacity-50 mt-1 self-end">Ви, 10:46</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="bg-blue-600 text-white p-2 rounded-t-lg rounded-r-lg self-start max-w-[80%]">
                      Ваше замовлення виконується згідно плану. Очікуваний термін завершення - завтра.
                    </div>
                    <span className="text-xs opacity-50 mt-1">Hiwwer Bot, 10:47</span>
                  </div>
                </div>
                
                <div className="flex">
                  <Input 
                    type="text" 
                    placeholder="Напишіть повідомлення..." 
                    className="mr-2 bg-white/10 border-white/20 placeholder:text-white/50 text-white"
                  />
                  <Button size="sm" className="bg-brand-amber hover:bg-brand-amber/90">Відправити</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готові почати?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
            Приєднуйтесь до Hiwwer сьогодні та знаходьте талановитих виконавців або пропонуйте свої навички клієнтам по всьому світу.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/services">
                Знайти послугу
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register?role=performer">
                Стати виконавцем
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}