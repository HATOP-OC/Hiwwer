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
import { fetchServices, Service } from '@/lib/api';

// Реальні категорії послуг
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

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Завантаження послуг з API
  useEffect(() => {
    fetchServices()
      .then(data => {
        setAllServices(data);
        setServices(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Фільтрація послуг на основі пошуку та фільтрів
  useEffect(() => {
    let filtered = [...allServices];
    
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фільтрація по категоріях
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(s => selectedCategories.includes(s.category.id));
    }
    
    filtered = filtered.filter(service => 
      service.price >= priceRange[0] && service.price <= priceRange[1]
    );
    
    if (selectedRating) {
      filtered = filtered.filter(s => s.rating >= selectedRating);
    }
    
    setServices(filtered);
  }, [searchTerm, selectedCategories, priceRange, selectedRating, allServices]);

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

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Завантаження послуг...</p>
      </div>
    );
  }

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
                          src={service.images[0]}
                          alt={service.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-brand-teal hover:bg-brand-teal text-white">
                            {service.price} {service.currency}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center text-amber-500">
                            <Star className="fill-amber-500 stroke-amber-500 h-4 w-4" />
                            <span className="ml-1 text-sm font-semibold">{service.rating}</span>
                            <span className="ml-1 text-xs text-muted-foreground">({service.review_count})</span>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground">{service.delivery_time} дн.</span>
                        </div>
                        <h3 className="font-bold mb-2 line-clamp-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {service.tags.slice(0, 3).map(tag => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center mt-auto pt-3 border-t">
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                            <img src={service.performer.avatar_url} alt={service.performer.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm">{service.performer.name}</span>
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
