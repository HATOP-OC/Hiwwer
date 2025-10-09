import { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { fetchPolicy, Policy } from '@/lib/api';
import { useTranslation } from 'react-i18next';

const TermsOfService = () => {
  const { t } = useTranslation();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPolicy('terms-of-service')
      .then(data => setPolicy(data))
      .catch(() => setError(t('termsOfServicePage.error')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return (<Layout><p className="text-center py-12">{t('termsOfServicePage.loading')}</p></Layout>);
  if (error || !policy) return (<Layout><p className="text-center py-12 text-red-500">{error}</p></Layout>);

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{policy.title}</h1>
        </div>
        <div className="prose max-w-full">
          <div dangerouslySetInnerHTML={{ __html: policy.content }} />
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;