import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Shield, FileText } from 'lucide-react';
import { fetchPolicy, Policy } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolicy('privacy-policy', i18n.language)
      .then(data => setPolicy(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [i18n.language]);

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
        </div>

        <div className="max-w-4xl mx-auto">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({children}) => <h1 className="text-2xl font-bold mb-6 text-foreground">{children}</h1>,
              h2: ({children}) => <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">{children}</h2>,
              h3: ({children}) => <h3 className="text-lg font-medium mt-6 mb-3 text-foreground">{children}</h3>,
              p: ({children}) => <p className="mb-4 text-muted-foreground leading-relaxed text-base">{children}</p>,
              ul: ({children}) => <ul className="mb-4 ml-6 list-disc text-muted-foreground text-base">{children}</ul>,
              ol: ({children}) => <ol className="mb-4 ml-6 list-decimal text-muted-foreground text-base">{children}</ol>,
              li: ({children}) => <li className="mb-2">{children}</li>,
              strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
              a: ({href, children}) => <a href={href} className="text-primary hover:text-primary/80 underline">{children}</a>,
            }}
          >
            {policy.content}
          </ReactMarkdown>
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
              <Shield className="h-10 w-10 text-primary mr-4" />
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
