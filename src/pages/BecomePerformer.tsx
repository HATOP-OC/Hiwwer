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
  Star,
  ArrowRight,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { submitPerformerApplication } from '@/lib/api';
import { useTranslation } from 'react-i18next';

interface ApplicationFormData {
  name: string;
  email: string;
  skills: string;
  experience: string;
  portfolio: string;
  description: string;
}

export default function BecomePerformer() {
  const { t } = useTranslation();
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitPerformerApplication(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('becomePerformerPage.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('becomePerformerPage.subtitle')}
          </p>
        </div>

        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">{t('becomePerformerPage.formTitle')}</h2>
                    <div className="text-sm text-muted-foreground">
                      {t('becomePerformerPage.step')} {step} {t('becomePerformerPage.of')} 3
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="name">{t('becomePerformerPage.form.nameLabel')}</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder={t('becomePerformerPage.form.namePlaceholder')}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">{t('becomePerformerPage.form.emailLabel')}</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder={t('becomePerformerPage.form.emailPlaceholder')}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="skills">{t('becomePerformerPage.form.skillsLabel')}</Label>
                            <Input
                              id="skills"
                              name="skills"
                              value={formData.skills}
                              onChange={handleChange}
                              placeholder={t('becomePerformerPage.form.skillsPlaceholder')}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button type="button" onClick={nextStep}>
                            {t('becomePerformerPage.form.continue')}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="experience">{t('becomePerformerPage.form.experienceLabel')}</Label>
                          <Textarea
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder={t('becomePerformerPage.form.experiencePlaceholder')}
                            className="min-h-[100px]"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio">{t('becomePerformerPage.form.portfolioLabel')}</Label>
                          <Input
                            id="portfolio"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleChange}
                            placeholder={t('becomePerformerPage.form.portfolioPlaceholder')}
                            required
                          />
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            {t('becomePerformerPage.form.back')}
                          </Button>
                          <Button type="button" onClick={nextStep}>
                            {t('becomePerformerPage.form.continue')}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {step === 3 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="description">{t('becomePerformerPage.form.descriptionLabel')}</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder={t('becomePerformerPage.form.descriptionPlaceholder')}
                            className="min-h-[150px]"
                            required
                          />
                        </div>
                        
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-950 dark:border-blue-900">
                          <p className="text-sm">
                            <strong>{t('becomePerformerPage.form.note')}</strong> {t('becomePerformerPage.form.noteText')}
                          </p>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            {t('becomePerformerPage.form.back')}
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('becomePerformerPage.form.submitting') : t('becomePerformerPage.form.submit')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{t('becomePerformerPage.benefits.title')}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t('becomePerformerPage.benefits.increaseIncome_title')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('becomePerformerPage.benefits.increaseIncome_desc')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t('becomePerformerPage.benefits.expandClientBase_title')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('becomePerformerPage.benefits.expandClientBase_desc')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <BarChart className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t('becomePerformerPage.benefits.analyticsAndGrowth_title')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('becomePerformerPage.benefits.analyticsAndGrowth_desc')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t('becomePerformerPage.benefits.flexibleSchedule_title')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('becomePerformerPage.benefits.flexibleSchedule_desc')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">{t('becomePerformerPage.performersGet.title')}</h4>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">{t('becomePerformerPage.performersGet.item1')}</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">{t('becomePerformerPage.performersGet.item2')}</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">{t('becomePerformerPage.performersGet.item3')}</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">{t('becomePerformerPage.performersGet.item4')}</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">{t('becomePerformerPage.performersGet.item5')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">{t('becomePerformerPage.submissionSuccess.title')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('becomePerformerPage.submissionSuccess.desc')}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild>
                    <Link to="/">{t('becomePerformerPage.submissionSuccess.backToHome')}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/performer-guidelines">{t('becomePerformerPage.submissionSuccess.readGuidelines')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isSubmitted && (
          <>
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-center">{t('becomePerformerPage.howItWorks.title')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <FileCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t('becomePerformerPage.howItWorks.step1_title')}</h3>
                    <p className="text-muted-foreground">
                      {t('becomePerformerPage.howItWorks.step1_desc')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t('becomePerformerPage.howItWorks.step2_title')}</h3>
                    <p className="text-muted-foreground">
                      {t('becomePerformerPage.howItWorks.step2_desc')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t('becomePerformerPage.howItWorks.step3_title')}</h3>
                    <p className="text-muted-foreground">
                      {t('becomePerformerPage.howItWorks.step3_desc')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-center">{t('becomePerformerPage.testimonials.title')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&q=80" 
                          alt={t('becomePerformerPage.testimonials.andriy.name')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{t('becomePerformerPage.testimonials.andriy.name')}</h4>
                        <p className="text-sm text-muted-foreground">{t('becomePerformerPage.testimonials.andriy.role')}</p>
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
                      "{t('becomePerformerPage.testimonials.andriy.text')}"
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80" 
                          alt={t('becomePerformerPage.testimonials.maria.name')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{t('becomePerformerPage.testimonials.maria.name')}</h4>
                        <p className="text-sm text-muted-foreground">{t('becomePerformerPage.testimonials.maria.role')}</p>
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
                      "{t('becomePerformerPage.testimonials.maria.text')}"
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&q=80" 
                          alt={t('becomePerformerPage.testimonials.oleh.name')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{t('becomePerformerPage.testimonials.oleh.name')}</h4>
                        <p className="text-sm text-muted-foreground">{t('becomePerformerPage.testimonials.oleh.role')}</p>
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
                      "{t('becomePerformerPage.testimonials.oleh.text')}"
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('becomePerformerPage.faq.title')}</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t('becomePerformerPage.faq.q1')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('becomePerformerPage.faq.a1')}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t('becomePerformerPage.faq.q2')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('becomePerformerPage.faq.a2')}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t('becomePerformerPage.faq.q3')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('becomePerformerPage.faq.a3')}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t('becomePerformerPage.faq.q4')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('becomePerformerPage.faq.a4')}
                  </p>
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/faq/performer" className="text-primary hover:underline inline-flex items-center">
                    {t('becomePerformerPage.faq.viewAll')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">{t('becomePerformerPage.cta.title')}</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                {t('becomePerformerPage.cta.subtitle')}
              </p>
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {t('becomePerformerPage.cta.button')}
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}