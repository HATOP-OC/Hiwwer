import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, FileText, Calendar, Shield, Lock, Info } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState('collection');
  const lastUpdated = "1 травня 2025 року";

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Політика конфіденційності</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ми цінуємо вашу приватність та дотримуємося найвищих стандартів щодо захисту ваших персональних даних.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Останнє оновлення: {lastUpdated}</span>
          </div>
        </div>

        <Alert className="mb-8 max-w-4xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Використовуючи Hiwwer, ви погоджуєтеся з умовами цієї Політики конфіденційності. Якщо ви не погоджуєтеся з цими умовами, будь ласка, не використовуйте нашу платформу.
          </AlertDescription>
        </Alert>

        {/* Навігація по розділах */}
        <Tabs defaultValue="collection" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="flex flex-wrap justify-center mb-6">
            <TabsTrigger value="collection">Збір даних</TabsTrigger>
            <TabsTrigger value="usage">Використання даних</TabsTrigger>
            <TabsTrigger value="sharing">Розкриття даних</TabsTrigger>
            <TabsTrigger value="security">Безпека даних</TabsTrigger>
            <TabsTrigger value="cookies">Файли cookie</TabsTrigger>
            <TabsTrigger value="rights">Ваші права</TabsTrigger>
          </TabsList>

          {/* Збір даних */}
          <TabsContent value="collection">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">1. Збір персональних даних</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">1.1. Дані, які ми збираємо</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми можемо збирати наступні типи персональних даних:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Ідентифікаційні дані</strong>: ім'я, прізвище, адреса електронної пошти, номер телефону, фотографія профілю.</li>
                      <li><strong>Контактні дані</strong>: адреса, місто, країна, поштовий індекс.</li>
                      <li><strong>Облікові дані</strong>: логін, пароль (у зашифрованому вигляді).</li>
                      <li><strong>Фінансова інформація</strong>: дані платіжних карток (обробляються через захищені платіжні шлюзи), історія транзакцій.</li>
                      <li><strong>Професійна інформація</strong>: досвід роботи, навички, портфоліо, спеціалізація.</li>
                      <li><strong>Дані для верифікації</strong>: документи, що посвідчують особу (для виконавців).</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">1.2. Способи збору даних</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми збираємо персональні дані наступними способами:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Пряме надання</strong>: дані, які ви надаєте при реєстрації, створенні профілю, замовленні послуг або спілкуванні з нами.</li>
                      <li><strong>Автоматичний збір</strong>: технічна інформація, що збирається автоматично при використанні нашої платформи (IP-адреса, тип пристрою, браузер, файли cookie).</li>
                      <li><strong>Через соціальні мережі</strong>: якщо ви підключаєте свій акаунт до соціальних мереж або використовуєте їх для входу.</li>
                      <li><strong>Через Telegram</strong>: при використанні інтеграції з Telegram для комунікації та управління замовленнями.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">1.3. Законні підстави для обробки</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми обробляємо ваші персональні дані на основі наступних правових підстав:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Виконання договору</strong>: обробка даних необхідна для виконання угоди з вами.</li>
                      <li><strong>Законні інтереси</strong>: обробка даних необхідна для наших законних інтересів, за умови, що ваші права не переважають ці інтереси.</li>
                      <li><strong>Згода</strong>: ви надали згоду на обробку ваших персональних даних для конкретних цілей.</li>
                      <li><strong>Юридичні зобов'язання</strong>: обробка необхідна для дотримання законодавчих вимог.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">1.4. Термін зберігання даних</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми зберігаємо ваші персональні дані лише стільки, скільки необхідно для досягнення цілей, для яких вони були зібрані, або для дотримання законодавчих вимог.
                    </p>
                    <p className="text-muted-foreground">
                      Після видалення вашого акаунту ми можемо зберігати деякі дані протягом додаткового періоду для вирішення спорів, запобігання шахрайству, дотримання законодавчих вимог або для захисту наших законних інтересів.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Використання даних */}
          <TabsContent value="usage">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">2. Використання даних</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">2.1. Цілі використання даних</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми використовуємо ваші персональні дані для наступних цілей:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Надання послуг</strong>: забезпечення функціонування платформи, обробка замовлень, комунікація між клієнтами та виконавцями.</li>
                      <li><strong>Верифікація акаунтів</strong>: перевірка особи користувачів для забезпечення безпеки та довіри на платформі.</li>
                      <li><strong>Обробка платежів</strong>: управління фінансовими транзакціями, виплати виконавцям, повернення коштів.</li>
                      <li><strong>Комунікація</strong>: надсилання повідомлень про оновлення, сповіщень про замовлення, відповіді на запити.</li>
                      <li><strong>Покращення сервісу</strong>: аналіз поведінки користувачів для оптимізації функцій та інтерфейсу платформи.</li>
                      <li><strong>Безпека</strong>: запобігання шахрайству, виявлення підозрілої активності, захист акаунтів.</li>
                      <li><strong>Маркетинг</strong>: надсилання релевантних пропозицій та інформації про нові функції (за вашої згоди).</li>
                      <li><strong>Дотримання законодавства</strong>: виконання юридичних зобов'язань та реагування на запити правоохоронних органів.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">2.2. Автоматизоване прийняття рішень</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми можемо використовувати автоматизовані системи для:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Ранжування виконавців у результатах пошуку на основі рейтингу, відгуків та інших факторів.</li>
                      <li>Виявлення потенційно шахрайської активності та порушень правил платформи.</li>
                      <li>Персоналізації рекомендацій послуг на основі вашої історії та уподобань.</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      Ви маєте право оскаржити рішення, прийняте виключно на основі автоматизованої обробки, та запросити людське втручання.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">2.3. Маркетингові комунікації</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми можемо надсилати вам маркетингові повідомлення про нові функції, пропозиції та події, якщо ви надали згоду на отримання таких повідомлень.
                    </p>
                    <p className="text-muted-foreground">
                      Ви можете відмовитися від маркетингових комунікацій у будь-який час, використовуючи посилання для відписки в наших електронних листах або змінивши налаштування повідомлень у вашому профілі.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Розкриття даних */}
          <TabsContent value="sharing">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">3. Розкриття даних</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">3.1. Кому ми розкриваємо дані</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми можемо розкривати ваші персональні дані наступним категоріям одержувачів:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Інші користувачі платформи</strong>: інформація з вашого профілю (ім'я, фото, рейтинг, відгуки) може бути видима іншим користувачам платформи.</li>
                      <li><strong>Постачальники послуг</strong>: компанії, які надають нам послуги, такі як обробка платежів, хостинг, аналітика, служба підтримки.</li>
                      <li><strong>Партнери</strong>: компанії, з якими ми співпрацюємо для надання додаткових послуг або функцій.</li>
                      <li><strong>Правоохоронні органи</strong>: у випадках, передбачених законодавством, для розслідування шахрайства або реагування на судові запити.</li>
                      <li><strong>Потенційні покупці</strong>: у разі продажу або реорганізації нашої компанії ваші дані можуть бути передані новому власнику.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">3.2. Міжнародна передача даних</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми можемо передавати ваші персональні дані до країн за межами України або Європейського Союзу, де закони про захист даних можуть відрізнятися.
                    </p>
                    <p className="text-muted-foreground">
                      У таких випадках ми забезпечуємо відповідні заходи захисту, такі як стандартні договірні положення, або переконуємося, що одержувачі дотримуються затверджених механізмів захисту даних.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">3.3. Telegram інтеграція</h3>
                    <p className="text-muted-foreground mb-2">
                      Якщо ви використовуєте нашу інтеграцію з Telegram, певні дані можуть передаватися між нашою платформою та Telegram, включаючи:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Ваше ім'я користувача Telegram та ID.</li>
                      <li>Повідомлення, надіслані через бота.</li>
                      <li>Інформація про замовлення та статуси.</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      Використання Telegram підпадає також під умови використання та політику конфіденційності Telegram.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Безпека даних */}
          <TabsContent value="security">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">4. Безпека даних</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">4.1. Заходи захисту</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми впроваджуємо відповідні технічні та організаційні заходи для захисту ваших персональних даних, включаючи:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Шифрування даних при передачі та зберіганні.</li>
                      <li>Регулярне тестування та оновлення систем безпеки.</li>
                      <li>Обмеження доступу до персональних даних для співробітників та підрядників.</li>
                      <li>Моніторинг систем для виявлення потенційних вразливостей та підозрілої активності.</li>
                      <li>Двофакторна автентифікація для доступу до облікових записів.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">4.2. Порушення даних</h3>
                    <p className="text-muted-foreground mb-2">
                      У випадку порушення безпеки, що призводить до випадкового або незаконного знищення, втрати, зміни, несанкціонованого розкриття або доступу до ваших персональних даних, ми:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Повідомимо вас про інцидент без невиправданої затримки, якщо це призводить до високого ризику для ваших прав та свобод.</li>
                      <li>Повідомимо відповідні органи захисту даних протягом 72 годин після виявлення інциденту.</li>
                      <li>Проведемо розслідування інциденту та вживемо заходи для зменшення потенційних негативних наслідків.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">4.3. Ваша роль у безпеці</h3>
                    <p className="text-muted-foreground mb-2">
                      Ви також відіграєте важливу роль у захисті ваших даних:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Використовуйте надійні та унікальні паролі для вашого акаунту.</li>
                      <li>Не розголошуйте свої облікові дані іншим особам.</li>
                      <li>Налаштуйте двофакторну автентифікацію для додаткового захисту.</li>
                      <li>Оновлюйте свої пристрої та браузери для захисту від вразливостей.</li>
                      <li>Будьте обережні з посиланнями та вкладеннями в електронних листах, навіть якщо вони виглядають як відправлені від нас.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Файли cookie */}
          <TabsContent value="cookies">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">5. Файли cookie та технології відстеження</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">5.1. Що таке файли cookie</h3>
                    <p className="text-muted-foreground mb-2">
                      Файли cookie - це невеликі текстові файли, які зберігаються на вашому пристрої при відвідуванні нашого веб-сайту. Вони дозволяють нам розпізнавати ваш браузер та надавати покращений досвід використання.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">5.2. Типи файлів cookie, які ми використовуємо</h3>
                    <p className="text-muted-foreground mb-2">
                      Ми використовуємо різні типи файлів cookie:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Необхідні cookie</strong>: потрібні для функціонування платформи та не можуть бути вимкнені.</li>
                      <li><strong>Функціональні cookie</strong>: дозволяють запам'ятати ваші налаштування та переваги.</li>
                      <li><strong>Аналітичні cookie</strong>: допомагають нам аналізувати, як ви взаємодієте з платформою, для її покращення.</li>
                      <li><strong>Маркетингові cookie</strong>: використовуються для показу релевантних оголошень на нашій платформі та на сторонніх сайтах.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">5.3. Управління файлами cookie</h3>
                    <p className="text-muted-foreground mb-2">
                      Ви можете контролювати та видаляти файли cookie через налаштування вашого браузера. Проте, якщо ви видалите або відхилите файли cookie, деякі функції нашої платформи можуть працювати неправильно.
                    </p>
                    <p className="text-muted-foreground">
                      При першому відвідуванні нашої платформи ви отримаєте повідомлення про використання файлів cookie та можливість налаштувати ваші переваги.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">5.4. Інші технології відстеження</h3>
                    <p className="text-muted-foreground mb-2">
                      Крім файлів cookie, ми можемо використовувати інші технології відстеження, такі як:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Веб-маяки</strong>: невеликі графічні зображення, які дозволяють відстежувати поведінку користувачів та ефективність маркетингових кампаній.</li>
                      <li><strong>Піксельні теги</strong>: маленькі фрагменти коду, вбудовані в наш веб-сайт або електронні листи.</li>
                      <li><strong>Локальне сховище</strong>: дані, що зберігаються локально у вашому браузері.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ваші права */}
          <TabsContent value="rights">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">6. Ваші права щодо персональних даних</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">6.1. Ваші права</h3>
                    <p className="text-muted-foreground mb-2">
                      Відповідно до законодавства про захист даних, ви маєте наступні права:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Право на доступ</strong>: отримувати інформацію про те, які ваші персональні дані ми обробляємо та копію цих даних.</li>
                      <li><strong>Право на виправлення</strong>: вимагати виправлення неточних або неповних персональних даних.</li>
                      <li><strong>Право на видалення</strong>: вимагати видалення ваших персональних даних за певних обставин.</li>
                      <li><strong>Право на обмеження обробки</strong>: вимагати тимчасового припинення обробки ваших даних.</li>
                      <li><strong>Право на перенесення даних</strong>: отримувати ваші дані в структурованому, загальноприйнятому форматі та передавати їх іншому контролеру даних.</li>
                      <li><strong>Право на заперечення</strong>: заперечувати проти обробки ваших даних для певних цілей, зокрема для прямого маркетингу.</li>
                      <li><strong>Право відкликати згоду</strong>: відкликати раніше надану згоду на обробку даних у будь-який час.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">6.2. Як реалізувати свої права</h3>
                    <p className="text-muted-foreground mb-2">
                      Для реалізації ваших прав ви можете:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Змінити ваші дані та налаштування в особистому профілі на платформі.</li>
                      <li>Зв'язатися з нашим відділом конфіденційності за адресою privacy@hiwwer.com.</li>
                      <li>Надіслати письмовий запит на нашу поштову адресу.</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      Ми відповімо на ваш запит протягом одного місяця. У складних випадках цей термін може бути продовжений ще на два місяці, про що ми повідомимо вас.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">6.3. Обмеження прав</h3>
                    <p className="text-muted-foreground mb-2">
                      У деяких випадках ваші права можуть бути обмежені, наприклад, якщо:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Ваш запит явно необґрунтований або надмірний.</li>
                      <li>Обробка необхідна для дотримання законодавчих вимог.</li>
                      <li>Дані необхідні для встановлення, здійснення або захисту правових вимог.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">6.4. Право на скаргу</h3>
                    <p className="text-muted-foreground mb-2">
                      Якщо ви вважаєте, що обробка ваших персональних даних порушує законодавство про захист даних, ви маєте право подати скаргу до Уповноваженого Верховної Ради України з прав людини або іншого відповідного органу захисту даних у вашій країні.
                    </p>
                    <p className="text-muted-foreground">
                      Ми заохочуємо вас спочатку зв'язатися з нами, щоб ми могли спробувати вирішити ваші занепокоєння безпосередньо.
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
                  Отримайте повну версію політики конфіденційності у форматі PDF для зручного зберігання та друку.
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Завантажити документ
            </Button>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-start mb-4">
              <Lock className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Питання щодо конфіденційності?</h3>
                <p className="text-muted-foreground mt-1">
                  Якщо у вас виникли запитання чи занепокоєння щодо обробки ваших персональних даних, зв'яжіться з нашим відділом конфіденційності.
                </p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/contact-us">Зв'язатися з відділом конфіденційності</Link>
            </Button>
          </div>
        </div>

        {/* Заключний текст */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Ми зберігаємо за собою право оновлювати цю Політику конфіденційності в будь-який час. Ми повідомимо вас про будь-які суттєві зміни через повідомлення на нашій платформі або електронною поштою.
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
