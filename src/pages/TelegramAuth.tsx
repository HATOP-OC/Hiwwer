import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const TelegramAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const telegramId = searchParams.get('telegram_id');

    if (!telegramId) {
      setError('Відсутній Telegram ID');
      setTimeout(() => navigate('/register'), 2000);
      return;
    }

    // Перенаправляємо на реєстрацію з Telegram ID
    navigate(`/register?telegram_id=${telegramId}`);
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <p className="text-muted-foreground">Перенаправлення...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg">Підключення до Telegram...</p>
        <p className="text-muted-foreground mt-2">Зачекайте, будь ласка</p>
      </div>
    </div>
  );
};

export default TelegramAuth;
