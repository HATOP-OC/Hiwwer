
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card shadow-inner py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">DigiHub</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop platform for digital services with seamless Telegram integration.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-sm hover:text-primary transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link to="/how-to-order" className="text-sm hover:text-primary transition-colors">
                  How to Order
                </Link>
              </li>
              <li>
                <Link to="/faq/client" className="text-sm hover:text-primary transition-colors">
                  Client FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Performers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-performer" className="text-sm hover:text-primary transition-colors">
                  Become a Performer
                </Link>
              </li>
              <li>
                <Link to="/performer-guidelines" className="text-sm hover:text-primary transition-colors">
                  Performer Guidelines
                </Link>
              </li>
              <li>
                <Link to="/faq/performer" className="text-sm hover:text-primary transition-colors">
                  Performer FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-service" className="text-sm hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-sm hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row gap-4 justify-between">
          <p className="text-sm text-muted-foreground">
            © {currentYear} DigiHub. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Facebook
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Instagram
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Telegram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
