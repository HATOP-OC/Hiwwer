import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card shadow-inner py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Hiwwer</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.forClients')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-sm hover:text-primary transition-colors">
                  {t('footer.browseServices')}
                </Link>
              </li>
              <li>
                <Link to="/how-to-order" className="text-sm hover:text-primary transition-colors">
                  {t('footer.howToOrder')}
                </Link>
              </li>
              <li>
                <Link to="/faq/client" className="text-sm hover:text-primary transition-colors">
                  {t('footer.clientFAQ')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.forPerformers')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-performer" className="text-sm hover:text-primary transition-colors">
                  {t('footer.becomeAPerformer')}
                </Link>
              </li>
              <li>
                <Link to="/performer-guidelines" className="text-sm hover:text-primary transition-colors">
                  {t('footer.performerGuidelines')}
                </Link>
              </li>
              <li>
                <Link to="/faq/performer" className="text-sm hover:text-primary transition-colors">
                  {t('footer.performerFAQ')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-service" className="text-sm hover:text-primary transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm hover:text-primary transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-sm hover:text-primary transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row gap-4 justify-between">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright', { year: currentYear })}
          </p>
          
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('footer.twitter')}
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('footer.facebook')}
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('footer.instagram')}
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('footer.telegram')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}