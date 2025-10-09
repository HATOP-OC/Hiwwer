import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import ImageUpload from '@/components/ImageUpload';

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time: number;
  category_id: string;
  tags: string[];
}

export default function CreateService() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { serviceId } = useParams();
  const isEditing = !!serviceId;
  
  const [formData, setFormData] = useState<CreateServiceData>({
    title: '',
    description: '',
    price: 0,
    currency: 'UAH',
    delivery_time: 0,
    category_id: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<File[]>([]);

  // Отримання категорій
  const { data: categories = [] } = useQuery<ServiceCategory[]>({
    queryKey: ['service-categories'],
    queryFn: async () => {
      try {
        const res = await fetch('/v1/services/categories');
        if (!res.ok) {
          const text = await res.text();
          console.error('Categories fetch failed:', res.status, text);
          throw new Error(t('createService.errors.fetchCategories'));
        }
        const data = await res.json();
        return data.categories || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    }
  });

  // Отримання існуючої послуги для редагування
  const { data: existingService } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`/v1/services/${serviceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(t('createService.errors.fetchService'));
      return res.json();
    },
    enabled: isEditing && !!serviceId
  });

  // Заповнення форми при редагуванні
  useEffect(() => {
    if (existingService) {
      setFormData({
        title: existingService.title || '',
        description: existingService.description || '',
        price: existingService.price || 0,
        currency: existingService.currency || 'UAH',
        delivery_time: existingService.delivery_time || 1,
        category_id: existingService.category?.id || '',
        tags: existingService.tags?.map((tag: any) => tag.name) || []
      });
    }
  }, [existingService]);

  // Мутація для створення/редагування послуги
  const createMutation = useMutation({
    mutationFn: async (data: CreateServiceData) => {
      const token = localStorage.getItem('token');
      const url = isEditing ? `/v1/services/${serviceId}` : '/v1/services';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || t(isEditing ? 'createService.errors.update' : 'createService.errors.create'));
      }
      return res.json();
    },
    onSuccess: async (data) => {
      const createdServiceId = data.service?.id || data.id;
      
      // Завантаження зображень, якщо є
      if (images.length > 0 && createdServiceId) {
        try {
          const formData = new FormData();
          images.forEach((image) => {
            formData.append('images', image);
          });

          const token = localStorage.getItem('token');
          const uploadRes = await fetch(`/v1/services/${createdServiceId}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (!uploadRes.ok) {
            console.error('Failed to upload images');
          }
        } catch (error) {
          console.error('Error uploading images:', error);
        }
      }

      toast({
        title: t('createService.success.title'),
        description: t(isEditing ? 'createService.success.update' : 'createService.success.create'),
      });
      navigate(`/services/${createdServiceId}`);
    },
    onError: (error: Error) => {
      toast({
        title: t('createService.errors.title'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Перевірка доступу ПІСЛЯ всіх хуків
  if (!user?.isPerformer && user?.role !== 'admin') {
    return (
      <Layout>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600">{t('createService.accessDenied.title')}</h1>
          <p className="mt-2">{t('createService.accessDenied.description')}</p>
          <Button className="mt-4" onClick={() => navigate('/profile')}>
            {t('createService.accessDenied.button')}
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: t('createService.errors.title'),
        description: t('createService.errors.titleRequired'),
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: t('createService.errors.title'),
        description: t('createService.errors.descriptionRequired'),
        variant: "destructive",
      });
      return;
    }
    
    if (formData.price <= 0) {
      toast({
        title: t('createService.errors.title'),
        description: t('createService.errors.pricePositive'),
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.category_id) {
      toast({
        title: t('createService.errors.title'),
        description: t('createService.errors.categoryRequired'),
        variant: "destructive",
      });
      return;
    }

    if (formData.delivery_time <= 0) {
      toast({
        title: t('createService.errors.title'),
        description: t('createService.errors.deliveryTimePositive'),
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isEditing ? t('createService.title.edit') : t('createService.title.create')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? t('createService.subtitle.edit') : t('createService.subtitle.create')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('createService.cardTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Назва */}
              <div>
                <Label htmlFor="title">{t('createService.form.title.label')} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('createService.form.title.placeholder')}
                  required
                />
              </div>

              {/* Опис */}
              <div>
                <Label htmlFor="description">{t('createService.form.description.label')} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('createService.form.description.placeholder')}
                  rows={5}
                  required
                />
              </div>

              {/* Категорія */}
              <div>
                <Label htmlFor="category">{t('createService.form.category.label')} *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('createService.form.category.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ціна і валюта */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">{t('createService.form.price.label')} *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price === 0 ? '' : formData.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        price: value === '' ? 0 : parseFloat(value) 
                      }));
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">{t('createService.form.currency.label')}</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAH">UAH</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Терміни виконання */}
              <div>
                <Label htmlFor="delivery_time">{t('createService.form.deliveryTime.label')} *</Label>
                <Input
                  id="delivery_time"
                  type="number"
                  min="1"
                  value={formData.delivery_time || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      delivery_time: value === '' ? 0 : parseInt(value) 
                    }));
                  }}
                  required
                />
              </div>

              {/* Теги */}
              <div>
                <Label htmlFor="tags">{t('createService.form.tags.label')}</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('createService.form.tags.placeholder')}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Зображення */}
              <div>
                <Label>{t('createService.form.images.label')}</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('createService.form.images.description')}
                </p>
                <ImageUpload
                  images={images}
                  onChange={setImages}
                  maxImages={5}
                  maxSizeMB={5}
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending 
                    ? (isEditing ? t('createService.buttons.saving') : t('createService.buttons.creating'))
                    : (isEditing ? t('createService.buttons.save') : t('createService.buttons.create'))
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/my-services')}
                >
                  {t('createService.buttons.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}