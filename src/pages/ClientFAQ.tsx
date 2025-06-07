import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle, ArrowRight } from 'lucide-react';

// Дані для FAQ
const clientFAQs = [
  {
    category: "Замовлення",
    items: [
      {
        question: "Як створити замовлення на платформі?",
        answer: "Щоб створити замовлення, виберіть потрібну послугу, обговоріть деталі з виконавцем, узгодьте умови та терміни, а потім оформіть та оплатіть замовлення через систему. Детальну інструкцію можна знайти у розділі «Як замовити»."
      },
      {
        question: "Які способи оплати доступні?",
        answer: "Hiwwer підтримує різні способи оплати, включаючи кредитні та дебетові карти (Visa, Mastercard), PayPal, а також банківські перекази для корпоративних клієнтів. Всі платежі обробляються через захищені платіжні шлюзи."
      },
      {
        question: "Чи можу я скасувати замовлення?",
        answer: "Так, ви можете скасувати замовлення до того, як виконавець почав роботу, з повним поверненням коштів. Якщо робота вже розпочата, умови скасування залежать від прогресу та політики виконавця. Для скасування перейдіть до сторінки замовлення та виберіть опцію «Скасувати»."
      },
      {
        question: "Що робити, якщо термін виконання прострочено?",
        answer: "Якщо виконавець не вклався у встановлений термін, ви можете: 1) Погодити нову дату доставки; 2) Запросити часткове повернення коштів; 3) Скасувати замовлення. Рекомендуємо спочатку зв'язатися з виконавцем для з'ясування причин затримки."
      }
    ]
  },
  {
    category: "Робота з виконавцями",
    items: [
      {
        question: "Як обрати найкращого виконавця?",
        answer: "При виборі виконавця зверніть увагу на: рейтинг та відгуки, портфоліо робіт, кількість виконаних замовлень, час відповіді, досвід роботи у вашій галузі. Також рекомендуємо обговорити проєкт з кількома виконавцями перед прийняттям рішення."
      },
      {
        question: "Як спілкуватися з виконавцем?",
        answer: "Ви можете спілкуватися з виконавцем через вбудовану систему повідомлень на платформі або через Telegram-бот Hiwwer. Всі повідомлення та файли, надіслані через ці канали, зберігаються в системі та доступні для перегляду в історії замовлення."
      },
      {
        question: "Що робити, якщо виконавець не відповідає?",
        answer: "Якщо виконавець не відповідає протягом 48 годин, ви можете: 1) Зв'язатися зі службою підтримки; 2) Позначити проблему на сторінці замовлення; 3) Розглянути можливість скасування замовлення, якщо це дозволяють умови."
      }
    ]
  },
  {
    category: "Якість і правки",
    items: [
      {
        question: "Скільки правок я можу запросити?",
        answer: "Кількість безкоштовних правок залежить від умов конкретної послуги та пакету, який ви обрали. Базові пакети зазвичай включають 1-2 правки, стандартні — 3-5, преміум — необмежену кількість правок. Завжди перевіряйте умови перед замовленням."
      },
      {
        question: "Що робити, якщо я не задоволений якістю роботи?",
        answer: "Якщо ви не задоволені якістю, спочатку детально опишіть виконавцю, що саме вас не влаштовує, та запросіть правки. Якщо після правок проблема не вирішена, ви можете відкрити спір у службі підтримки, яка допоможе вирішити конфлікт."
      },
      {
        question: "Як запросити додаткові зміни після прийняття роботи?",
        answer: "Після прийняття роботи основне замовлення вважається завершеним. Для додаткових змін вам потрібно створити нове замовлення або узгодити додаткові послуги з виконавцем. Деякі виконавці пропонують пакети підтримки після завершення проєкту."
      }
    ]
  },
  {
    category: "Оплата і безпека",
    items: [
      {
        question: "Як працює система безпечних платежів?",
        answer: "Коли ви оплачуєте замовлення, гроші не одразу надходять виконавцю, а зберігаються на депозиті платформи. Виконавець отримує оплату лише після того, як ви підтвердите прийняття роботи. Це захищає вас від неякісного виконання або невиконання замовлення."
      },
      {
        question: "Чи стягуються додаткові комісії?",
        answer: "Платформа стягує сервісну комісію в розмірі 5% від суми замовлення для покриття витрат на обробку платежів та підтримку платформи. Ця комісія вже включена у вартість послуг, які ви бачите на сайті."
      },
      {
        question: "Як отримати рахунок-фактуру для компанії?",
        answer: "Для отримання офіційного рахунку-фактури для вашої компанії, додайте корпоративні реквізити у вашому профілі та виберіть опцію «Корпоративний рахунок» при оформленні замовлення. Рахунок буде автоматично сформований та доступний для завантаження."
      }
    ]
  },
  {
    category: "Telegram інтеграція",
    items: [
      {
        question: "Як підключити Telegram до мого облікового запису?",
        answer: "Щоб підключити Telegram, перейдіть у налаштування профілю та виберіть опцію «Підключити Telegram». Відскануйте QR-код або перейдіть за посиланням, щоб відкрити бота Hiwwer у Telegram. Після підтвердження ваш обліковий запис буде пов'язано з Telegram."
      },
      {
        question: "Які оновлення я отримуватиму через Telegram?",
        answer: "Через Telegram ви отримуватимете сповіщення про: статус замовлень, нові повідомлення від виконавців, запити на правки, доставку результатів, підтвердження платежів та інші важливі події. Ви можете налаштувати типи сповіщень у вашому профілі."
      },
      {
        question: "Чи можу я управляти замовленнями через Telegram?",
        answer: "Так, Telegram-бот Hiwwer дозволяє виконувати основні дії з управління замовленнями: переглядати статус, спілкуватися з виконавцями, приймати роботу, запитувати правки та отримувати файли. Для більш складних операцій рекомендуємо використовувати веб-інтерфейс платформи."
      }
    ]
  }
];

