import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Check } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function RoleSwitcher() {
  const { t } = useTranslation();
  const { user, activeRole, switchRole } = useAuth();

  console.log('RoleSwitcher render - activeRole:', activeRole, 'user.isPerformer:', user?.isPerformer);

  // Показуємо перемикач тільки для користувачів, які активували режим виконавця
  if (!user || user.role === 'admin' || !user.isPerformer) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {activeRole === 'performer' ? (
            <>
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">{t('roleSwitcher.performer')}</span>
            </>
          ) : (
            <>
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('roleSwitcher.client')}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t('roleSwitcher.switchMode')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => switchRole('client')}
          className="cursor-pointer"
        >
          <User className="h-4 w-4 mr-2" />
          {t('roleSwitcher.client')}
          {activeRole === 'client' && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => switchRole('performer')}
          className="cursor-pointer"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          {t('roleSwitcher.performer')}
          {activeRole === 'performer' && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
