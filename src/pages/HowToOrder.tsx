import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Search, MessageSquare, CreditCard, Package, Star, HelpCircle } from 'lucide-react';

export default function HowToOrder() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Головний банер */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Як замовити послугу на Hiwwer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Простий процес замовлення цифрових послуг для вашого бізнесу та проєктів
          </p>
        </div>

        {/* Кроки замовлення */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold">1</div>
            <CardContent className="pt-8 pb-6 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">Знайдіть послугу</h3>
              <p className="text-muted-foreground">
                Виберіть із широкого асортименту цифрових послуг від професіоналів у своїй справі.
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold">2</div>
            <CardContent className="pt-8 pb-6 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">Обговоріть деталі</h3>
              <p className="text-muted-foreground">
                Спілкуйтеся з виконавцем, щоб уточнити всі вимоги та очікування.
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold">3</div>
            <CardContent className="pt-8 pb-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">Оплатіть замовлення</h3>
              <p className="text-muted-foreground">
                Безпечно оплатіть послугу. Гроші утримуються на депозиті до прийняття роботи.
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold">4</div>
            <CardContent className="pt-8 pb-6 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">Отримайте результат</h3>
              <p className="text-muted-foreground">
                Перевірте виконану роботу, запросіть правки за потреби та підтвердіть завершення.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Детальна інструкція */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Детальна інструкція</h2>
          
          <Tabs defaultValue="find">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="find">Пошук</TabsTrigger>
              <TabsTrigger value="discuss">Обговорення</TabsTrigger>
              <TabsTrigger value="payment">Оплата</TabsTrigger>
              <TabsTrigger value="delivery">Отримання</TabsTrigger>
            </TabsList>
            
            <TabsContent value="find" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Як знайти відповідну послугу</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Використовуйте пошук та фільтри</h4>
                        <p className="text-muted-foreground mb-2">
                          Скористайтеся пошуком за ключовими словами та фільтрацією за категоріями, 
                          ціною та рейтингом, щоб знайти послуги, які відповідають вашим потребам.
                        </p>
                        <Button variant="outline" asChild>
                          <Link to="/services">Перейти до пошуку послуг</Link>
                        </Button>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Перегляньте профілі виконавців</h4>
                        <p className="text-muted-foreground">
                          Перевірте профіль виконавця, щоб ознайомитись з рейтингом, відгуками та 
                          портфоліо. Це допоможе обрати найкращого спеціаліста для вашого проєкту.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Порівняйте пакети послуг</h4>
                        <p className="text-muted-foreground">
                          Більшість виконавців пропонують різні пакети послуг з різними умовами та цінами. 
                          Оберіть той, який найкраще відповідає вашим вимогам та бюджету.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="discuss" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Як обговорити деталі з виконавцем</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Надішліть детальний запит</h4>
                        <p className="text-muted-foreground">
                          Опишіть ваш проєкт якомога детальніше. Зазначте цілі, вимоги, обмеження 
                          та очікуваний результат. Чим більше інформації ви надасте, тим точніше виконавець 
                          зрозуміє ваші потреби.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Обговоріть терміни та умови</h4>
                        <p className="text-muted-foreground">
                          Узгодьте з виконавцем точні терміни виконання, кількість правок, 
                          формат доставки результатів та інші важливі умови співпраці.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Підготуйте необхідні матеріали</h4>
                        <p className="text-muted-foreground">
                          Надайте виконавцю всі матеріали та доступи, необхідні для роботи. 
                          Це можуть бути тексти, зображення, логіни до сервісів тощо.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Як безпечно оплатити замовлення</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Оформлення замовлення</h4>
                        <p className="text-muted-foreground">
                          Після обговорення деталей, оформіть офіційне замовлення через платформу. 
                          Переконайтеся, що всі умови коректно відображені в замовленні.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Депозитна система</h4>
                        <p className="text-muted-foreground">
                          Платформа Hiwwer використовує систему безпечного депозиту. Ваш платіж зберігається 
                          на депозиті до моменту, коли ви підтвердите задовільне виконання роботи. 
                          Це захищає як клієнта, так і виконавця.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Безпечні способи оплати</h4>
                        <p className="text-muted-foreground">
                          Ви можете використовувати кредитні карти, PayPal та інші безпечні способи оплати. 
                          Всі транзакції шифруються та захищені.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="delivery" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Як отримати та прийняти результат</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Перевірка результату</h4>
                        <p className="text-muted-foreground">
                          Ретельно перевірте отриману роботу. Переконайтеся, що вона відповідає всім 
                          вимогам та очікуванням, які ви обговорювали з виконавцем.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Запит на правки</h4>
                        <p className="text-muted-foreground">
                          Якщо вам потрібні зміни, використовуйте функцію "Запит на правки" в системі. 
                          Чітко сформулюйте, що саме потрібно змінити, і виконавець внесе необхідні корективи.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Прийняття роботи та відгук</h4>
                        <p className="text-muted-foreground">
                          Коли ви повністю задоволені результатом, підтвердіть прийняття роботи в системі. 
                          Після цього кошти будуть переведені виконавцю. Не забудьте залишити відгук про виконавця 
                          та його роботу.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Переваги */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Переваги замовлення на Hiwwer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Безпечні платежі</h3>
                <p className="text-muted-foreground">
                  Система безпечного депозиту гарантує, що ви оплачуєте лише задовільно виконану роботу.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Star className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Перевірені виконавці</h3>
                <p className="text-muted-foreground">
                  Всі виконавці на платформі проходять верифікацію, а система рейтингів допомагає обрати найкращих.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <MessageSquare className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Telegram інтеграція</h3>
                <p className="text-muted-foreground">
                  Отримуйте оновлення статусу замовлення та спілкуйтеся з виконавцями прямо у Telegram.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Часті запитання */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Часті запитання</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Що робити, якщо я не задоволений результатом?</AccordionTrigger>
              <AccordionContent>
                Якщо ви не задоволені отриманою роботою, ви можете запросити правки. Більшість виконавців 
                пропонують кілька безкоштовних правок у рамках замовлення. Якщо після правок робота все ще 
                не відповідає вашим вимогам, ви можете відкрити спір у системі підтримки.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Чи можу я скасувати замовлення?</AccordionTrigger>
              <AccordionContent>
                Так, ви можете скасувати замовлення до початку роботи виконавця. Якщо виконавець вже почав 
                роботу, умови скасування та повернення коштів залежать від конкретного виконавця та умов 
                замовлення. Завжди читайте умови скасування перед оформленням замовлення.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Як довго зберігаються файли замовлення?</AccordionTrigger>
              <AccordionContent>
                Файли та матеріали замовлення зберігаються на платформі протягом 3 місяців після завершення 
                замовлення. Рекомендуємо завантажити всі матеріали одразу після прийняття роботи.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Чи отримаю я ліцензію на використання замовленої роботи?</AccordionTrigger>
              <AccordionContent>
                За замовчуванням, всі права на комерційне використання передаються замовнику після прийняття 
                роботи та повної оплати. Проте, конкретні умови ліцензування можуть відрізнятися залежно від 
                типу послуги та умов виконавця. Обов'язково обговоріть це питання з виконавцем перед замовленням.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Як працює оплата додаткових послуг?</AccordionTrigger>
              <AccordionContent>
                Якщо під час виконання замовлення виникла потреба в додаткових послугах або розширенні обсягу робіт, 
                виконавець може запропонувати додаткові послуги через систему. Ви можете прийняти або відхилити ці 
                пропозиції. У разі прийняття, додаткова сума буде додана до вашого замовлення.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Заклик до дії */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Готові почати?</h2>
          <p className="text-muted-foreground mb-6">
            Знайдіть професійних виконавців для ваших проєктів вже сьогодні
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/services">Знайти послуги</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/faq/client">Інші питання</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
