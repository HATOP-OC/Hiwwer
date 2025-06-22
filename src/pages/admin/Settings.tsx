import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, FileType, Globe } from 'lucide-react';
import { fetchAdminSettings, updateAdminSettings, AdminSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import FileTypeSettings from '@/components/FileTypeSettings';
import { clearFileTypeCache } from '@/lib/fileTypes';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>({ 
    siteName: '', 
    maintenanceMode: false,
    allowedFileTypes: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminSettings()
      .then(data => setSettings(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminSettings(settings);
      // Очищуємо кеш типів файлів після успішного збереження
      clearFileTypeCache();
      toast({ title: 'Успіх', description: 'Налаштування оновлено.' });
    } catch (err: any) {
      toast({ title: 'Помилка', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileTypesChange = (fileTypes: any[]) => {
    setSettings(prev => ({ ...prev, allowedFileTypes: fileTypes }));
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            Налаштування адміністратора
          </h1>
          <p className="text-muted-foreground mt-2">
            Керуйте глобальними налаштуваннями платформи
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Помилка: {error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Загальні
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <FileType className="h-4 w-4" />
                Файли
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Загальні налаштування
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Назва сайту</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={e => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      placeholder="Назва вашого сайту"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={e => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="maintenanceMode">Режим обслуговування</Label>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? 'Збереження...' : 'Зберегти'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileType className="h-5 w-5" />
                    Налаштування типів файлів
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Керуйте типами файлів, які користувачі можуть завантажувати на платформу
                  </p>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Завантаження типів файлів...</span>
                    </div>
                  ) : (
                    <>
                      <FileTypeSettings 
                        onConfigChange={handleFileTypesChange}
                        initialConfig={settings.allowedFileTypes}
                        isAdminMode={true}
                      />
                      <div className="pt-4">
                        <Button onClick={handleSave} disabled={saving}>
                          {saving ? 'Збереження...' : 'Зберегти налаштування файлів'}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Settings;
