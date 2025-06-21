import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, FileType, Bell, Shield, User } from 'lucide-react';
import FileTypeSettings from '@/components/FileTypeSettings';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Налаштування
        </h1>
        <p className="text-muted-foreground mt-2">
          Налаштуйте свій профіль та параметри роботи з платформою
        </p>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileType className="h-4 w-4" />
            Файли
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Профіль
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Сповіщення
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Безпека
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-6">
          <FileTypeSettings />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Налаштування профілю
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Основна інформація</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Ім'я:</span>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Роль:</span>
                      <p className="capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Налаштування профілю будуть додані в наступних версіях</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Налаштування сповіщень
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Налаштування сповіщень будуть додані в наступних версіях</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Налаштування безпеки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Налаштування безпеки будуть додані в наступних версіях</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
