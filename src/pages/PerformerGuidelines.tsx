import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText,
  Clock,
  MessageSquare,
  Award,
  Star,
  Shield,
  DollarSign,
  ArrowRight,
  Info
} from 'lucide-react';

export default function PerformerGuidelines() {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Головний банер */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Правила для виконавців</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Дотримуйтесь цих правил та рекомендацій для успішної роботи на платформі Hiwwer
          </p>
        </div>

        {/* Вкладки з правилами */}
        <div className="max-w-4xl mx-auto mb-16">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Загальні правила</TabsTrigger>
              <TabsTrigger value="quality">Якість послуг</TabsTrigger>
              <TabsTrigger value="communication">Комунікація</TabsTrigger>
              <TabsTrigger value="payments">Оплата та комісії</TabsTrigger>
            </TabsList>
            
            {/* Загальні правила */}
            <TabsContent value="general" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Загальні правила платформи</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-blue-500" />
                        Дотримуйтесь правил платформи
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Як виконавець на Hiwwer, ви зобов'язані дотримуватись всіх правил та умов використання платформи. 
                        Порушення цих правил може призвести до тимчасового або постійного блокування вашого облікового запису.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-950">
                        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300">Основні правила, яких слід дотримуватись:</h4>
                        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Надавайте тільки послуги, які ви дійсно можете виконати якісно</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Не розміщуйте контент, що порушує авторські права або містить плагіат</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Не спонукайте клієнтів до спілкування поза платформою з метою уникнення комісії</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Дотримуйтесь термінів виконання замовлень</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Надавайте правдиву інформацію про свій досвід та навички</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <XCircle className="mr-2 h-5 w-5 text-red-500" />
                        Заборонені послуги та дії
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Існують певні типи послуг та дій, які заборонені на платформі Hiwwer. 
                        Надання таких послуг або здійснення таких дій призведе до негайного блокування вашого облікового запису.
                      </p>
                      <div className="bg-red-50 p-4 rounded-lg dark:bg-red-950">
                        <h4 className="font-medium mb-2 text-red-800 dark:text-red-300">Заборонено пропонувати послуги, пов'язані з:</h4>
                        <ul className="space-y-2 text-sm text-red-700 dark:text-red-400">
                          <li className="flex items-start">
                            <XCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Незаконною діяльністю або порушенням законодавства</span>
                          </li>
                          <li className="flex items-start">
                            <XCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Контентом для дорослих або матеріалами сексуального характеру</span>
                          </li>
                          <li className="flex items-start">
                            <XCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Шахрайськими або фіктивними послугами</span>
                          </li>
                          <li className="flex items-start">
                            <XCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Мовою ворожнечі, дискримінацією або насильством</span>
                          </li>
                          <li className="flex items-start">
                            <XCircle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Спамом, фішингом або шкідливим програмним забезпеченням</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                        Політика щодо порушень
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Hiwwer застосовує систему попереджень та санкцій до виконавців, які порушують правила платформи. 
                        Серйозність наслідків залежить від типу та кількості порушень.
                      </p>
                      <div className="space-y-4">
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">Перше порушення</h4>
                          <p className="text-sm text-muted-foreground">
                            Попередження та інформування про порушене правило
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">Друге порушення</h4>
                          <p className="text-sm text-muted-foreground">
                            Тимчасове обмеження видимості послуг у пошуку (7-14 днів)
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">Третє порушення</h4>
                          <p className="text-sm text-muted-foreground">
                            Тимчасове призупинення можливості приймати нові замовлення (30 днів)
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">Серйозні або повторні порушення</h4>
                          <p className="text-sm text-muted-foreground">
                            Постійне блокування облікового запису
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Якість послуг */}
            <TabsContent value="quality" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Вимоги до якості послуг</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Award className="mr-2 h-5 w-5 text-amber-500" />
                        Стандарти якості
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Hiwwer прагне забезпечити високу якість послуг для всіх клієнтів. 
                        Як виконавець, ви повинні дотримуватися наступних стандартів якості:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Професіоналізм</h4>
                            <p className="text-sm text-muted-foreground">
                              Надавайте послуги на професійному рівні, відповідно до галузевих стандартів та найкращих практик.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Точність</h4>
                            <p className="text-sm text-muted-foreground">
                              Результат повинен точно відповідати описаним вимогам та очікуванням клієнта.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Унікальність</h4>
                            <p className="text-sm text-muted-foreground">
                              Всі результати робіт повинні бути оригінальними та не порушувати авторські права третіх осіб.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Повнота</h4>
                            <p className="text-sm text-muted-foreground">
                              Забезпечуйте повне виконання всіх аспектів замовлення, без пропусків чи недоопрацювань.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-500" />
                        Опис послуг
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Чіткий та правдивий опис послуг є критично важливим для успішної роботи на платформі:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Рекомендовано
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>- Детальний опис того, що включено в послугу</li>
                            <li>- Чітке зазначення термінів виконання</li>
                            <li>- Вказання кількості правок, включених у базову ціну</li>
                            <li>- Зразки попередніх робіт для демонстрації якості</li>
                            <li>- Опис процесу роботи та етапів виконання</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 border rounded-lg border-red-200 dark:border-red-900">
                          <h4 className="font-medium mb-2 flex items-center text-red-600 dark:text-red-400">
                            <XCircle className="h-4 w-4 mr-2" />
                            Заборонено
                          </h4>
                          <ul className="space-y-2 text-sm text-red-600 dark:text-red-400">
                            <li>- Перебільшення своїх навичок або досвіду</li>
                            <li>- Обіцянки результатів, які ви не можете гарантувати</li>
                            <li>- Приховування важливих обмежень або додаткових витрат</li>
                            <li>- Використання чужих робіт як прикладів своїх послуг</li>
                            <li>- Копіювання описів послуг інших виконавців</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-yellow-500" />
                        Система рейтингу та відгуків
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Ваш рейтинг та відгуки є важливими факторами, які впливають на вашу видимість та успіх на платформі:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Як формується рейтинг</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>- Середня оцінка від клієнтів (1-5 зірок)</li>
                            <li>- Відсоток завершених замовлень</li>
                            <li>- Дотримання термінів виконання</li>
                            <li>- Швидкість відповіді на повідомлення</li>
                            <li>- Кількість скасованих замовлень</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Як покращити рейтинг</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>- Перевищуйте очікування клієнтів</li>
                            <li>- Завжди дотримуйтесь термінів</li>
                            <li>- Підтримуйте ввічливу та професійну комунікацію</li>
                            <li>- Швидко реагуйте на запити клієнтів</li>
                            <li>- Запитуйте відгуки після успішного виконання</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Комунікація */}
            <TabsContent value="communication" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Правила комунікації з клієнтами</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                        Основні принципи комунікації
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Ефективна та професійна комунікація є основою успішної співпраці з клієнтами:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Обов'язкові правила</h4>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                              <span className="text-sm">Відповідайте на повідомлення протягом 24 годин</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                              <span className="text-sm">Будьте ввічливими та професійними</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                              <span className="text-sm">Чітко пояснюйте всі деталі та очікування</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                              <span className="text-sm">Інформуйте клієнта про прогрес роботи</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                              <span className="text-sm">Повідомляйте про потенційні затримки заздалегідь</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Заборонені практики</h4>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <XCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                              <span className="text-sm">Обмін контактними даними для спілкування поза платформою</span>
                            </li>
                            <li className="flex items-start">
                              <XCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                              <span className="text-sm">Грубість, неповага або використання образливої лексики</span>
                            </li>
                            <li className="flex items-start">
                              <XCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                              <span className="text-sm">Спам або надсилання нерелевантних повідомлень</span>
                            </li>
                            <li className="flex items-start">
                              <XCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                              <span className="text-sm">Погрози або тиск на клієнта</span>
                            </li>
                            <li className="flex items-start">
                              <XCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                              <span className="text-sm">Реклама послуг, не пов'язаних із конкретним замовленням</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-amber-500" />
                        Управління очікуваннями клієнтів
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Правильне управління очікуваннями клієнтів є ключовим для успішного завершення замовлень:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-950">
                          <h4 className="font-medium mb-2">Рекомендації для ефективного управління очікуваннями:</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                              <span>На початку замовлення чітко обговоріть всі деталі та вимоги</span>
                            </li>
                            <li className="flex items-start">
                              <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                              <span>Визначте конкретні критерії успішного виконання замовлення</span>
                            </li>
                            <li className="flex items-start">
                              <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                              <span>Обговоріть кількість правок та процедуру їх запиту</span>
                            </li>
                            <li className="flex items-start">
                              <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                              <span>Встановіть реалістичні терміни з невеликим запасом часу на непередбачені ситуації</span>
                            </li>
                            <li className="flex items-start">
                              <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                              <span>Повідомляйте про прогрес роботи та потенційні труднощі</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-green-500" />
                        Вирішення конфліктів
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Іноді можуть виникати непорозуміння або конфлікти з клієнтами. 
                        Ось як правильно їх вирішувати:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">При виникненні конфлікту:</h4>
                          <ol className="space-y-2 text-sm list-decimal pl-5">
                            <li>
                              <span className="font-medium">Зберігайте спокій та професіоналізм</span> - 
                              незалежно від ситуації, залишайтеся ввічливими та професійними.
                            </li>
                            <li>
                              <span className="font-medium">Уважно вислухайте скаргу клієнта</span> - 
                              зрозумійте суть проблеми перед тим, як відповідати.
                            </li>
                            <li>
                              <span className="font-medium">Запропонуйте конкретне рішення</span> - 
                              сфокусуйтеся на тому, як ви можете вирішити проблему.
                            </li>
                            <li>
                              <span className="font-medium">Виконуйте обіцянки</span> - 
                              якщо ви погодилися на певні правки або компенсацію, виконайте це своєчасно.
                            </li>
                            <li>
                              <span className="font-medium">За необхідності, зверніться до служби підтримки</span> - 
                              якщо конфлікт не вдається вирішити, зверніться до модераторів платформи.
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Оплата та комісії */}
            <TabsContent value="payments" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Оплата, комісії та виведення коштів</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                        Система оплати
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Розуміння системи оплати та комісій є важливим для успішної роботи на платформі:
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Як працює система оплати:</h4>
                          <ol className="space-y-3 text-sm list-decimal pl-5">
                            <li>
                              <span className="font-medium">Клієнт здійснює оплату</span> - 
                              кошти утримуються на депозиті платформи.
                            </li>
                            <li>
                              <span className="font-medium">Ви виконуєте замовлення</span> - 
                              кошти залишаються на депозиті до перевірки клієнтом.
                            </li>
                            <li>
                              <span className="font-medium">Клієнт приймає роботу</span> - 
                              кошти (за вирахуванням комісії платформи) надходять на ваш баланс.
                            </li>
                            <li>
                              <span className="font-medium">Ви можете вивести кошти</span> - 
                              використовуючи доступні методи виведення.
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Комісії платформи</h3>
                      <p className="text-muted-foreground mb-4">
                        Hiwwer стягує комісію з кожного успішно виконаного замовлення. 
                        Ця комісія покриває витрати на обробку платежів, маркетинг, залучення клієнтів та підтримку платформи.
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-950">
                          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300">Структура комісій:</h4>
                          <div className="space-y-3 text-blue-700 dark:text-blue-400">
                            <div className="flex justify-between items-center">
                              <span>Стандартна комісія</span>
                              <span className="font-medium">15%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Виконавці рівня Pro (після 20 завершених замовлень)</span>
                              <span className="font-medium">12%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Виконавці рівня Top (після 50 завершених замовлень)</span>
                              <span className="font-medium">10%</span>
                            </div>
                            <div className="text-xs mt-3">
                              * Комісія розраховується від загальної суми замовлення
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Приклад розрахунку:</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Для замовлення вартістю $100:
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Сума замовлення</span>
                              <span className="font-medium">$100.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Комісія платформи (15%)</span>
                              <span className="font-medium">$15.00</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span>Ви отримуєте</span>
                              <span className="font-medium">$85.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Виведення коштів</h3>
                      <p className="text-muted-foreground mb-4">
                        Після успішного виконання замовлень ви можете вивести зароблені кошти 
                        на свій банківський рахунок або інші платіжні системи:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Способи виведення:</h4>
                          <ul className="space-y-2 text-sm">
                            <li>- Банківський переказ</li>
                            <li>- PayPal</li>
                            <li>- Wise (колишній TransferWise)</li>
                            <li>- Криптовалюти (Bitcoin, Ethereum)</li>
                            <li>- Електронні гаманці (залежно від країни)</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Умови виведення:</h4>
                          <ul className="space-y-2 text-sm">
                            <li>- Мінімальна сума для виведення: $50</li>
                            <li>- Період обробки: 1-5 робочих днів</li>
                            <li>- Кількість безкоштовних виведень на місяць: 1</li>
                            <li>- Комісія за додаткові виведення: $2</li>
                            <li>- Податкова документація: видається за запитом</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Поширені запитання */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Поширені запитання</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Що трапиться, якщо клієнт скасує замовлення?</AccordionTrigger>
              <AccordionContent>
                Якщо клієнт скасує замовлення до початку роботи, ви не отримаєте оплату. Якщо ви вже почали роботу, 
                оплата розраховується відповідно до прогресу: 50% оплати, якщо виконано більше половини роботи, 
                або повна оплата, якщо робота майже завершена (за рішенням модератора у спірних випадках).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Як пропонувати додаткові послуги клієнту?</AccordionTrigger>
              <AccordionContent>
                Ви можете пропонувати додаткові послуги через систему "Додаткові опції" на сторінці замовлення. 
                Клієнт отримає повідомлення з вашою пропозицією та зможе прийняти або відхилити її. 
                Після прийняття клієнтом, вартість додаткових послуг буде додана до загальної суми замовлення.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Що робити, якщо мені потрібно більше часу на виконання замовлення?</AccordionTrigger>
              <AccordionContent>
                Якщо вам потрібно продовжити термін виконання, вам слід якомога раніше повідомити про це клієнта 
                через систему повідомлень. Запропонуйте нову дату завершення та поясніть причини затримки. 
                Клієнт може прийняти або відхилити ваш запит. Важливо: регулярні затримки можуть негативно 
                вплинути на ваш рейтинг та видимість у пошуку.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Чи можу я пропонувати знижки постійним клієнтам?</AccordionTrigger>
              <AccordionContent>
                Так, ви можете пропонувати знижки постійним клієнтам через систему купонів. 
                У вашій панелі керування виконавця є розділ "Знижки та промокоди", 
                де ви можете створити персональні купони для окремих клієнтів або загальні промокоди 
                для певних категорій клієнтів. Знижки застосовуються до вартості замовлення, 
                але комісія платформи розраховується від початкової ціни послуги.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Як оскаржити несправедливий відгук?</AccordionTrigger>
              <AccordionContent>
                Якщо ви вважаєте, що отримали несправедливий відгук, ви можете оскаржити його через 
                систему підтримки. Для цього перейдіть на сторінку відгуку та натисніть "Оскаржити відгук". 
                Вам потрібно буде надати детальне пояснення та докази, що підтверджують вашу позицію. 
                Модератори розглянуть вашу скаргу та приймуть рішення протягом 5 робочих днів. 
                Зверніть увагу, що оскарженню підлягають лише відгуки, які порушують правила платформи 
                або містять недостовірну інформацію.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Додаткові ресурси */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Корисні ресурси</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/faq/performer" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  FAQ для виконавців
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Відповіді на поширені запитання про роботу на платформі Hiwwer
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
                  Повні юридичні умови використання платформи Hiwwer
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
                  Маєте питання чи потребуєте допомоги? Зв'яжіться з нашою командою підтримки
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Заклик до дії */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Готові почати?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Приєднуйтесь до тисяч успішних виконавців на Hiwwer та розвивайте свій бізнес
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/become-performer">Стати виконавцем</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/faq/performer">Більше інформації</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
