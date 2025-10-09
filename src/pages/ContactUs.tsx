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
import { sendContactMessage } from '@/lib/api.ts';
import { useTranslation } from 'react-i18next';

const ContactUs = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendContactMessage(contactForm);
      toast({
        title: t('contactUsPage.toast.successTitle'),
        description: t('contactUsPage.toast.successDesc'),
        duration: 5000,
      });
      setContactForm({ name: '', email: '', subject: 'general', message: '' });
      setFormSubmitted(true);
    } catch (error) {
      toast({
        title: t('contactUsPage.toast.errorTitle'),
        description: t('contactUsPage.toast.errorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqCategories = [
    { id: 'orders', title: t('contactUsPage.faqCategories.orders'), icon: <CreditCard className="h-5 w-5" /> },
    { id: 'account', title: t('contactUsPage.faqCategories.account'), icon: <ShieldAlert className="h-5 w-5" /> },
    { id: 'performers', title: t('contactUsPage.faqCategories.performers'), icon: <HelpCircle className="h-5 w-5" /> },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('contactUsPage.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contactUsPage.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-16">
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6">{t('contactUsPage.methodsTitle')}</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{t('contactUsPage.emailTitle')}</h3>
                    <p className="text-muted-foreground mb-1">{t('contactUsPage.emailDesc')}</p>
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
                    <h3 className="font-medium mb-1">{t('contactUsPage.telegramTitle')}</h3>
                    <p className="text-muted-foreground mb-1">{t('contactUsPage.telegramDesc')}</p>
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
                    <h3 className="font-medium mb-1">{t('contactUsPage.phoneTitle')}</h3>
                    <p className="text-muted-foreground mb-1">{t('contactUsPage.phoneDesc')}</p>
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
                    <h3 className="font-medium mb-1">{t('contactUsPage.officeTitle')}</h3>
                    <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('contactUsPage.officeAddress') }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">{t('contactUsPage.popularQuestionsTitle')}</h2>
              
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
                            {t('contactUsPage.faqLinks.paymentMethods')}
                          </a>
                        </li>
                        <li>
                          <a href="/faq/client#refund" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.refund')}
                          </a>
                        </li>
                        <li>
                          <a href="/faq/client#cancel" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.cancelOrder')}
                          </a>
                        </li>
                        <li>
                          <a href="/how-to-order" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.howToOrder')}
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
                            {t('contactUsPage.faqLinks.changePassword')}
                          </a>
                        </li>
                        <li>
                          <a href="/faq/client#delete-account" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.deleteAccount')}
                          </a>
                        </li>
                        <li>
                          <a href="/faq/client#security" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.secureAccount')}
                          </a>
                        </li>
                        <li>
                          <a href="/privacy-policy" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.privacyPolicy')}
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
                            {t('contactUsPage.faqLinks.payout')}
                          </a>
                        </li>
                        <li>
                          <a href="/faq/performer#commission" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.commission')}
                          </a>
                        </li>
                        <li>
                          <a href="/performer-guidelines" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.performerRules')}
                          </a>
                        </li>
                        <li>
                          <a href="/become-performer" className="text-primary hover:underline flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('contactUsPage.faqLinks.becomePerformer')}
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">{t('contactUsPage.formTitle')}</h2>
            
            {formSubmitted ? (
              <Card>
                <CardContent className="pt-6 text-center py-16">
                  <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{t('contactUsPage.submitted.title')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('contactUsPage.submitted.desc')}
                  </p>
                  <Button onClick={() => setFormSubmitted(false)}>
                    {t('contactUsPage.submitted.sendAnother')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">{t('contactUsPage.form.nameLabel')}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleChange}
                          placeholder={t('contactUsPage.form.namePlaceholder')}
                          required
                          disabled={isSubmitting}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">{t('contactUsPage.form.emailLabel')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleChange}
                          placeholder={t('contactUsPage.form.emailPlaceholder')}
                          required
                          disabled={isSubmitting}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>{t('contactUsPage.form.subjectLabel')}</Label>
                        <RadioGroup 
                          value={contactForm.subject} 
                          onValueChange={handleRadioChange}
                          className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2"
                          disabled={isSubmitting}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="general" id="general" disabled={isSubmitting} />
                            <Label htmlFor="general" className="cursor-pointer">{t('contactUsPage.form.subjects.general')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="technical" id="technical" disabled={isSubmitting} />
                            <Label htmlFor="technical" className="cursor-pointer">{t('contactUsPage.form.subjects.technical')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="billing" id="billing" disabled={isSubmitting} />
                            <Label htmlFor="billing" className="cursor-pointer">{t('contactUsPage.form.subjects.billing')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="partnership" id="partnership" disabled={isSubmitting} />
                            <Label htmlFor="partnership" className="cursor-pointer">{t('contactUsPage.form.subjects.partnership')}</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <Label htmlFor="message">{t('contactUsPage.form.messageLabel')}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={contactForm.message}
                          onChange={handleChange}
                          placeholder={t('contactUsPage.form.messagePlaceholder')}
                          rows={6}
                          required
                          disabled={isSubmitting}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4zm16 0a8 8 0 01-8 8v-4a4 4 0 004-4h4z"></path>
                          </svg>
                          {t('contactUsPage.form.submitButtonLoading')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> {t('contactUsPage.form.submitButton')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">{t('contactUsPage.officeMapTitle')}</h2>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">
                {t('contactUsPage.officeMapPlaceholder')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">{t('contactUsPage.workingHoursTitle')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('contactUsPage.workingHours.weekdays')}</span>
                <span>9:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('contactUsPage.workingHours.saturday')}</span>
                <span>10:00 - 15:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('contactUsPage.workingHours.sunday')}</span>
                <span>{t('contactUsPage.workingHours.closed')}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-muted-foreground">
                {t('contactUsPage.onlineSupport')}
              </p>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">{t('contactUsPage.partnersTitle')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('contactUsPage.partnersDesc')}
            </p>
            <a href="mailto:partnerships@hiwwer.com" className="text-primary hover:underline flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              {t('contactUsPage.partnersEmail')}
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;