export default function ClientFAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState(clientFAQs);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredFAQs(clientFAQs);
      return;
    }
    
    const filtered = clientFAQs.map(category => {
      const filteredItems = category.items.filter(item => 
        item.question.toLowerCase().includes(term.toLowerCase()) ||
        item.answer.toLowerCase().includes(term.toLowerCase())
      );
      
      return {
        ...category,
        items: filteredItems
      };
    }).filter(category => category.items.length > 0);
    
    setFilteredFAQs(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Заголовок та пошук */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Часті запитання клієнтів</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Знайдіть відповіді на поширені запитання про замовлення, роботу з виконавцями та використання платформи
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Пошук у FAQ..."
              value={searchTerm}
              onChange={handleSearch}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Вкладки категорій FAQ */}
        {filteredFAQs.length > 0 ? (
          <Tabs defaultValue={filteredFAQs[0].category} className="max-w-4xl mx-auto">
            <TabsList className="flex justify-start overflow-auto pb-2 mb-2">
              {filteredFAQs.map(category => (
                <TabsTrigger key={category.category} value={category.category}>
                  {category.category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {filteredFAQs.map(category => (
              <TabsContent key={category.category} value={category.category} className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-medium mb-2">Нічого не знайдено</h3>
            <p className="text-muted-foreground mb-6">
              Спробуйте інший запит або зверніться до служби підтримки
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Скинути пошук
            </Button>
          </div>
        )}

        {/* Додаткові ресурси */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Корисні ресурси</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/how-to-order" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  Як замовити послугу
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Детальне керівництво з процесу замовлення послуг на платформі Hiwwer
                </p>
              </div>
            </Link>
            
            <Link to="/terms-of-service" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  Умови використання
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Правила та умови використання платформи Hiwwer для клієнтів
                </p>
              </div>
            </Link>
            
            <Link to="/contact-us" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  Зв'язатися з підтримкою
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Не знайшли відповідь? Зверніться до нашої команди підтримки
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Заклик до дії */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Готові почати?</h2>
          <p className="text-muted-foreground mb-6">
            Знайдіть професійних виконавців для ваших проєктів вже сьогодні
          </p>
          <Button size="lg" asChild>
            <Link to="/services">Переглянути послуги</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
