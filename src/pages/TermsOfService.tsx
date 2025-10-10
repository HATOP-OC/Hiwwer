import { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { fetchPolicy, Policy } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TermsOfService = () => {
  const { t, i18n } = useTranslation();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPolicy('terms-of-service', i18n.language)
      .then(data => setPolicy(data))
      .catch(() => setError(t('termsOfServicePage.error')))
      .finally(() => setLoading(false));
  }, [t, i18n.language]);

  if (loading) return (<Layout><p className="text-center py-12">{t('termsOfServicePage.loading')}</p></Layout>);
  if (error || !policy) return (<Layout><p className="text-center py-12 text-red-500">{error}</p></Layout>);

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{policy.title || t('termsOfServicePage.title')}</h1>
          {policy.title ? (
            // if server provides title, show optional subtitle from locale if present
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('termsOfServicePage.subtitle')}</p>
          ) : (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('termsOfServicePage.subtitle')}</p>
          )}
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
            {policy.content_markdown || policy.content}
          </ReactMarkdown>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;