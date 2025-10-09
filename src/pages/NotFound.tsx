import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout/Layout";
import { Search, Home, ArrowLeft, HelpCircle, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const popularPages = [
    { title: t('notFound.popularPages.services.title'), path: "/services", icon: "🔍", description: t('notFound.popularPages.services.description') },
    { title: t('notFound.popularPages.becomePerformer.title'), path: "/become-performer", icon: "💼", description: t('notFound.popularPages.becomePerformer.description') },
    { title: t('notFound.popularPages.howToOrder.title'), path: "/how-to-order", icon: "📋", description: t('notFound.popularPages.howToOrder.description') },
    { title: t('notFound.popularPages.contactUs.title'), path: "/contact-us", icon: "📞", description: t('notFound.popularPages.contactUs.description') }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-16 px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text leading-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-brand-blue/20 to-purple-600/20 rounded-full blur-xl"></div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('notFound.title')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('notFound.description', { pathname: location.pathname })}
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-md mx-auto mb-12">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t('notFound.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="px-6">
                {t('notFound.searchButton')}
              </Button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                {t('notFound.homeButton')}
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="gap-2">
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
                {t('notFound.backButton')}
              </button>
            </Button>
            <Button variant="outline" asChild size="lg" className="gap-2">
              <Link to="/services">
                <Compass className="h-4 w-4" />
                {t('notFound.browseServicesButton')}
              </Link>
            </Button>
          </div>

          {/* Popular Pages */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              {t('notFound.popularPages.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPages.map((page) => (
                <Card key={page.path} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">{page.icon}</div>
                    <h4 className="font-semibold mb-2 group-hover:text-brand-blue transition-colors">
                      {page.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {page.description}
                    </p>
                    <Button variant="outline" asChild size="sm" className="w-full">
                      <Link to={page.path}>{t('notFound.popularPages.goButton')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center mt-16">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <HelpCircle className="h-12 w-12 text-brand-blue mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">{t('notFound.help.title')}</h4>
              <p className="text-muted-foreground mb-4">
                {t('notFound.help.description')}
              </p>
              <Button variant="outline" asChild>
                <Link to="/contact-us">{t('notFound.help.button')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;