import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { fetchAdminSettings, updateAdminSettings, AdminSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>({ siteName: '', maintenanceMode: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminSettings()
      .then(data => setSettings(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await updateAdminSettings(settings);
      toast({ title: 'Успіх', description: 'Налаштування оновлено.' });
    } catch (err: any) {
      toast({ title: 'Помилка', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Налаштування сайту</h1>
        {loading && <p>Завантаження...</p>}
        {error && <p className="text-red-500">Помилка: {error}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            <div>
              <Label>Назва сайту</Label>
              <Input
                value={settings.siteName}
                onChange={e => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
              />
              <Label>Режим обслуговування</Label>
            </div>
            <Button onClick={handleSave}>Зберегти</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Settings;
