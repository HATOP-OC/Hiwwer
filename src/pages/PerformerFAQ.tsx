import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle, ArrowRight } from 'lucide-react';
import { fetchFAQ, FAQItem } from '@/lib/api';

const PerformerFAQ = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQ('performer').then(data => {
      setFaqs(data);
      setFilteredFaqs(data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchQuery(term);
    setFilteredFaqs(
      faqs.filter(item =>
        item.question.toLowerCase().includes(term.toLowerCase()) ||
        item.answer.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Питання та відповіді для виконавців</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Знайдіть відповіді на поширені запитання про роботу на платформі та виконання замовлень.
          </p>
        </div>

        {/* Пошуковий блок */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Пошук у питаннях та відповідях..."
              className="pl-10 py-6"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* FAQ список */}
        {loading ? (
          <p className="text-center py-12">Завантаження...</p>
        ) : filteredFaqs.length > 0 ? (
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
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Нічого не знайдено</h3>
            <p className="text-muted-foreground mb-6">Спробуйте інший запит або зверніться до служби підтримки.</p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>Скинути пошук</Button>
          </div>
        )}

        {/* Блок з додатковими ресурсами */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Потрібна додаткова допомога?</h3>
            <p className="text-muted-foreground mb-4">
              Якщо ви не знайшли відповідь на своє запитання, наша команда підтримки завжди готова допомогти.
            </p>
            <Button asChild>
              <Link to="/contact-us" className="flex items-center">
                Зв'язатися з підтримкою <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Рекомендації для виконавців</h3>
            <p className="text-muted-foreground mb-4">
              Ознайомтеся з нашими детальними рекомендаціями та правилами для успішної роботи на платформі.
            </p>
            <Button asChild variant="outline">
              <Link to="/performer-guidelines" className="flex items-center">
                Переглянути рекомендації <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PerformerFAQ;
