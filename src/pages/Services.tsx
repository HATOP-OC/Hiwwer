import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Star, Search, Filter as FilterIcon, ChevronDown, ChevronUp, Palette, Code, PenSquare, TrendingUp, Film, Music, Briefcase, BookOpen, Package } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarSrc } from '@/lib/utils';
import { fetchServices, fetchServiceCategories, Service, ServiceCategory, getImageUrl } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

export default function Services() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, activeRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const iconMap: { [key: string]: React.ElementType } = {
    'design': Palette,
    'web-development': Code,
    'copywriting': PenSquare,
    'marketing': TrendingUp,
    'video': Film,
    'audio': Music,
    'translation': BookOpen,
    'other': Briefcase,
  };

  // Завантаження категорій при монтуванні компонента
  useEffect(() => {
    fetchServiceCategories()
      .then(data => {
        console.log('Categories loaded:', data);
        setCategories(data);
      })
      .catch(error => {
        console.error('Error loading categories:', error);
      });
  }, []);

  // Обробка параметра category з URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.length > 0) {
      const matchedCategory = categories.find(
        c => c.slug.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategories([matchedCategory.slug]);
      }
    } else if (!categoryParam) {
      // Якщо немає параметра категорії в URL, очищаємо вибрані категорії
      setSelectedCategories([]);
    }
  }, [searchParams, categories]);

  // Завантаження послуг
  useEffect(() => {
    console.log('Services: Starting to fetch services...');
    const categoryParam = searchParams.get('category');
    // Завантажуємо послуги з бекенду (з фільтром по категорії якщо є в URL)
    fetchServices(1, 100, categoryParam || undefined)
      .then(data => {
        console.log('Services: Received data:', data);
        setAllServices(data);
      })
      .catch(error => {
        console.error('Services: Error fetching services:', error);
      })
      .finally(() => {
        console.log('Services: Finished loading');
        setLoading(false);
      });
  }, [searchParams]);

  // Фільтрація послуг на фронтенді
  useEffect(() => {
    let filtered = [...allServices];
    
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(s => selectedCategories.includes(s.category.slug));
    }
    
    filtered = filtered.filter(service => 
      service.price >= priceRange[0] && service.price <= priceRange[1]
    );
    
    if (selectedRating) {
      filtered = filtered.filter(s => s.rating >= selectedRating);
    }
    
    setServices(filtered);
  }, [searchTerm, selectedCategories, priceRange, selectedRating, allServices]);

  const handleCategoryChange = (categorySlug: string) => {
    // Очищаємо параметр category з URL при ручній зміні фільтра
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    navigate({ search: newParams.toString() }, { replace: true });
    
    setSelectedCategories(prev => {
      if (prev.includes(categorySlug)) {
        return prev.filter(slug => slug !== categorySlug);
      } else {
        return [...prev, categorySlug];
      }
    });
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(selectedRating === rating ? null : rating);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    setSelectedRating(null);
  };

  const handleOrderService = (service: Service, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { returnTo: `/create-order/${service.id}` } });
      return;
    }

    if (service.performer.id === user.id) {
      // Cannot order own service
      toast({
        title: t('servicesPage.cannotOrderOwnService'),
        variant: 'destructive',
      });
      return;
    }

    navigate(`/create-order/${service.id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>{t('servicesPage.loading')}</p>
        </div>
      </Layout>
    );
  }

  if (activeRole === 'performer') {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600">{t('myServicesPage.accessDenied')}</h1>
          <p className="mt-2">{t('servicesPage.onlyForClients')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('servicesPage.title')}</h1>
              <p className="text-muted-foreground">{t('servicesPage.subtitle')}</p>
            </div>
            {user && (
              <Button asChild>
                <Link to="/my-orders">
                  {t('servicesPage.myOrders')}
                </Link>
              </Button>
            )}
          </div>
          <div className="relative max-w-xl">
            <Input
              type="text"
              placeholder={t('servicesPage.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <div className="flex items-center">
                <FilterIcon className="mr-2 h-4 w-4" />
                <span>{t('servicesPage.filters')}</span>
              </div>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {showFilters && (
              <Card className="mt-2">
                <CardContent className="pt-4">
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">{t('servicesPage.categories')}</h3>
                    <div className="space-y-2">
                      {categories.map(category => {
                        const Icon = iconMap[category.slug] || Briefcase;
                        return (
                          <div key={category.id} className="flex items-center">
                            <Checkbox
                              id={`mobile-category-${category.id}`}
                              checked={selectedCategories.includes(category.slug)}
                              onCheckedChange={() => handleCategoryChange(category.slug)}
                            />
                            <Label htmlFor={`mobile-category-${category.id}`} className="ml-2 flex items-center">
                              {Icon && <Icon className="mr-2 h-4 w-4" />}
                              {t(`categories.${category.slug}`)}
                              {category.service_count !== undefined && (
                                <span className="ml-1 text-muted-foreground text-xs">({category.service_count})</span>
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">{t('servicesPage.price')}</h3>
                    <Slider
                      defaultValue={priceRange}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="font-medium mb-2">{t('servicesPage.minRating')}</h3>
                    <div className="space-y-2">
                      {[4, 4.5, 4.8].map(rating => (
                        <div key={rating} className="flex items-center">
                          <Checkbox
                            id={`mobile-rating-${rating}`}
                            checked={selectedRating === rating}
                            onCheckedChange={() => handleRatingChange(rating)}
                          />
                          <Label htmlFor={`mobile-rating-${rating}`} className="ml-2 flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {rating}+
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={resetFilters}
                  >
                    {t('servicesPage.resetFilters')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="hidden md:block w-64 shrink-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">{t('servicesPage.filters')}</h3>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">{t('servicesPage.categories')}</h4>
                  <div className="space-y-2">
                    {categories.map(category => {
                      const Icon = iconMap[category.slug] || Briefcase;
                      return (
                        <div key={category.id} className="flex items-center">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.slug)}
                            onCheckedChange={() => handleCategoryChange(category.slug)}
                          />
                          <Label htmlFor={`category-${category.id}`} className="ml-2 flex items-center">
                            {Icon && <Icon className="mr-2 h-4 w-4" />}
                            {t(`categories.${category.slug}`)}
                            {category.service_count !== undefined && (
                              <span className="ml-1 text-muted-foreground text-xs">({category.service_count})</span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">{t('servicesPage.price')}</h4>
                  <Slider
                    defaultValue={priceRange}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">{t('servicesPage.minRating')}</h4>
                  <div className="space-y-2">
                    {[4, 4.5, 4.8].map(rating => (
                      <div key={rating} className="flex items-center">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={selectedRating === rating}
                          onCheckedChange={() => handleRatingChange(rating)}
                        />
                        <Label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {rating}+
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={resetFilters}
                >
                  {t('servicesPage.resetFilters')}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">{t('servicesPage.servicesFound', { count: services.length })}</h2>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/create-custom-order')}
                >
                  {t('servicesPage.createCustomOrder')}
                </Button>
              </div>
            </div>

            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <Card key={service.id} className="overflow-hidden hover-card border group transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                    <Link to={`/services/${service.id}`}>
                        <div className="aspect-video relative overflow-hidden">
                          {service.images && service.images.length > 0 && service.images[0] && !service.images[0].includes('placeholder') ? (
                            <img
                              src={getImageUrl(service.images[0])}
                              alt={service.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Package className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-brand-teal hover:bg-brand-teal text-white">
                            {service.price} {service.currency}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <Link to={`/services/${service.id}`}>
                        <div className="flex items-center mb-3">
                          <div className="flex items-center text-amber-500">
                            <Star className="fill-amber-500 stroke-amber-500 h-4 w-4" />
                            <span className="ml-1 text-sm font-semibold">{service.rating}</span>
                            <span className="ml-1 text-xs text-muted-foreground">({service.review_count})</span>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground">{t('servicesPage.deliveryTime', { count: service.delivery_time })}</span>
                        </div>
                        <h3 className="font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                      </Link>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.tags.slice(0, 3).map(tag => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center mb-3 pt-3 border-t">
                        <div className="mr-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={getAvatarSrc(service.performer?.avatar_url)} />
                            <AvatarFallback>
                              {service.performer?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="text-sm">{service.performer?.name}</span>
                      </div>
                      
                      <div className="flex gap-2 mt-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          asChild
                        >
                          <Link to={`/services/${service.id}`}>
                            {t('servicesPage.details')}
                          </Link>
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => handleOrderService(service, e)}
                        >
                          {user ? t('servicesPage.order') : t('servicesPage.loginAndOrder')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <h3 className="text-lg font-medium">{t('servicesPage.noResults.title')}</h3>
                </div>
                <p className="mb-6">{t('servicesPage.noResults.subtitle')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetFilters} variant="outline">
                    {t('servicesPage.resetFilters')}
                  </Button>
                  <Button onClick={() => navigate('/create-custom-order')}>
                    {t('servicesPage.noResults.createCustomOrder')}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {t('servicesPage.noResults.customOrderDesc')}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
   );
}