import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Search, MessageSquare, CreditCard, Package, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HowToOrder() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('howToOrderPage.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('howToOrderPage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold">1</div>
            <CardContent className="pt-8 pb-6 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">{t('howToOrderPage.steps.step1_title')}</h3>
              <p className="text-muted-foreground">
                {t('howToOrderPage.steps.step1_desc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold">2</div>
            <CardContent className="pt-8 pb-6 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">{t('howToOrderPage.steps.step2_title')}</h3>
              <p className="text-muted-foreground">
                {t('howToOrderPage.steps.step2_desc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold">3</div>
            <CardContent className="pt-8 pb-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">{t('howToOrderPage.steps.step3_title')}</h3>
              <p className="text-muted-foreground">
                {t('howToOrderPage.steps.step3_desc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center text-lg font-bold">4</div>
            <CardContent className="pt-8 pb-6 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">{t('howToOrderPage.steps.step4_title')}</h3>
              <p className="text-muted-foreground">
                {t('howToOrderPage.steps.step4_desc')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('howToOrderPage.detailedInstruction')}</h2>
          
          <Tabs defaultValue="find">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="find">{t('howToOrderPage.tabs.find')}</TabsTrigger>
              <TabsTrigger value="discuss">{t('howToOrderPage.tabs.discuss')}</TabsTrigger>
              <TabsTrigger value="payment">{t('howToOrderPage.tabs.payment')}</TabsTrigger>
              <TabsTrigger value="delivery">{t('howToOrderPage.tabs.delivery')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="find" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">{t('howToOrderPage.findTab.title')}</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.findTab.step1_title')}</h4>
                        <p className="text-muted-foreground mb-2">
                          {t('howToOrderPage.findTab.step1_desc')}
                        </p>
                        <Button variant="outline" asChild>
                          <Link to="/services">{t('howToOrderPage.findTab.step1_button')}</Link>
                        </Button>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.findTab.step2_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.findTab.step2_desc')}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.findTab.step3_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.findTab.step3_desc')}
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
                  <h3 className="text-xl font-semibold mb-4">{t('howToOrderPage.discussTab.title')}</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.discussTab.step1_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.discussTab.step1_desc')}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.discussTab.step2_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.discussTab.step2_desc')}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.discussTab.step3_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.discussTab.step3_desc')}
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
                  <h3 className="text-xl font-semibold mb-4">{t('howToOrderPage.paymentTab.title')}</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.paymentTab.step1_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.paymentTab.step1_desc')}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.paymentTab.step2_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.paymentTab.step2_desc')}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.paymentTab.step3_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.paymentTab.step3_desc')}
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
                  <h3 className="text-xl font-semibold mb-4">{t('howToOrderPage.deliveryTab.title')}</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.deliveryTab.step1_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.deliveryTab.step1_desc')}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.deliveryTab.step2_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.deliveryTab.step2_desc')}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{t('howToOrderPage.deliveryTab.step3_title')}</h4>
                        <p className="text-muted-foreground">
                          {t('howToOrderPage.deliveryTab.step3_desc')}
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('howToOrderPage.benefitsTitle')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('howToOrderPage.benefits.securePayments_title')}</h3>
                <p className="text-muted-foreground">
                  {t('howToOrderPage.benefits.securePayments_desc')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Star className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('howToOrderPage.benefits.verifiedPerformers_title')}</h3>
                <p className="text-muted-foreground">
                  {t('howToOrderPage.benefits.verifiedPerformers_desc')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <MessageSquare className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('howToOrderPage.benefits.telegramIntegration_title')}</h3>
                <p className="text-muted-foreground">
                  {t('howToOrderPage.benefits.telegramIntegration_desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('howToOrderPage.faqTitle')}</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t('howToOrderPage.faq.q1')}</AccordionTrigger>
              <AccordionContent>
                {t('howToOrderPage.faq.a1')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>{t('howToOrderPage.faq.q2')}</AccordionTrigger>
              <AccordionContent>
                {t('howToOrderPage.faq.a2')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>{t('howToOrderPage.faq.q3')}</AccordionTrigger>
              <AccordionContent>
                {t('howToOrderPage.faq.a3')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>{t('howToOrderPage.faq.q4')}</AccordionTrigger>
              <AccordionContent>
                {t('howToOrderPage.faq.a4')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>{t('howToOrderPage.faq.q5')}</AccordionTrigger>
              <AccordionContent>
                {t('howToOrderPage.faq.a5')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('howToOrderPage.ctaTitle')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('howToOrderPage.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/services">{t('howToOrderPage.ctaButton')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/faq/client">{t('howToOrderPage.ctaButtonSecondary')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}