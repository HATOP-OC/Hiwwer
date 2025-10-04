import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, Link, Copy } from 'lucide-react';

const API_BASE = '/v1';

export default function TelegramIntegration() {
  const { user, fetchUser } = useAuth();
  const [linkingCode, setLinkingCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLinked, setIsLinked] = useState(!!user?.telegramId);

  useEffect(() => {
    setIsLinked(!!user?.telegramId);
  }, [user]);

  const generateLinkCode = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/auth/generate-telegram-link-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to generate code');
      }

      const { code } = await res.json();
      setLinkingCode(code);
      toast.success('Linking code generated. It will expire in 10 minutes.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (linkingCode) {
      navigator.clipboard.writeText(linkingCode);
      toast.success('Code copied to clipboard!');
    }
  };

  const handleRefresh = async () => {
    await fetchUser();
    toast.info("Profile data refreshed.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link className="h-5 w-5" />
          <span>Telegram Integration</span>
        </CardTitle>
        <CardDescription>
          Link your Telegram account to receive notifications and manage orders on the go.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLinked ? (
          <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-md border border-green-200">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Your account is linked to Telegram.</p>
              <p className="text-sm text-green-700">You can now use the bot's features.</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              To link your account, generate a code and send it to the Hiwwer bot on Telegram.
            </p>
            {linkingCode ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-muted rounded-md font-mono text-lg tracking-widest flex-grow">
                  {linkingCode}
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={generateLinkCode} disabled={isLoading} className="w-full">
                {isLoading ? 'Generating...' : 'Generate Linking Code'}
              </Button>
            )}
          </div>
        )}
         <Button variant="outline" onClick={handleRefresh} className="w-full mt-2">
            Refresh Status
        </Button>
      </CardContent>
    </Card>
  );
}