import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { Star, Search, Filter as FilterIcon, ChevronDown, ChevronUp } from 'lucide-react';

// Ці дані повинні бути завантажені з API у реальному додатку
const serviceCategories = [
  { id: '1', name: 'Дизайн', icon: '🎨', count: 156 },
  { id: '2', name: 'Розробка', icon: '💻', count: 243 },
  { id: '3', name: 'Тексти', icon: '✍️', count: 112 },
  { id: '4', name: 'Маркетинг', icon: '📈', count: 98 },
  { id: '5', name: 'Відео', icon: '🎥', count: 67 },
  { id: '6', name: 'Аудіо', icon: '🎵', count: 45 },
  { id: '7', name: 'Бізнес', icon: '💼', count: 78 },
  { id: '8', name: 'Навчання', icon: '📚', count: 53 }
];

// Демо послуги для відображення
const servicesData = [
  {
    id: 'service-1',
    title: 'Креативний дизайн логотипу з необмеженими правками',
    description: 'Створю унікальний та сучасний логотип для вашого бренду. Включає 3 початкові концепції та необмежені правки до фінальної версії.',
    category: 'design',
    tags: ['Логотип', 'Брендинг', 'Вектор'],
    price: 75,
    currency: 'USD',
    deliveryTime: '3-5 днів',
    rating: 4.9,
    reviewCount: 387,
    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&h=350&fit=crop&q=80',
    sellerName: 'Олена К.',
    sellerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'service-2',
    title: 'Розробка сайту на React з використанням сучасних технологій',
    description: 'Розробка сучасного веб-сайту з реактивним інтерфейсом, оптимізацією для пошукових систем та адаптивним дизайном.',
    category: 'development',
    tags: ['React', 'Frontend', 'Responsive'],
    price: 350,
    currency: 'USD',
    deliveryTime: '7-14 днів',
    rating: 4.8,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=350&fit=crop&q=80',
    sellerName: 'Максим В.',
    sellerAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'service-3',
    title: 'SEO-оптимізація сайту для топових позицій у Google',
    description: 'Повний аудит та оптимізація вашого сайту для підняття позицій у пошукових системах. Включає технічний аудит, оптимізацію контенту та структури.',
    category: 'marketing',
    tags: ['SEO', 'Google', 'Аудит'],
    price: 150,
    currency: 'USD',
    deliveryTime: '10-15 днів',
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop&q=80',
    sellerName: 'Андрій С.',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'service-4',
    title: 'Копірайтинг високої якості для вашого бізнесу',
    description: 'Професійний копірайтинг для вашого бренду: тексти для сайту, блогу, реклами та соціальних мереж. SEO-оптимізовані тексти, що продають.',
    category: 'writing',
    tags: ['Копірайтинг', 'Контент', 'SEO'],
    price: 60,
    currency: 'USD',
    deliveryTime: '2-4 дні',
    rating: 4.9,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=350&fit=crop&q=80',
    sellerName: 'Наталія М.',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'service-5',
    title: 'Монтаж відео для YouTube, Instagram та TikTok',
    description: 'Професійний монтаж відео будь-якої складності. Включає кольорокорекцію, звукове оформлення, графіку та анімації.',
    category: 'video',
    tags: ['Монтаж', 'YouTube', 'Social Media'],
    price: 85,
    currency: 'USD',
    deliveryTime: '3-7 днів',
    rating: 4.8,
    reviewCount: 122,
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=500&h=350&fit=crop&q=80',
    sellerName: 'Ігор Т.',
    sellerAvatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'service-6',
    title: 'Дизайн мобільного додатку з UI/UX принципами',
    description: 'Створення унікального дизайну мобільного додатку з врахуванням найкращих практик UI/UX. Включає дослідження, прототипування та дизайн всіх екранів.',
    category: 'design',
    tags: ['UI/UX', 'Mobile', 'App Design'],
    price: 400,
    currency: 'USD',
    deliveryTime: '10-14 днів',
    rating: 4.9,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=500&h=350&fit=crop&q=80',
    sellerName: 'Софія Л.',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80'
  },
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState(servicesData);
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Отримання початкової категорії з URL, якщо вона є
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const matchedCategory = serviceCategories.find(
        c => c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategories([matchedCategory.id]);
      }
    }
  }, [searchParams]);

  // Фільтрація послуг на основі пошуку та фільтрів
  useEffect(() => {
    let filteredServices = [...servicesData];
    
    // Фільтр за пошуковим запитом
    if (searchTerm) {
      filteredServices = filteredServices.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Фільтр за категоріями
    if (selectedCategories.length > 0) {
      filteredServices = filteredServices.filter(service => {
        const categoryObj = serviceCategories.find(c => c.name.toLowerCase() === service.category);
        return categoryObj ? selectedCategories.includes(categoryObj.id) : false;
      });
    }
    
    // Фільтр за ціною
    filteredServices = filteredServices.filter(service => 
      service.price >= priceRange[0] && service.price <= priceRange[1]
    );
    
    // Фільтр за рейтингом
    if (selectedRating) {
      filteredServices = filteredServices.filter(service => 
        service.rating >= selectedRating
      );
    }
    
    setServices(filteredServices);
  }, [searchTerm, selectedCategories, priceRange, selectedRating]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
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

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Заголовок та пошук */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Знайдіть ідеальну послугу</h1>
          <div className="relative max-w-xl">
            <Input
              type="text"
              placeholder="Шукайте за ключовими словами, навичками, описом..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Фільтри для мобільних */}
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <div className="flex items-center">
                <FilterIcon className="mr-2 h-4 w-4" />
                <span>Фільтри</span>
              </div>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {showFilters && (
              <Card className="mt-2">
                <CardContent className="pt-4">
                  {/* Фільтри категорій для мобільних */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Категорії</h3>
                    <div className="space-y-2">
                      {serviceCategories.map(category => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox
                            id={`mobile-category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                          />
                          <Label htmlFor={`mobile-category-${category.id}`} className="ml-2 flex items-center">
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                            <span className="ml-1 text-muted-foreground text-xs">({category.count})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Фільтр ціни для мобільних */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Ціна (USD)</h3>
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
                  
                  {/* Фільтр рейтингу для мобільних */}
                  <div>
                    <h3 className="font-medium mb-2">Мінімальний рейтинг</h3>
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
                    Скинути фільтри
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Сайдбар з фільтрами (десктоп) */}
          <div className="hidden md:block w-64 shrink-0">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Фільтри</h3>
                
                {/* Фільтр категорій */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Категорії</h4>
                  <div className="space-y-2">
                    {serviceCategories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryChange(category.id)}
                        />
                        <Label htmlFor={`category-${category.id}`} className="ml-2 flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                          <span className="ml-1 text-muted-foreground text-xs">({category.count})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Фільтр ціни */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Ціна (USD)</h4>
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
                
                {/* Фільтр рейтингу */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Мінімальний рейтинг</h4>
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
                  Скинути фільтри
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Основний контент - список послуг */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Знайдено послуг: {services.length}</h2>
              </div>
              {/* Тут можна додати сортування */}
            </div>

            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <Link to={`/services/${service.id}`} key={service.id}>
                    <Card className="overflow-hidden hover-card border group transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-brand-teal hover:bg-brand-teal text-white">
                            ${service.price}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center text-amber-500">
                            <Star className="fill-amber-500 stroke-amber-500 h-4 w-4" />
                            <span className="ml-1 text-sm font-semibold">{service.rating}</span>
                            <span className="ml-1 text-xs text-muted-foreground">({service.reviewCount})</span>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground">{service.deliveryTime}</span>
                        </div>
                        
                        <h3 className="font-bold mb-2 line-clamp-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {service.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {service.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center mt-auto pt-3 border-t">
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                            <img src={service.sellerAvatar} alt={service.sellerName} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm">{service.sellerName}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <h3 className="text-lg font-medium">Нічого не знайдено</h3>
                </div>
                <p className="mb-4">Спробуйте змінити параметри пошуку або фільтри</p>
                <Button onClick={resetFilters}>Скинути всі фільтри</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
