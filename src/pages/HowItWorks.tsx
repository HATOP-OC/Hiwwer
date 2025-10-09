import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ShoppingCart, 
  MessageSquare, 
  CheckCircle, 
  Users, 
  Shield, 
  Clock, 
  Star,
  ArrowRight,
  Play,
  FileText,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);

  const clientSteps = [
    {
      id: 1,
      title: t('howItWorksPage.clientSteps.step1_title'),
      description: t('howItWorksPage.clientSteps.step1_desc'),
      icon: <Search className="h-8 w-8" />,
      details: t('howItWorksPage.clientSteps.step1_details', { returnObjects: true }) as string[]
    },
    {
      id: 2,
      title: t('howItWorksPage.clientSteps.step2_title'),
      description: t('howItWorksPage.clientSteps.step2_desc'),
      icon: <Users className="h-8 w-8" />,
      details: t('howItWorksPage.clientSteps.step2_details', { returnObjects: true }) as string[]
    },
    {
      id: 3,
      title: t('howItWorksPage.clientSteps.step3_title'),
      description: t('howItWorksPage.clientSteps.step3_desc'),
      icon: <ShoppingCart className="h-8 w-8" />,
      details: t('howItWorksPage.clientSteps.step3_details', { returnObjects: true }) as string[]
    },
    {
      id: 4,
      title: t('howItWorksPage.clientSteps.step4_title'),
      description: t('howItWorksPage.clientSteps.step4_desc'),
      icon: <MessageSquare className="h-8 w-8" />,
      details: t('howItWorksPage.clientSteps.step4_details', { returnObjects: true }) as string[]
    },
    {
      id: 5,
      title: t('howItWorksPage.clientSteps.step5_title'),
      description: t('howItWorksPage.clientSteps.step5_desc'),
      icon: <CheckCircle className="h-8 w-8" />,
      details: t('howItWorksPage.clientSteps.step5_details', { returnObjects: true }) as string[]
    }
  ];

  const performerSteps = [
    {
      id: 1,
      title: t('howItWorksPage.performerSteps.step1_title'),
      description: t('howItWorksPage.performerSteps.step1_desc'),
      icon: <FileText className="h-8 w-8" />,
      details: t('howItWorksPage.performerSteps.step1_details', { returnObjects: true }) as string[]
    },
    {
      id: 2,
      title: t('howItWorksPage.performerSteps.step2_title'),
      description: t('howItWorksPage.performerSteps.step2_desc'),
      icon: <Star className="h-8 w-8" />,
      details: t('howItWorksPage.performerSteps.step2_details', { returnObjects: true }) as string[]
    },
    {
      id: 3,
      title: t('howItWorksPage.performerSteps.step3_title'),
      description: t('howItWorksPage.performerSteps.step3_desc'),
      icon: <Smartphone className="h-8 w-8" />,
      details: t('howItWorksPage.performerSteps.step3_details', { returnObjects: true }) as string[]
    },
    {
      id: 4,
      title: t('howItWorksPage.performerSteps.step4_title'),
      description: t('howItWorksPage.performerSteps.step4_desc'),
      icon: <Clock className="h-8 w-8" />,
      details: t('howItWorksPage.performerSteps.step4_details', { returnObjects: true }) as string[]
    },
    {
      id: 5,
      title: t('howItWorksPage.performerSteps.step5_title'),
      description: t('howItWorksPage.performerSteps.step5_desc'),
      icon: <CreditCard className="h-8 w-8" />,
      details: t('howItWorksPage.performerSteps.step5_details', { returnObjects: true }) as string[]
    }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: t('howItWorksPage.features.securePayments_title'),
      description: t('howItWorksPage.features.securePayments_desc')
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      title: t('howItWorksPage.features.telegramIntegration_title'),
      description: t('howItWorksPage.features.telegramIntegration_desc')
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: t('howItWorksPage.features.fastExecution_title'),
      description: t('howItWorksPage.features.fastExecution_desc')
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: t('howItWorksPage.features.qualityGuarantee_title'),
      description: t('howItWorksPage.features.qualityGuarantee_desc')
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <section className="py-16 bg-gradient-to-r from-brand-blue to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('howItWorksPage.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              {t('howItWorksPage.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/services">
                  <Play className="mr-2 h-5 w-5" />
                  {t('howItWorksPage.startAsClient')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/become-performer">
                  {t('howItWorksPage.becomePerformer')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="client" className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorksPage.processTitle')}</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {t('howItWorksPage.processSubtitle')}
                </p>
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="client">{t('howItWorksPage.forClients')}</TabsTrigger>
                  <TabsTrigger value="performer">{t('howItWorksPage.forPerformers')}</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="client">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {clientSteps.map((step, index) => (
                    <Card 
                      key={step.id} 
                      className={`relative transition-all duration-300 cursor-pointer ${
                        activeStep === step.id ? 'ring-2 ring-brand-blue shadow-lg' : 'hover:shadow-md'
                      }`}
                      onClick={() => setActiveStep(step.id)}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 p-3 bg-brand-blue/10 rounded-full text-brand-blue">
                          {step.icon}
                        </div>
                        <Badge variant="secondary" className="mx-auto mb-2">
                          {t('howItWorksPage.step')} {step.id}
                        </Badge>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {step.description}
                        </p>
                        {activeStep === step.id && (
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                      {index < clientSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performer">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {performerSteps.map((step, index) => (
                    <Card 
                      key={step.id} 
                      className={`relative transition-all duration-300 cursor-pointer ${
                        activeStep === step.id ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'
                      }`}
                      onClick={() => setActiveStep(step.id)}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 p-3 bg-purple-500/10 rounded-full text-purple-500">
                          {step.icon}
                        </div>
                        <Badge variant="secondary" className="mx-auto mb-2">
                          {t('howItWorksPage.step')} {step.id}
                        </Badge>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {step.description}
                        </p>
                        {activeStep === step.id && (
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                      {index < performerSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('howItWorksPage.featuresTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-brand-blue to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('howItWorksPage.ctaTitle')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {t('howItWorksPage.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/services">
                  {t('howItWorksPage.findService')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/become-performer">
                  {t('howItWorksPage.becomePerformer')}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HowItWorks;