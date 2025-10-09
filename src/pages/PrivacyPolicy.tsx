import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Shield, Lock, Info, FileText } from 'lucide-react';
import { fetchPolicy, Policy } from '@/lib/api';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicy('privacy-policy')
      .then(data => setPolicy(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (<Layout><p className="text-center py-12">{t('privacyPolicy.loading')}</p></Layout>);
  if (error || !policy) return (<Layout><p className="text-center py-12 text-red-500">{t('privacyPolicy.error')}</p></Layout>);

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('privacyPolicy.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('privacyPolicy.subtitle')}
          </p>
          {policy && (
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{t('privacyPolicy.lastUpdated')}: {policy.title}</span>
            </div>
          )}
        </div>

        <Alert className="mb-8 max-w-4xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {policy?.content || t('privacyPolicy.loading')}
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
                <h3 className="text-xl font-semibold">{t('privacyPolicy.download.title')}</h3>
                <p className="text-muted-foreground mt-1">
                  {t('privacyPolicy.download.description')}
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              {t('privacyPolicy.download.button')}
            </Button>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start mb-4">
              <Lock className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-semibold">{t('privacyPolicy.questions.title')}</h3>
                <p className="text-muted-foreground mt-1">
                  {t('privacyPolicy.questions.description')}
                </p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/contact-us">{t('privacyPolicy.questions.button')}</Link>
            </Button>
          </div>
        </div>

        {/* Заключний текст */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {t('privacyPolicy.finalParagraph')}
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