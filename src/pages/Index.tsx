import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, ArrowRight, Star, Palette, Code, PenSquare, TrendingUp, Film, Music, Briefcase, BookOpen, ClipboardList, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

export default function Index() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const showcaseServices = [
    {
      id: 'showcase-1',
      key: 'design',
      categorySlug: 'design',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&h=350&fit=crop&q=80',
      rating: '4.9',
      currency: 'USD',
    },
    {
      id: 'showcase-2',
      key: 'development',
      categorySlug: 'web-development',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=350&fit=crop&q=80',
      rating: '4.8',
      currency: 'USD',
    },
    {
      id: 'showcase-3',
      key: 'marketing',
      categorySlug: 'marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=350&fit=crop&q=80',
      rating: '4.7',
      currency: 'USD',
    },
    {
      id: 'showcase-4',
      key: 'writing',
      categorySlug: 'copywriting',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=350&fit=crop&q=80',
      rating: '4.6',
      currency: 'USD',
    }
  ];

  const serviceCategories = [
    { id: '1', name: t('categories.design'), icon: 'design', description: t('categories.design_desc') },
    { id: '2', name: t('categories.development'), icon: 'development', description: t('categories.development_desc') },
    { id: '3', name: t('categories.writing'), icon: 'writing', description: t('categories.writing_desc') },
    { id: '4', name: t('categories.marketing'), icon: 'marketing', description: t('categories.marketing_desc') },
    { id: '5', name: t('categories.video'), icon: 'video', description: t('categories.video_desc') },
    { id: '6', name: t('categories.audio'), icon: 'audio', description: t('categories.audio_desc') },
    { id: '7', name: t('categories.business'), icon: 'business', description: t('categories.business_desc') },
    { id: '8', name: t('categories.learning'), icon: 'learning', description: t('categories.learning_desc') }
  ];

  const workflowSteps = [
    { id: '1', title: t('howItWorks.step1_title'), description: t('howItWorks.step1_desc'), icon: 'search' },
    { id: '2', title: t('howItWorks.step2_title'), description: t('howItWorks.step2_desc'), icon: 'order' },
    { id: '3', title: t('howItWorks.step3_title'), description: t('howItWorks.step3_desc'), icon: 'updates' },
    { id: '4', title: t('howItWorks.step4_title'), description: t('howItWorks.step4_desc'), icon: 'result' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue to-brand-darkBlue text-white py-16">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl opacity-90 animate-slide-in">
            {t('hero.subtitle')}
          </p>
          
          <div className="w-full max-w-md mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                className="pl-10 pr-4 py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button size="lg" asChild className="rounded-full px-8 bg-brand-amber hover:bg-brand-amber/90 text-white">
              <Link to="/services">{t('hero.browseServices')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 border-white/20 text-white hover:bg-white/10">
              <Link to="/create-custom-order">{t('hero.createOrder')}</Link>
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>{t('hero.qualityWork')}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>{t('hero.securePayments')}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>{t('hero.telegramUpdates')}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="text-brand-amber mr-2 h-5 w-5" />
              <span>{t('hero.support247')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('categories.title')}</h2>
          
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
            <h2 className="text-3xl font-bold">{t('featured.title')}</h2>
            <Button variant="outline" asChild className="self-start sm:self-auto">
              <Link to="/services">
                {t('featured.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseServices.map(service => (
              <Link to={`/services?category=${service.categorySlug}`} key={service.id}>
                <Card className="overflow-hidden hover-card border group transition-all duration-300 hover:shadow-lg">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={t(`featured.showcase.${service.key}.title`)}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-brand-teal hover:bg-brand-teal text-white">
                        {t(`featured.showcase.${service.key}.price`)} {service.currency}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-amber-500">
                        <Star className="fill-amber-500 stroke-amber-500 h-4 w-4" />
                        <span className="ml-1 text-sm font-semibold">{service.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t(`featured.showcase.${service.key}.deliveryTime`)}</span>
                    </div>
                    
                    <h3 className="font-bold mb-2 line-clamp-1">{t(`featured.showcase.${service.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {t(`featured.showcase.${service.key}.description`)}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {(t(`featured.showcase.${service.key}.tags`, { returnObjects: true }) as string[]).slice(0, 3).map((tag: string, index: number) => (
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
          <h2 className="text-3xl font-bold mb-12 text-center">{t('howItWorks.title')}</h2>
          
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
              <Link to="/register">{t('howItWorks.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Telegram Integration Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">{t('telegram.title')}</h2>
              <p className="text-lg mb-6 opacity-90">
                {t('telegram.subtitle')}
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>{t('telegram.feature1')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>{t('telegram.feature2')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>{t('telegram.feature3')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-brand-amber" />
                  <span>{t('telegram.feature4')}</span>
                </li>
              </ul>
              
              <Button size="lg" asChild className="bg-brand-amber hover:bg-brand-amber/90 text-white">
                <Link to="https://t.me/hiwwer_bot" target="_blank">
                  {t('telegram.connect')}
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
                      {t('telegram.botWelcome')}
                    </div>
                    <span className="text-xs opacity-50 mt-1">Hiwwer Bot, 10:45</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="bg-white/20 p-2 rounded-t-lg rounded-l-lg self-end max-w-[80%]">
                      {t('telegram.userMessage')}
                    </div>
                    <span className="text-xs opacity-50 mt-1 self-end">Ви, 10:46</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="bg-blue-600 text-white p-2 rounded-t-lg rounded-r-lg self-start max-w-[80%]">
                      {t('telegram.botResponse')}
                    </div>
                    <span className="text-xs opacity-50 mt-1">Hiwwer Bot, 10:47</span>
                  </div>
                </div>
                
                <div className="flex">
                  <Input 
                    type="text" 
                    placeholder={t('telegram.messagePlaceholder')}
                    className="mr-2 bg-white/10 border-white/20 placeholder:text-white/50 text-white"
                  />
                  <Button size="sm" className="bg-brand-amber hover:bg-brand-amber/90">{t('telegram.send')}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
            {t('cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/services">
                {t('cta.findService')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register?role=performer">
                {t('cta.becomePerformer')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}