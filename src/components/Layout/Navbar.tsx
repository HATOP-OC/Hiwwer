import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, Moon, Search, Sun, X } from "lucide-react";
import NotificationMenu from '../NotificationMenu';
import LanguageSwitcher from '../LanguageSwitcher';
import RoleSwitcher from '../RoleSwitcher';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, activeRole, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/90 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-brand-blue">Hiwwer</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">
              {t('navbar.services')}
            </Link>
            {activeRole === 'performer' && (
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                {t('navbar.dashboard')}
              </Link>
            )}
            <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              {t('navbar.howItWorks')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="hidden md:flex"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="hidden md:flex">
            <LanguageSwitcher />
          </div>

          {user ? (
            <>
              <div className="hidden md:flex">
                <RoleSwitcher />
              </div>

              <Button asChild size="sm" className="hidden md:flex">
                <Link to="/services">{t('navbar.createOrder')}</Link>
              </Button>
              
              <NotificationMenu />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">{user.role}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">{t('navbar.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders">{t('navbar.myOrders')}</Link>
                  </DropdownMenuItem>
                  {activeRole === 'performer' && (
                    <DropdownMenuItem asChild>
                      <Link to="/my-services">{t('navbar.myServices')}</Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">{t('navbar.adminPanel')}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    {t('navbar.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">{t('navbar.login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/register">{t('navbar.signUp')}</Link>
              </Button>
            </div>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 space-y-4 bg-card border-t animate-fade-in">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/services" 
              className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navbar.services')}
            </Link>
            {activeRole === 'performer' && (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.dashboard')}
              </Link>
            )}
            <Link 
              to="/how-it-works" 
              className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navbar.howItWorks')}
            </Link>
          </div>
          
          <div className="flex justify-between items-center px-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {theme === 'dark' ? t('navbar.lightMode') : t('navbar.darkMode')}
            </Button>
            
            <LanguageSwitcher />
          </div>

          {user && (
            <div className="px-4">
              <RoleSwitcher />
            </div>
          )}

          {!user && (
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>{t('navbar.login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>{t('navbar.signUp')}</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}