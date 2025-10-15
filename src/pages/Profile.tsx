import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Star, 
  Edit3, 
  Save,
  X,
  Briefcase
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import TelegramIntegration from '@/components/Profile/TelegramIntegration';
import SkillsManagement from '@/components/Profile/SkillsManagement';

export default function Profile() {
  const { user, isLoading, refetchUser, activatePerformerMode } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isManagingSkills, setIsManagingSkills] = useState(false);
  const [isActivatingPerformer, setIsActivatingPerformer] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '/placeholder.svg'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || '/placeholder.svg'
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const response = await fetch('/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          avatar: formData.avatar
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await refetchUser();
      toast.success('Профіль успішно оновлено');
      setIsEditing(false);
    } catch (error) {
      toast.error('Помилка оновлення профілю');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '/placeholder.svg'
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'performer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'client': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
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

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Будь ласка, увійдіть для перегляду профілю</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Мій профіль</h1>
          <p className="text-muted-foreground mt-2">
            Керуйте налаштуваннями акаунту та публічним профілем
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <Badge variant="outline" className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    
                    {user.rating && (
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{Number(user.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="w-full space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="w-full space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? 'Скасувати' : 'Редагувати'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Публічний профіль
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Особиста інформація</CardTitle>
                <CardDescription>
                  Оновіть свої особисті дані та публічну інформацію профілю
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Повне ім'я</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Про себе</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Розкажіть трохи про себе..."
                    rows={4}
                  />
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Зберегти
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Скасувати
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Telegram інтеграція</CardTitle>
              </CardHeader>
              <CardContent>
                <TelegramIntegration />
              </CardContent>
            </Card>
            
            {!user.isPerformer && user.role !== 'admin' && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Стати виконавцем</span>
                  </CardTitle>
                  <CardDescription>
                    Пропонуйте свої послуги та заробляйте на платформі
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="default"
                    className="w-full"
                    disabled={isActivatingPerformer}
                    onClick={async () => {
                      setIsActivatingPerformer(true);
                      try {
                        await activatePerformerMode();
                        toast.success('Режим виконавця активовано!');
                      } catch (error) {
                        toast.error('Помилка активації режиму виконавця');
                      } finally {
                        setIsActivatingPerformer(false);
                      }
                    }}
                  >
                    {isActivatingPerformer ? 'Активація...' : 'Активувати режим виконавця'}
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {user.isPerformer && (
              <Card>
                <CardHeader>
                  <CardTitle>Навички</CardTitle>
                  <CardDescription>
                    Вкажіть ваші професійні навички
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => setIsManagingSkills(true)}
                  >
                    Керувати навичками
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {isManagingSkills && user && (
          <SkillsManagement
            userId={user.id}
            onClose={() => setIsManagingSkills(false)}
          />
        )}
      </div>
    </Layout>
  );
}