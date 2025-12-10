import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Trash2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

const AssistantChat: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Ініціалізація sessionId з localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem('assistant_session_id');
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('assistant_session_id', newSessionId);
    }
  }, []);

  // Завантаження історії з БД при зміні sessionId
  useEffect(() => {
    if (!sessionId) return;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(`/v1/assistant/history/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [sessionId]);

  // Автоскрол до останнього повідомлення
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    let interval: any = null;
    if (cooldownUntil) {
      interval = setInterval(() => {
        const left = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
        setCooldownLeft(left);
        if (left <= 0) {
          setCooldownUntil(null);
          setCooldownLeft(0);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [cooldownUntil]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/v1/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue, sessionId }),
      });

      if (!response.ok) {
        // If we received rate limit info from server, show cooldown
        if (response.status === 429) {
          try {
            const data = await response.json();
            const retryAfter = data?.retryAfter || data?.retryAfterSec || 30;
            const until = Date.now() + (Number(retryAfter) * 1000);
            setCooldownUntil(until);
            setCooldownLeft(Math.ceil((until - Date.now()) / 1000));
            // Show feedback message
            setMessages(prev => [...prev, { sender: 'assistant', text: t('assistantChat.rateLimited', { seconds: retryAfter }) }]);
          } catch (err) {
            setMessages(prev => [...prev, { sender: 'assistant', text: t('assistantChat.connectionError') }]);
          }
          setIsLoading(false);
          return;
        }
        throw new Error('Failed to get a response from the assistant');
      }

      const data = await response.json();
      const assistantMessage: Message = { sender: 'assistant', text: data.reply };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { sender: 'assistant', text: t('assistantChat.connectionError') };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm(t('assistantChat.clearHistoryConfirmation'))) return;

    try {
      const response = await fetch(`/v1/assistant/history/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages([]);
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        localStorage.setItem('assistant_session_id', newSessionId);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full w-14 h-14">
          {isOpen ? <X /> : <MessageSquare />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-4 left-4 md:left-auto md:right-4 z-50">
          <Card className="w-full md:w-96 max-w-md mx-auto md:mx-0">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle>{t('assistantChat.title')}</CardTitle>
              {messages.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearHistory}
                  title={t('assistantChat.clearHistory')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {isLoadingHistory ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>{t('assistantChat.greeting')}</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="p-3 rounded-lg bg-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('assistantChat.placeholder')}
                  disabled={isLoading || !!cooldownUntil}
                />
                <Button type="submit" size="icon" disabled={isLoading || !!cooldownUntil}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default AssistantChat;