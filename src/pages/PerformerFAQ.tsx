import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle, ArrowRight } from 'lucide-react';

// Дані для FAQ виконавців
const performerFAQs = [
  {
    category: "Початок роботи",
    items: [
      {
        question: "Як стати виконавцем на платформі?",
        answer: "Щоб стати виконавцем, зареєструйтеся на платформі, заповніть детальний профіль, вкажіть свої навички та досвід, додайте портфоліо та пройдіть процес верифікації. Детальні інструкції доступні в розділі «Стати виконавцем»."
      },
      {
        question: "Які документи потрібні для реєстрації?",
        answer: "Для реєстрації потрібно: документ, що посвідчує особу (паспорт або ID-картка), підтвердження адреси (рахунок за комунальні послуги або банківська виписка), портфоліо ваших робіт та, за необхідності, документи про освіту чи сертифікати за вашою спеціалізацією."
      },
      {
        question: "Скільки часу займає верифікація?",
        answer: "Процес верифікації зазвичай займає від 1 до 3 робочих днів. Ви отримаєте повідомлення на електронну пошту та в Telegram, коли ваш акаунт буде верифіковано та ви зможете почати приймати замовлення."
      }
    ]
  },
  {
    category: "Виконання замовлень",
    items: [
      {
        question: "Як я дізнаюся про нові замовлення?",
        answer: "Ви отримуватимете сповіщення про нові замовлення через: Telegram-бот, електронну пошту та повідомлення в особистому кабінеті на платформі. Також ви можете налаштувати фільтри для відображення замовлень, що відповідають вашій спеціалізації."
      },
      {
        question: "Як встановлювати терміни виконання?",
        answer: "При оцінюванні терміну виконання враховуйте: складність проєкту, поточне завантаження, можливі ризики та час на комунікацію з клієнтом. Завжди додавайте запас часу для непередбачених ситуацій та правок."
      },
      {
        question: "Що робити, якщо я не встигаю завершити замовлення вчасно?",
        answer: "Якщо ви бачите, що не встигаєте виконати замовлення в обіцяний термін: 1) Якнайшвидше повідомте клієнта; 2) Поясніть причини затримки; 3) Запропонуйте нову дату доставки; 4) За необхідності, запропонуйте компенсацію (знижку, додаткові послуги)."
      },
      {
        question: "Як отримувати оплату за виконані замовлення?",
        answer: "Оплата надходить на ваш рахунок на платформі після того, як клієнт підтвердив виконання замовлення. Ви можете вивести кошти на банківську карту, електронний гаманець або через інші доступні методи в розділі «Фінанси» вашого кабінету."
      }
    ]
  },
  {
    category: "Комунікація з клієнтами",
    items: [
      {
        question: "Як ефективно спілкуватися з клієнтами?",
        answer: "Для ефективної комунікації: відповідайте швидко (бажано протягом 12 годин), будьте ввічливі та професійні, чітко формулюйте запитання та відповіді, документуйте всі важливі рішення, уточнюйте деталі, які можуть впливати на результат роботи."
      },
      {
        question: "Що робити при конфліктній ситуації з клієнтом?",
        answer: "У разі конфлікту: зберігайте спокій та професіоналізм, уважно вислухайте проблеми клієнта, запропонуйте конкретні рішення, документуйте всю комунікацію. Якщо самостійно вирішити конфлікт не вдається, зверніться до служби підтримки платформи для медіації."
      },
      {
        question: "Чи можна спілкуватися з клієнтом поза платформою?",
        answer: "Не рекомендується переносити комунікацію поза платформу, оскільки це: порушує правила сервісу, позбавляє вас захисту при спірних ситуаціях, може призвести до блокування акаунту. Вся комунікація повинна відбуватися через вбудовані канали платформи або Telegram-бот Hiwwer."
      }
    ]
  },
  {
    category: "Профіль та рейтинг",
    items: [
      {
        question: "Як підвищити свій рейтинг на платформі?",
        answer: "Для підвищення рейтингу: забезпечуйте високу якість робіт, дотримуйтесь термінів, швидко відповідайте на повідомлення, професійно спілкуйтеся з клієнтами, активно запитуйте відгуки після успішних проєктів, розширюйте портфоліо та регулярно оновлюйте профіль."
      },
      {
        question: "Що робити, якщо я отримав негативний відгук?",
        answer: "При отриманні негативного відгуку: проаналізуйте причини невдоволення клієнта, відповідайте на відгук конструктивно та професійно, запропонуйте вирішення проблеми, зв'яжіться з клієнтом для обговорення ситуації, вчіться на помилках для запобігання подібних проблем у майбутньому."
      },
      {
        question: "Як часто оновлювати портфоліо?",
        answer: "Рекомендується оновлювати портфоліо як мінімум раз на 2-3 місяці або після завершення значущих проєктів. Додавайте різноманітні роботи, що демонструють широкий спектр ваших навичок, та видаляйте застарілі зразки, які вже не відображають ваш поточний рівень."
      }
    ]
  },
  {
    category: "Фінансові питання",
    items: [
      {
        question: "Які комісії стягує платформа?",
        answer: "Платформа стягує комісію в розмірі 10-20% від суми замовлення залежно від вашого рівня на платформі. Чим вищий ваш рейтинг та більше виконаних замовлень, тим нижча комісія. Детальну інформацію можна знайти в розділі «Фінанси» вашого особистого кабінету."
      },
      {
        question: "Як і коли я можу виводити зароблені кошти?",
        answer: "Ви можете виводити кошти після того, як вони стають доступними (зазвичай через 14 днів після закриття замовлення, щоб врахувати можливі спори). Мінімальна сума для виведення - 10 USD. Виведення можливе на банківську карту, електронний гаманець або через банківський переказ."
      },
      {
        question: "Як формувати ціни на свої послуги?",
        answer: "При формуванні цін враховуйте: вашу кваліфікацію та досвід, складність та тривалість роботи, ринкові ставки для подібних послуг, вартість матеріалів чи інструментів, комісію платформи. Рекомендуємо проаналізувати ціни конкурентів та встановити конкурентоспроможні розцінки."
      }
    ]
  }
];

const PerformerFAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Фільтрація FAQ за пошуковим запитом і активною вкладкою
  const filteredFAQs = performerFAQs
    .map(category => ({
      ...category,
      items: category.items.filter(item => 
        (item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
         item.answer.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (activeTab === 'all' || activeTab === category.category)
      )
    }))
    .filter(category => category.items.length > 0);

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Вкладки для категорій */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="flex flex-wrap justify-center mb-6">
            <TabsTrigger value="all">Усі категорії</TabsTrigger>
            {performerFAQs.map(category => (
              <TabsTrigger key={category.category} value={category.category}>
                {category.category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((category, index) => (
                <div key={index} className="mb-8">
                  {activeTab === 'all' && (
                    <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
                  )}
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                        <AccordionTrigger className="text-left text-lg">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Нічого не знайдено</h3>
                <p className="text-muted-foreground mb-6">
                  За вашим запитом не знайдено відповідних результатів. Спробуйте інший запит або зверніться до служби підтримки.
                </p>
                <Button asChild variant="outline">
                  <Link to="/contact-us">Зв'язатися з підтримкою</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
