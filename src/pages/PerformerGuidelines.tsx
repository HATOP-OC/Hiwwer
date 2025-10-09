import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { useTranslation } from 'react-i18next';

export default function PerformerGuidelines() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('performerGuidelinesPage.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('performerGuidelinesPage.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">{t('performerGuidelinesPage.tabs.general')}</TabsTrigger>
              <TabsTrigger value="quality">{t('performerGuidelinesPage.tabs.quality')}</TabsTrigger>
              <TabsTrigger value="communication">{t('performerGuidelinesPage.tabs.communication')}</TabsTrigger>
              <TabsTrigger value="payments">{t('performerGuidelinesPage.tabs.payments')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">{t('performerGuidelinesPage.general.title')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-blue-500" />
                        {t('performerGuidelinesPage.general.followRules_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.general.followRules_desc')}
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-950">
                        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300">{t('performerGuidelinesPage.general.mainRules_title')}</h4>
                        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                          {(t('performerGuidelinesPage.general.mainRules_items', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <XCircle className="mr-2 h-5 w-5 text-red-500" />
                        {t('performerGuidelinesPage.general.forbidden_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.general.forbidden_desc')}
                      </p>
                      <div className="bg-red-50 p-4 rounded-lg dark:bg-red-950">
                        <h4 className="font-medium mb-2 text-red-800 dark:text-red-300">{t('performerGuidelinesPage.general.forbidden_items_title')}</h4>
                        <ul className="space-y-2 text-sm text-red-700 dark:text-red-400">
                          {(t('performerGuidelinesPage.general.forbidden_items', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={index} className="flex items-start">
                              <XCircle className="h-4 w-4 mr-2 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                        {t('performerGuidelinesPage.general.violations_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.general.violations_desc')}
                      </p>
                      <div className="space-y-4">
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">{t('performerGuidelinesPage.general.violations.first')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('performerGuidelinesPage.general.violations.first_desc')}
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">{t('performerGuidelinesPage.general.violations.second')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('performerGuidelinesPage.general.violations.second_desc')}
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">{t('performerGuidelinesPage.general.violations.third')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('performerGuidelinesPage.general.violations.third_desc')}
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">{t('performerGuidelinesPage.general.violations.serious')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('performerGuidelinesPage.general.violations.serious_desc')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quality" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">{t('performerGuidelinesPage.quality.title')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Award className="mr-2 h-5 w-5 text-amber-500" />
                        {t('performerGuidelinesPage.quality.standards_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.quality.standards_desc')}
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{t('performerGuidelinesPage.quality.standards.professionalism')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('performerGuidelinesPage.quality.standards.professionalism_desc')}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{t('performerGuidelinesPage.quality.standards.accuracy')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('performerGuidelinesPage.quality.standards.accuracy_desc')}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{t('performerGuidelinesPage.quality.standards.uniqueness')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('performerGuidelinesPage.quality.standards.uniqueness_desc')}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{t('performerGuidelinesPage.quality.standards.completeness')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('performerGuidelinesPage.quality.standards.completeness_desc')}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-500" />
                        {t('performerGuidelinesPage.quality.description_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.quality.description_desc')}
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            {t('performerGuidelinesPage.quality.recommended_title')}
                          </h4>
                          <ul className="space-y-2 text-sm">
                            {(t('performerGuidelinesPage.quality.recommended_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-4 border rounded-lg border-red-200 dark:border-red-900">
                          <h4 className="font-medium mb-2 flex items-center text-red-600 dark:text-red-400">
                            <XCircle className="h-4 w-4 mr-2" />
                            {t('performerGuidelinesPage.quality.forbidden_title')}
                          </h4>
                          <ul className="space-y-2 text-sm text-red-600 dark:text-red-400">
                            {(t('performerGuidelinesPage.quality.forbidden_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-yellow-500" />
                        {t('performerGuidelinesPage.quality.rating_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.quality.rating_desc')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{t('performerGuidelinesPage.quality.howRatingWorks_title')}</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {(t('performerGuidelinesPage.quality.howRatingWorks_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{t('performerGuidelinesPage.quality.howToImproveRating_title')}</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {(t('performerGuidelinesPage.quality.howToImproveRating_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="communication" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">{t('performerGuidelinesPage.communication.title')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                        {t('performerGuidelinesPage.communication.principles_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.communication.principles_desc')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">{t('performerGuidelinesPage.communication.required_title')}</h4>
                          <ul className="space-y-3">
                            {(t('performerGuidelinesPage.communication.required_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">{t('performerGuidelinesPage.communication.forbidden_title')}</h4>
                          <ul className="space-y-3">
                            {(t('performerGuidelinesPage.communication.forbidden_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index} className="flex items-start">
                                <XCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-amber-500" />
                        {t('performerGuidelinesPage.communication.expectations_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.communication.expectations_desc')}
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-950">
                          <h4 className="font-medium mb-2">{t('performerGuidelinesPage.communication.recommendations_title')}</h4>
                          <ul className="space-y-2 text-sm">
                            {(t('performerGuidelinesPage.communication.recommendations_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index} className="flex items-start">
                                <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-green-500" />
                        {t('performerGuidelinesPage.communication.conflict_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.communication.conflict_desc')}
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{t('performerGuidelinesPage.communication.conflict_steps_title')}</h4>
                          <ol className="space-y-2 text-sm list-decimal pl-5">
                            {(t('performerGuidelinesPage.communication.conflict_steps', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">{t('performerGuidelinesPage.payments.title')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                        {t('performerGuidelinesPage.payments.system_title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.payments.system_desc')}
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{t('performerGuidelinesPage.payments.howItWorks_title')}</h4>
                          <ol className="space-y-3 text-sm list-decimal pl-5">
                            {(t('performerGuidelinesPage.payments.howItWorks_steps', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">{t('performerGuidelinesPage.payments.fees_title')}</h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.payments.fees_desc')}
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-950">
                          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300">{t('performerGuidelinesPage.payments.feeStructure_title')}</h4>
                          <div className="space-y-3 text-blue-700 dark:text-blue-400">
                            <div className="flex justify-between items-center">
                              <span>{t('performerGuidelinesPage.payments.fees.standard')}</span>
                              <span className="font-medium">15%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>{t('performerGuidelinesPage.payments.fees.pro')}</span>
                              <span className="font-medium">12%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>{t('performerGuidelinesPage.payments.fees.top')}</span>
                              <span className="font-medium">10%</span>
                            </div>
                            <div className="text-xs mt-3">
                              {t('performerGuidelinesPage.payments.fee_note')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{t('performerGuidelinesPage.payments.calculation_example_title')}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {t('performerGuidelinesPage.payments.calculation_example_desc')}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>{t('performerGuidelinesPage.payments.calculation.orderAmount')}</span>
                              <span className="font-medium">$100.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('performerGuidelinesPage.payments.calculation.platformFee')}</span>
                              <span className="font-medium">$15.00</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span>{t('performerGuidelinesPage.payments.calculation.youReceive')}</span>
                              <span className="font-medium">$85.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">{t('performerGuidelinesPage.payments.withdrawal_title')}</h3>
                      <p className="text-muted-foreground mb-4">
                        {t('performerGuidelinesPage.payments.withdrawal_desc')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{t('performerGuidelinesPage.payments.withdrawalMethods_title')}</h4>
                          <ul className="space-y-2 text-sm">
                            {(t('performerGuidelinesPage.payments.withdrawalMethods_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{t('performerGuidelinesPage.payments.withdrawalTerms_title')}</h4>
                          <ul className="space-y-2 text-sm">
                            {(t('performerGuidelinesPage.payments.withdrawalTerms_items', { returnObjects: true }) as string[]).map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
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

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('performerGuidelinesPage.faqTitle')}</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t('performerGuidelinesPage.faq.q1')}</AccordionTrigger>
              <AccordionContent>
                {t('performerGuidelinesPage.faq.a1')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>{t('performerGuidelinesPage.faq.q2')}</AccordionTrigger>
              <AccordionContent>
                {t('performerGuidelinesPage.faq.a2')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>{t('performerGuidelinesPage.faq.q3')}</AccordionTrigger>
              <AccordionContent>
                {t('performerGuidelinesPage.faq.a3')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>{t('performerGuidelinesPage.faq.q4')}</AccordionTrigger>
              <AccordionContent>
                {t('performerGuidelinesPage.faq.a4')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>{t('performerGuidelinesPage.faq.q5')}</AccordionTrigger>
              <AccordionContent>
                {t('performerGuidelinesPage.faq.a5')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('performerGuidelinesPage.resources.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/faq/performer" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  {t('performerGuidelinesPage.resources.faq')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('performerGuidelinesPage.resources.faq_desc')}
                </p>
              </div>
            </Link>
            
            <Link to="/terms-of-service" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  {t('performerGuidelinesPage.resources.terms')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('performerGuidelinesPage.resources.terms_desc')}
                </p>
              </div>
            </Link>
            
            <Link to="/contact-us" className="block">
              <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all h-full">
                <h3 className="font-semibold mb-2 flex items-center">
                  {t('performerGuidelinesPage.resources.contact')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('performerGuidelinesPage.resources.contact_desc')}
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('performerGuidelinesPage.ctaTitle')}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t('performerGuidelinesPage.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/become-performer">{t('performerGuidelinesPage.ctaButton')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/faq/performer">{t('performerGuidelinesPage.ctaButtonSecondary')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}