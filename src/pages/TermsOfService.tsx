import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, FileText, Calendar, Shield, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
  const [activeTab, setActiveTab] = useState('general');
  const lastUpdated = "1 травня 2025 року";

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Умови надання послуг</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Цей документ визначає правила та умови використання платформи Hiwwer.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Останнє оновлення: {lastUpdated}</span>
          </div>
        </div>

        {/* Навігація по розділах */}
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="flex flex-wrap justify-center mb-6">
            <TabsTrigger value="general">Загальні положення</TabsTrigger>
            <TabsTrigger value="registration">Реєстрація та акаунт</TabsTrigger>
            <TabsTrigger value="services">Послуги платформи</TabsTrigger>
            <TabsTrigger value="payments">Оплата та комісії</TabsTrigger>
            <TabsTrigger value="rights">Права та обов'язки</TabsTrigger>
            <TabsTrigger value="disputes">Вирішення спорів</TabsTrigger>
          </TabsList>

          {/* Загальні положення */}
          <TabsContent value="general">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">1. Загальні положення</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">1.1. Прийняття умов</h3>
                    <p className="text-muted-foreground mb-2">
                      Використовуючи платформу Hiwwer (далі - "Платформа"), ви погоджуєтеся з цими Умовами надання послуг (далі - "Умови"). Якщо ви не згодні з цими Умовами, будь ласка, не використовуйте Платформу.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">1.2. Визначення термінів</h3>
                    <p className="text-muted-foreground mb-2">
                      У цих Умовах наступні терміни мають такі значення:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Платформа</strong> - онлайн-сервіс Hiwwer, що надає можливість замовляти та виконувати цифрові послуги.</li>
                      <li><strong>Користувач</strong> - фізична або юридична особа, яка зареєструвалася на Платформі.</li>
                      <li><strong>Клієнт</strong> - Користувач, який замовляє послуги на Платформі.</li>
                      <li><strong>Виконавець</strong> - Користувач, який надає послуги через Платформу.</li>
                      <li><strong>Замовлення</strong> - запит на надання послуг, створений Клієнтом.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">1.3. Зміни в умовах</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми залишаємо за собою право змінювати ці Умови в будь-який час. Зміни набувають чинності після їх публікації на Платформі. Продовження використання Платформи після публікації змін означає прийняття нових Умов.
                    </p>
                    <p className="text-muted-foreground">
                      Про суттєві зміни в Умовах ми повідомлятимемо Користувачів електронною поштою або через повідомлення на Платформі.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">1.4. Законодавство</h3>
                    <p className="text-muted-foreground mb-2">
                      Ці Умови регулюються та тлумачяться відповідно до законодавства України, без урахування колізійних норм.
                    </p>
                    <p className="text-muted-foreground">
                      Якщо будь-яке положення цих Умов буде визнано недійсним або таким, що не підлягає виконанню, решта положень залишаються в силі.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Реєстрація та акаунт */}
          <TabsContent value="registration">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">2. Реєстрація та акаунт</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">2.1. Вимоги до реєстрації</h3>
                    <p className="text-muted-foreground mb-2">
                      Для використання Платформи ви повинні зареєструватися та створити акаунт. При реєстрації ви повинні надати точну, актуальну та повну інформацію про себе.
                    </p>
                    <p className="text-muted-foreground">
                      Для реєстрації на Платформі вам повинно бути не менше 18 років або ви повинні мати законне право укладати договори відповідно до вашого місцевого законодавства.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">2.2. Безпека акаунту</h3>
                    <p className="text-muted-foreground mb-2">
                      Ви несете відповідальність за збереження конфіденційності вашого пароля та за всі дії, що відбуваються під вашим акаунтом. Ви повинні негайно повідомити нас про будь-яке несанкціоноване використання вашого акаунта.
                    </p>
                    <p className="text-muted-foreground">
                      Ми рекомендуємо використовувати складні паролі та налаштувати двофакторну автентифікацію для підвищення безпеки вашого акаунту.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">2.3. Заборонені дії</h3>
                    <p className="text-muted-foreground mb-2">
                      Вам заборонено:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Створювати кілька акаунтів для однієї особи.</li>
                      <li>Видавати себе за іншу особу або компанію.</li>
                      <li>Використовувати акаунт іншого Користувача.</li>
                      <li>Продавати, передавати або дозволяти використання вашого акаунту третім особам.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">2.4. Призупинення та видалення акаунту</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми залишаємо за собою право призупинити або видалити ваш акаунт у разі порушення цих Умов, шахрайської діяльності, надання неправдивої інформації або якщо ви завдаєте шкоди іншим Користувачам або Платформі.
                    </p>
                    <p className="text-muted-foreground">
                      Ви можете видалити свій акаунт у будь-який час через налаштування профілю. Після видалення акаунту ви втратите доступ до всіх даних, пов'язаних з вашим акаунтом.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Послуги платформи */}
          <TabsContent value="services">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">3. Послуги платформи</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">3.1. Види послуг</h3>
                    <p className="text-muted-foreground mb-2">
                      Платформа є маркетплейсом, що дозволяє Клієнтам знаходити та замовляти цифрові послуги, а Виконавцям - пропонувати та надавати такі послуги.
                    </p>
                    <p className="text-muted-foreground">
                      Платформа не є стороною в договорах між Клієнтами та Виконавцями і не гарантує якість або результат послуг, наданих Виконавцями.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">3.2. Створення та виконання замовлень</h3>
                    <p className="text-muted-foreground mb-2">
                      Клієнти можуть створювати Замовлення через Платформу, вказуючи деталі, бюджет та терміни виконання. Виконавці можуть прийняти Замовлення або запропонувати власні умови.
                    </p>
                    <p className="text-muted-foreground">
                      Після узгодження умов Замовлення стає договором між Клієнтом та Виконавцем. Обидві сторони зобов'язані дотримуватися узгоджених умов.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">3.3. Обмеження на контент</h3>
                    <p className="text-muted-foreground mb-2">
                      Заборонено використовувати Платформу для замовлення або виконання послуг, пов'язаних з:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Незаконною діяльністю.</li>
                      <li>Порнографією та контентом для дорослих.</li>
                      <li>Насильством, дискримінацією або мовою ненависті.</li>
                      <li>Шахрайством або обманом.</li>
                      <li>Порушенням прав інтелектуальної власності.</li>
                      <li>Розповсюдженням шкідливого програмного забезпечення.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">3.4. Інтеграція з Telegram</h3>
                    <p className="text-muted-foreground mb-2">
                      Платформа надає можливість інтеграції з Telegram для зручності комунікації між Клієнтами та Виконавцями. 
                    </p>
                    <p className="text-muted-foreground">
                      Використовуючи цю функцію, ви погоджуєтеся на обробку ваших даних через Telegram та розумієте, що комунікація через Telegram підпорядковується також умовам використання Telegram.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Оплата та комісії */}
          <TabsContent value="payments">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">4. Оплата та комісії</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">4.1. Ціни та валюта</h3>
                    <p className="text-muted-foreground mb-2">
                      Усі ціни на Платформі вказуються у доларах США (USD). Оплата може здійснюватися в інших валютах, але буде конвертована за поточним курсом.
                    </p>
                    <p className="text-muted-foreground">
                      Виконавці самостійно встановлюють ціни на свої послуги. Платформа не регулює ціноутворення, окрім встановлення мінімальної вартості замовлення.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">4.2. Комісія платформи</h3>
                    <p className="text-muted-foreground mb-2">
                      Платформа стягує комісію з кожного успішно завершеного Замовлення. Комісія становить від 10% до 20% від суми Замовлення, залежно від статусу Виконавця.
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Статус Виконавця</TableHead>
                          <TableHead>Комісія</TableHead>
                          <TableHead>Умови</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Початковий</TableCell>
                          <TableCell>20%</TableCell>
                          <TableCell>До 10 виконаних замовлень</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Професіонал</TableCell>
                          <TableCell>15%</TableCell>
                          <TableCell>10-50 виконаних замовлень, рейтинг &gt;4.5</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Експерт</TableCell>
                          <TableCell>10%</TableCell>
                          <TableCell>&gt;50 виконаних замовлень, рейтинг &gt;4.8</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">4.3. Способи оплати</h3>
                    <p className="text-muted-foreground mb-2">
                      Платформа підтримує наступні способи оплати:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Кредитні та дебетові карти (Visa, Mastercard).</li>
                      <li>PayPal.</li>
                      <li>Банківський переказ (для корпоративних клієнтів).</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">4.4. Податки</h3>
                    <p className="text-muted-foreground mb-2">
                      Користувачі самостійно відповідають за сплату всіх податків, пов'язаних з їхньою діяльністю на Платформі.
                    </p>
                    <p className="text-muted-foreground">
                      Платформа може надавати звіти про доходи відповідним податковим органам, якщо це вимагається законодавством.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">4.5. Повернення коштів</h3>
                    <p className="text-muted-foreground mb-2">
                      Повернення коштів можливе у наступних випадках:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Виконавець не виконав замовлення у встановлений термін.</li>
                      <li>Результат роботи істотно відрізняється від узгодженого технічного завдання.</li>
                      <li>Виконавець відмовляється вносити обґрунтовані правки в межах узгодженого обсягу робіт.</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      Запит на повернення коштів повинен бути подано протягом 14 днів після доставки результату або завершення терміну виконання.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Права та обов'язки */}
          <TabsContent value="rights">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">5. Права та обов'язки</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">5.1. Права та обов'язки Користувачів</h3>
                    <p className="text-muted-foreground mb-2">
                      Користувачі мають право:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Отримувати доступ до Платформи та використовувати її функції відповідно до цих Умов.</li>
                      <li>Отримувати інформацію про умови надання послуг та комісії.</li>
                      <li>Отримувати технічну підтримку при виникненні проблем з Платформою.</li>
                    </ul>
                    <p className="text-muted-foreground mt-3 mb-2">
                      Користувачі зобов'язані:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Дотримуватися цих Умов та інших правил Платформи.</li>
                      <li>Надавати достовірну інформацію при реєстрації та використанні Платформи.</li>
                      <li>Не порушувати права інших Користувачів та третіх осіб.</li>
                      <li>Не використовувати Платформу для незаконної діяльності.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">5.2. Права та обов'язки Клієнтів</h3>
                    <p className="text-muted-foreground mb-2">
                      Клієнти мають право:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Створювати Замовлення та визначати їх умови.</li>
                      <li>Отримувати результати роботи відповідно до узгоджених умов.</li>
                      <li>Запитувати правки в межах узгодженого обсягу робіт.</li>
                    </ul>
                    <p className="text-muted-foreground mt-3 mb-2">
                      Клієнти зобов'язані:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Надавати чіткі та повні технічні завдання.</li>
                      <li>Своєчасно оплачувати послуги за узгодженими умовами.</li>
                      <li>Своєчасно перевіряти та підтверджувати отримані результати.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">5.3. Права та обов'язки Виконавців</h3>
                    <p className="text-muted-foreground mb-2">
                      Виконавці мають право:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Встановлювати ціни на свої послуги.</li>
                      <li>Приймати або відхиляти Замовлення.</li>
                      <li>Отримувати оплату за виконані Замовлення.</li>
                    </ul>
                    <p className="text-muted-foreground mt-3 mb-2">
                      Виконавці зобов'язані:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Виконувати прийняті Замовлення відповідно до узгоджених умов.</li>
                      <li>Дотримуватися термінів виконання.</li>
                      <li>Надавати якісні результати, що відповідають технічному завданню.</li>
                      <li>Вносити правки в межах узгодженого обсягу робіт.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">5.4. Інтелектуальна власність</h3>
                    <p className="text-muted-foreground mb-2">
                      Якщо інше не узгоджено між Клієнтом та Виконавцем, після повної оплати Замовлення права на результати роботи переходять до Клієнта.
                    </p>
                    <p className="text-muted-foreground">
                      Виконавці можуть використовувати результати своєї роботи в портфоліо, якщо це не порушує конфіденційність та інші угоди з Клієнтом.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вирішення спорів */}
          <TabsContent value="disputes">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">6. Вирішення спорів</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">6.1. Процедура вирішення спорів</h3>
                    <p className="text-muted-foreground mb-2">
                      У разі виникнення спору між Клієнтом та Виконавцем, сторони повинні спочатку спробувати вирішити його шляхом прямого спілкування.
                    </p>
                    <p className="text-muted-foreground">
                      Якщо сторони не можуть вирішити спір самостійно, вони можуть звернутися до служби підтримки Платформи для медіації.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">6.2. Арбітраж</h3>
                    <p className="text-muted-foreground mb-2">
                      Якщо спір не вдається вирішити через медіацію, Платформа може призначити арбітра для винесення остаточного рішення.
                    </p>
                    <p className="text-muted-foreground">
                      Рішення арбітра є обов'язковим для обох сторін. Платформа зберігає за собою право заморозити кошти до вирішення спору.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">6.3. Законодавство та юрисдикція</h3>
                    <p className="text-muted-foreground mb-2">
                      Ці Умови регулюються та тлумачяться відповідно до законодавства України.
                    </p>
                    <p className="text-muted-foreground">
                      Будь-які спори, що не можуть бути вирішені через внутрішні процедури Платформи, підлягають розгляду в судах України.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">6.4. Термін подання скарг</h3>
                    <p className="text-muted-foreground mb-2">
                      Скарги щодо якості послуг або результатів роботи повинні бути подані протягом 14 днів після доставки результату або завершення терміну виконання.
                    </p>
                    <p className="text-muted-foreground">
                      Скарги, подані після цього терміну, можуть бути відхилені, якщо не було вагомих причин для затримки.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Інформаційний блок внизу */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start mb-4">
              <FileText className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Завантажити PDF версію</h3>
                <p className="text-muted-foreground mt-1">
                  Отримайте повну версію умов використання у форматі PDF для зручного зберігання та друку.
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Завантажити документ
            </Button>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start mb-4">
              <AlertCircle className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Питання щодо умов використання?</h3>
                <p className="text-muted-foreground mt-1">
                  Якщо у вас виникли запитання чи потрібні роз'яснення щодо умов використання, зв'яжіться з нашою командою підтримки.
                </p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/contact-us">Зв'язатися з підтримкою</Link>
            </Button>
          </div>
        </div>

        {/* Згода користувача */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Використовуючи нашу платформу, ви підтверджуєте, що прочитали, зрозуміли та погоджуєтеся з цими Умовами надання послуг та нашою <Link to="/privacy-policy" className="text-primary hover:underline">Політикою конфіденційності</Link>.
          </p>
          <div className="flex justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
