import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle, ArrowRight } from 'lucide-react';
import { fetchFAQ, FAQItem } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export default function ClientFAQ() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQ('client')
      .then(data => {
        setFaqs(data);
        setFilteredFaqs(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredFaqs(
      faqs.filter(item =>
        item.question.toLowerCase().includes(term.toLowerCase()) ||
        item.answer.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <p className="text-center text-lg">{t('clientFaqPage.loading')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('clientFaqPage.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('clientFaqPage.subtitle')}
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Input
              type="text"
              placeholder={t('clientFaqPage.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearch}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            {filteredFaqs.map((item, idx) => (
              <AccordionItem key={item.id} value={`item-${idx}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-medium mb-2">{t('clientFaqPage.noResultsTitle')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('clientFaqPage.noResultsSubtitle')}
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              {t('clientFaqPage.resetSearch')}
            </Button>
          </div>
        )}

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('clientFaqPage.resourcesTitle')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/how-to-order" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  {t('clientFaqPage.howToOrderTitle')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('clientFaqPage.howToOrderDesc')}
                </p>
              </div>
            </Link>
            
            <Link to="/terms-of-service" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  {t('clientFaqPage.termsTitle')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('clientFaqPage.termsDesc')}
                </p>
              </div>
            </Link>
            
            <Link to="/contact-us" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  {t('clientFaqPage.contactTitle')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('clientFaqPage.contactDesc')}
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('clientFaqPage.ctaTitle')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('clientFaqPage.ctaSubtitle')}
          </p>
          <Button size="lg" asChild>
            <Link to="/services">{t('clientFaqPage.ctaButton')}</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}