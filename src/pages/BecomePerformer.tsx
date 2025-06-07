import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  DollarSign, 
  Users, 
  BarChart, 
  Clock,
  CheckCircle,
  MessageCircle,
  Star,
  ArrowRight,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

// Типи для форми
interface ApplicationFormData {
  name: string;
  email: string;
  skills: string;
  experience: string;
  portfolio: string;
  description: string;
}

export default function BecomePerformer() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    skills: '',
    experience: '',
    portfolio: '',
    description: ''
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Тут буде логіка відправки форми на сервер
    setIsSubmitting(true);
    
    // Імітуємо відправку на сервер
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Головний банер */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Станьте виконавцем на Hiwwer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Пропонуйте свої послуги тисячам клієнтів та розвивайте свій бізнес з нашою платформою
          </p>
        </div>

        {/* Показуємо або форму, або сторінку успішної подачі заявки */}
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ліва колонка - форма заявки */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Заявка на реєстрацію виконавця</h2>
                    <div className="text-sm text-muted-foreground">
                      Крок {step} з 3
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    {/* Крок 1: Основна інформація */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="name">Повне ім'я</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Введіть ваше повне ім'я"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Ваш контактний email"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="skills">Ваші навички (через кому)</Label>
                            <Input
                              id="skills"
                              name="skills"
                              value={formData.skills}
                              onChange={handleChange}
                              placeholder="Напр.: дизайн логотипів, брендинг, UI/UX дизайн"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button type="button" onClick={nextStep}>
                            Продовжити
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Крок 2: Досвід та портфоліо */}
                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="experience">Ваш досвід</Label>
                          <Textarea
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Розкажіть про ваш професійний досвід, проєкти та клієнтів"
                            className="min-h-[100px]"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio">Посилання на портфоліо або приклади робіт</Label>
                          <Input
                            id="portfolio"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleChange}
                            placeholder="Веб-сайт, Behance, GitHub, тощо"
                            required
                          />
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Назад
                          </Button>
                          <Button type="button" onClick={nextStep}>
                            Продовжити
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Крок 3: Опис послуг */}
                    {step === 3 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="description">Опишіть послуги, які ви хочете пропонувати</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Детально опишіть, які послуги ви можете надавати, ваші унікальні переваги та ціновий діапазон"
                            className="min-h-[150px]"
                            required
                          />
                        </div>
                        
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-950 dark:border-blue-900">
                          <p className="text-sm">
                            <strong>Примітка:</strong> Після подачі заявки наша команда перегляне її протягом 1-3 робочих днів. 
                            Ми можемо зв'язатися з вами для уточнення деталей або запросити додаткові матеріали.
                          </p>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Назад
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Відправка..." : "Відправити заявку"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Права колонка - переваги */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Переваги для виконавців</h3>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Збільшуйте дохід</h4>
                        <p className="text-sm text-muted-foreground">
                          Отримуйте замовлення від клієнтів по всьому світу без обмежень.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Розширюйте клієнтську базу</h4>
                        <p className="text-sm text-muted-foreground">
                          Знаходьте нових клієнтів без витрат на маркетинг і рекламу.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <BarChart className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Аналітика та зростання</h4>
                        <p className="text-sm text-muted-foreground">
                          Відстежуйте показники ефективності та постійно покращуйте свої послуги.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Гнучкий графік</h4>
                        <p className="text-sm text-muted-foreground">
                          Працюйте у зручний для вас час та керуйте своїм навантаженням.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Виконавці отримують:</h4>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Безкоштовний профіль виконавця</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Доступ до тисяч клієнтів</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Безпечну систему платежів</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Telegram інтеграцію для зручної роботи</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Професійні інструменти для зростання</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Сторінка успішної подачі заявки */
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Заявку успішно подано!</h2>
                <p className="text-muted-foreground mb-6">
                  Дякуємо за інтерес до співпраці з Hiwwer! Ми отримали вашу заявку та розглянемо її протягом 1-3 робочих днів. 
                  Очікуйте лист на вказану електронну пошту з подальшими інструкціями.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild>
                    <Link to="/">Повернутися на головну</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/performer-guidelines">Ознайомитись з правилами для виконавців</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Інформаційні блоки */}
        {!isSubmitted && (
          <>
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Як це працює</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <FileCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">1. Подайте заявку</h3>
                    <p className="text-muted-foreground">
                      Заповніть форму із вашими навичками, досвідом та пропонованими послугами.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">2. Пройдіть перевірку</h3>
                    <p className="text-muted-foreground">
                      Ми перевіримо вашу заявку та профіль, щоб гарантувати якість для наших клієнтів.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">3. Починайте заробляти</h3>
                    <p className="text-muted-foreground">
                      Створюйте послуги, отримуйте замовлення та розвивайте свій бізнес на Hiwwer.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Відгуки виконавців */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Відгуки виконавців</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&q=80" 
                          alt="Андрій К."
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Андрій К.</h4>
                        <p className="text-sm text-muted-foreground">Веб-розробник</p>
                      </div>
                    </div>
                    <div className="flex mb-4 text-amber-400">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      "Hiwwer дозволив мені знайти клієнтів з різних країн без значних витрат на маркетинг. 
                      Зручний інтерфейс і прозора система оплати дозволяють зосередитись на роботі."
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80" 
                          alt="Марія Л."
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Марія Л.</h4>
                        <p className="text-sm text-muted-foreground">Копірайтер</p>
                      </div>
                    </div>
                    <div className="flex mb-4 text-amber-400">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      "Після реєстрації на Hiwwer мій дохід від фрілансу зріс удвічі. 
                      Особливо подобається інтеграція з Telegram, яка дозволяє миттєво спілкуватися з клієнтами."
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&q=80" 
                          alt="Олег С."
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Олег С.</h4>
                        <p className="text-sm text-muted-foreground">Графічний дизайнер</p>
                      </div>
                    </div>
                    <div className="flex mb-4 text-amber-400">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                      <Star className="h-4 w-4 fill-amber-400" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      "Найкраща платформа для фрілансерів, яку я використовував. 
                      Безпечні платежі, чесна комісія та якісна підтримка роблять роботу комфортною."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Поширені запитання */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Поширені запитання</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Скільки коштує реєстрація виконавця?</h3>
                  <p className="text-sm text-muted-foreground">
                    Реєстрація виконавця на Hiwwer абсолютно безкоштовна. Комісія стягується лише за успішно виконані замовлення.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Яка комісія платформи?</h3>
                  <p className="text-sm text-muted-foreground">
                    Hiwwer стягує комісію у розмірі 15% від суми кожного успішно виконаного замовлення. Ця комісія включає обробку платежів, маркетингову підтримку та розвиток платформи.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Коли я отримую оплату за виконані замовлення?</h3>
                  <p className="text-sm text-muted-foreground">
                    Оплата надходить на ваш рахунок протягом 24 годин після того, як клієнт підтвердить прийняття роботи. Ви можете вивести кошти в будь-який зручний час.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Які вимоги до виконавців?</h3>
                  <p className="text-sm text-muted-foreground">
                    Основні вимоги: підтверджені професійні навички, портфоліо або приклади робіт, чітке розуміння правил платформи та зобов'язання надавати якісні послуги клієнтам.
                  </p>
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/faq/performer" className="text-primary hover:underline inline-flex items-center">
                    Переглянути всі запитання
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Заклик до дії */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Готові почати?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Приєднуйтесь до тисяч успішних виконавців на Hiwwer та розвивайте свій бізнес
              </p>
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Подати заявку зараз
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
