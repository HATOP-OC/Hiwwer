import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, FileText, Calendar, Shield, Lock, Info } from 'lucide-react';
import { fetchPolicy, Policy } from '@/lib/api';

const PrivacyPolicy = () => {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicy('privacy-policy')
      .then(data => setPolicy(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (<Layout><p className="text-center py-12">Завантаження політики...</p></Layout>);
  if (error || !policy) return (<Layout><p className="text-center py-12 text-red-500">Не вдалося завантажити політику конфіденційності.</p></Layout>);

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Політика конфіденційності</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ми цінуємо вашу приватність та дотримуємося найвищих стандартів щодо захисту ваших персональних даних.
          </p>
          {policy && (
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Останнє оновлення: {policy.title}</span>
            </div>
          )}
        </div>

        <Alert className="mb-8 max-w-4xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {policy?.content || 'Завантаження політики...'}
          </AlertDescription>
        </Alert>

        <div className="prose max-w-full">
          <h1 className="text-4xl font-bold mb-4 text-center">{policy.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: policy.content }} />
        </div>

        {/* Інформаційний блок внизу */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start mb-4">
              <FileText className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Завантажити PDF версію</h3>
                <p className="text-muted-foreground mt-1">
                  Отримайте повну версію політики конфіденційності у форматі PDF для зручного зберігання та друку.
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Завантажити документ
            </Button>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start mb-4">
              <Lock className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Питання щодо конфіденційності?</h3>
                <p className="text-muted-foreground mt-1">
                  Якщо у вас виникли запитання чи занепокоєння щодо обробки ваших персональних даних, зв'яжіться з нашим відділом конфіденційності.
                </p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/contact-us">Зв'язатися з відділом конфіденційності</Link>
            </Button>
          </div>
        </div>

        {/* Заключний текст */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Ми зберігаємо за собою право оновлювати цю Політику конфіденційності в будь-який час. Ми повідомимо вас про будь-які суттєві зміни через повідомлення на нашій платформі або електронною поштою.
          </p>
          <div className="flex justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
