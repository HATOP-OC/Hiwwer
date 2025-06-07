import { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  CreditCard
} from 'lucide-react';

const ContactUs = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setContactForm(prev => ({ ...prev, subject: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Демонстраційний код для відправки форми
    console.log('Form submitted:', contactForm);
    
    // Показуємо сповіщення про успішну відправку
    toast({
      title: "Повідомлення надіслано",
      description: "Ми отримали ваше повідомлення і зв'яжемося з вами найближчим часом.",
      duration: 5000,
    });
    
    // Очищаємо форму та встановлюємо стан "відправлено"
    setContactForm({
      name: '',
      email: '',
      subject: 'general',
      message: ''
    });
    setFormSubmitted(true);
  };

  // Категорії для швидких посилань
  const faqCategories = [
    { id: 'orders', title: 'Замовлення та оплата', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'account', title: 'Обліковий запис', icon: <ShieldAlert className="h-5 w-5" /> },
    { id: 'performers', title: 'Питання для виконавців', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Зв'язатися з нами</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Маєте запитання чи потребуєте допомоги? Зв'яжіться з нами одним із зручних способів, і ми допоможемо вам якнайшвидше.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Контактна інформація та швидкі посилання */}
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6">Способи зв'язку</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Електронна пошта</h3>
                    <p className="text-muted-foreground mb-1">Отримайте відповідь протягом 24 годин</p>
                    <a href="mailto:support@hiwwer.com" className="text-primary hover:underline">
                      support@hiwwer.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Telegram бот</h3>
                    <p className="text-muted-foreground mb-1">Найшвидший спосіб отримати підтримку</p>
                    <a href="https://t.me/hiwwer_support_bot" className="text-primary hover:underline">
                      @hiwwer_support_bot
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Телефон підтримки</h3>
                    <p className="text-muted-foreground mb-1">Пн-Пт, 9:00 - 18:00 (EET)</p>
                    <a href="tel:+380441234567" className="text-primary hover:underline">
                      +38 (044) 123-45-67
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Адреса офісу</h3>
                    <p className="text-muted-foreground">
                      вул. Хрещатик, 22<br />
                      Київ, 01001<br />
                      Україна
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">Популярні запитання</h2>
              
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  {faqCategories.map(category => (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                      {category.icon}
                      <span className="ml-2 hidden sm:inline">{category.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="orders" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        <li>
                          <a href="/faq/client#payment" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Які способи оплати доступні?
                          </a>
                        </li>
                        <li>
                          <a href="/faq/client#refund" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Як можна отримати повернення коштів?
                          </a>
                        </li>
                        <li>
                          <a href="/faq/client#cancel" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Як скасувати замовлення?
                          </a>
                        </li>
                        <li>
                          <a href="/how-to-order" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Як правильно оформити замовлення?
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="account" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        <li>
                          <a href="/faq/client#password" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Як змінити пароль облікового запису?
                          </a>
                        </li>
                        <li>
                          <a href="/faq/client#delete-account" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Як видалити обліковий запис?
                          </a>
                        </li>
                        <li>
                          <a href="/faq/client#security" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Як захистити свій акаунт?
                          </a>
                        </li>
                        <li>
                          <a href="/privacy-policy" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Політика конфіденційності
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performers" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        <li>
                          <a href="/faq/performer#payout" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Як отримати виплату за виконане замовлення?
                          </a>
                        </li>
                        <li>
                          <a href="/faq/performer#commission" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Яка комісія платформи?
                          </a>
                        </li>
                        <li>
                          <a href="/performer-guidelines" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Правила для виконавців
                          </a>
                        </li>
                        <li>
                          <a href="/become-performer" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Як стати виконавцем?
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Контактна форма */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Надіслати повідомлення</h2>
            
            {formSubmitted ? (
              <Card>
                <CardContent className="pt-6 text-center py-16">
                  <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Дякуємо за звернення!</h3>
                  <p className="text-muted-foreground mb-6">
                    Ми отримали ваше повідомлення і зв'яжемося з вами якнайшвидше.
                    Зазвичай ми відповідаємо протягом 24 годин.
                  </p>
                  <Button onClick={() => setFormSubmitted(false)}>
                    Надіслати ще одне повідомлення
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Ваше ім'я</Label>
                        <Input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleChange}
                          placeholder="Введіть ваше ім'я"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Електронна пошта</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Тема звернення</Label>
                        <RadioGroup 
                          value={contactForm.subject} 
                          onValueChange={handleRadioChange}
                          className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="general" id="general" />
                            <Label htmlFor="general" className="cursor-pointer">Загальне питання</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="technical" id="technical" />
                            <Label htmlFor="technical" className="cursor-pointer">Технічна проблема</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="billing" id="billing" />
                            <Label htmlFor="billing" className="cursor-pointer">Оплата та рахунки</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="partnership" id="partnership" />
                            <Label htmlFor="partnership" className="cursor-pointer">Співпраця</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Повідомлення</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={contactForm.message}
                          onChange={handleChange}
                          placeholder="Опишіть ваше питання або проблему детально..."
                          rows={6}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" /> Надіслати повідомлення
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Картка з розташуванням офісу */}
        <div className="bg-card border rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Наш офіс</h2>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            {/* Тут можна інтегрувати Google Maps або інший сервіс карт */}
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">
                Карта з розташуванням офісу (Google Maps iframe)
              </p>
            </div>
          </div>
        </div>

        {/* Графік роботи та додаткова інформація */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Графік роботи</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Понеділок - П'ятниця</span>
                <span>9:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Субота</span>
                <span>10:00 - 15:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Неділя</span>
                <span>Вихідний</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-muted-foreground">
                Онлайн підтримка через Telegram доступна цілодобово 7 днів на тиждень для термінових питань.
              </p>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Для партнерів та ЗМІ</h3>
            <p className="text-muted-foreground mb-4">
              Якщо ви зацікавлені у співпраці або маєте запити від ЗМІ, будь ласка, напишіть нам на окрему адресу:
            </p>
            <a href="mailto:partnerships@hiwwer.com" className="text-primary hover:underline flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              partnerships@hiwwer.com
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
