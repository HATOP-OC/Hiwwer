import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { fetchSecurityPolicy, updateSecurityPolicy, SecurityPolicy } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Security: React.FC = () => {
  const [policy, setPolicy] = useState<SecurityPolicy>({ ipWhitelist: [], allowSelfRegistration: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityPolicy()
      .then(data => setPolicy(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await updateSecurityPolicy(policy);
      toast({ title: 'Успіх', description: 'Політика безпеки оновлена.' });
    } catch (err: any) {
      toast({ title: 'Помилка', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Політика безпеки</h1>
        {loading && <p>Завантаження...</p>}
        {error && <p className="text-red-500">Помилка: {error}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={policy.allowSelfRegistration}
                onCheckedChange={val => setPolicy(prev => ({ ...prev, allowSelfRegistration: val }))}
              />
              <Label>Дозволити самостійну реєстрацію</Label>
            </div>
            <div>
              <Label>Whitelist IP-адреси (через кому)</Label>
              <Input
                value={policy.ipWhitelist.join(',')}
                onChange={e => setPolicy(prev => ({ ...prev, ipWhitelist: e.target.value.split(',').map(ip => ip.trim()) }))}
              />
            </div>
            <Button onClick={handleSave}>Зберегти</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Security;
