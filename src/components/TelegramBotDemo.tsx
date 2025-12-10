import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

type MessageType = 'bot' | 'user';

interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: string;
  isTyping?: boolean;
}

interface MenuButton {
  id: string;
  text: string;
  icon: string;
  action: string;
}

type Screen = 'main' | 'assistant' | 'orders' | 'messages' | 'about' | 'commands';

export default function TelegramBotDemo() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const addMessage = (type: MessageType, text: string, delay = 0) => {
    setTimeout(() => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        type,
        text,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, newMessage]);
    }, delay);
  };

  const showTypingIndicator = (duration = 1000) => {
    setIsTyping(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        resolve(true);
      }, duration);
    });
  };

  const handleStart = async () => {
    if (hasStarted) return;
    setHasStarted(true);
    setMessages([]);
    
    addMessage('user', '/start', 0);
    await showTypingIndicator(1500);
    addMessage('bot', t('telegramDemo.welcome'), 100);
    await new Promise(resolve => setTimeout(resolve, 1600));
    await showTypingIndicator(1000);
    addMessage('bot', t('telegramDemo.helpText'), 100);
  };

  const handleMainMenu = async () => {
    setCurrentScreen('main');
    await showTypingIndicator(800);
    addMessage('bot', t('telegramDemo.mainMenuPrompt'), 100);
  };

  const handleAssistant = async () => {
    setCurrentScreen('assistant');
    addMessage('user', t('telegramDemo.buttons.assistant'), 0);
    await showTypingIndicator(1500);
    addMessage('bot', t('telegramDemo.assistant.intro'), 100);
    await new Promise(resolve => setTimeout(resolve, 1600));
    await showTypingIndicator(1200);
    addMessage('bot', t('telegramDemo.assistant.capabilities'), 100);
  };

  const handleAssistantQuestion = async (question: string) => {
    addMessage('user', question, 0);
    await showTypingIndicator(2000);
    
    // Match based on the translated question keys for better maintainability
    const q1 = t('telegramDemo.assistant.questions.q1');
    const q2 = t('telegramDemo.assistant.questions.q2');
    const q3 = t('telegramDemo.assistant.questions.q3');
    
    if (question.includes(q1) || question === q1) {
      addMessage('bot', t('telegramDemo.assistant.answers.a1'), 100);
    } else if (question.includes(q2) || question === q2) {
      addMessage('bot', t('telegramDemo.assistant.answers.a2'), 100);
    } else if (question.includes(q3) || question === q3) {
      addMessage('bot', t('telegramDemo.assistant.answers.a3'), 100);
    } else {
      addMessage('bot', t('telegramDemo.assistant.defaultAnswer'), 100);
    }
  };

  const handleOrders = async () => {
    setCurrentScreen('orders');
    addMessage('user', t('telegramDemo.buttons.orders'), 0);
    await showTypingIndicator(1000);
    addMessage('bot', t('telegramDemo.orders.checking'), 100);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await showTypingIndicator(1200);
    addMessage('bot', t('telegramDemo.orders.noActive'), 100);
    await new Promise(resolve => setTimeout(resolve, 1400));
    await showTypingIndicator(800);
    addMessage('bot', t('telegramDemo.orders.requestId'), 100);
  };

  const handleNotificationId = async (id: string) => {
    addMessage('user', id, 0);
    await showTypingIndicator(1500);
    addMessage('bot', t('telegramDemo.orders.processing'), 100);
    await new Promise(resolve => setTimeout(resolve, 1700));
    await showTypingIndicator(1000);
    addMessage('bot', t('telegramDemo.orders.success'), 100);
  };

  const handleMessages = async () => {
    setCurrentScreen('messages');
    addMessage('user', t('telegramDemo.buttons.messages'), 0);
    await showTypingIndicator(1000);
    addMessage('bot', t('telegramDemo.messages.noNew'), 100);
  };

  const handleAbout = async () => {
    setCurrentScreen('about');
    addMessage('user', t('telegramDemo.buttons.about'), 0);
    await showTypingIndicator(1200);
    addMessage('bot', t('telegramDemo.about.description'), 100);
  };

  const handleCommands = async () => {
    setCurrentScreen('commands');
    addMessage('user', t('telegramDemo.buttons.commands'), 0);
    await showTypingIndicator(800);
    addMessage('bot', t('telegramDemo.commands.list'), 100);
  };

  const handleLanguageChange = async (lang: string) => {
    i18n.changeLanguage(lang);
    addMessage('user', `🌐 ${t('telegramDemo.buttons.language')}`, 0);
    await showTypingIndicator(800);
    addMessage('bot', t('telegramDemo.language.changed'), 100);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const message = inputValue.trim();
    setInputValue('');

    if (currentScreen === 'assistant') {
      await handleAssistantQuestion(message);
    } else if (currentScreen === 'orders' && !isNaN(Number(message))) {
      await handleNotificationId(message);
    } else {
      addMessage('user', message, 0);
      await showTypingIndicator(1000);
      addMessage('bot', t('telegramDemo.defaultResponse'), 100);
    }
  };

  const mainMenuButtons: MenuButton[] = [
    { id: 'marketplace', text: t('telegramDemo.buttons.marketplace'), icon: '🛍', action: 'marketplace' },
    { id: 'orders', text: t('telegramDemo.buttons.orders'), icon: '📦', action: 'orders' },
    { id: 'messages', text: t('telegramDemo.buttons.messages'), icon: '💬', action: 'messages' },
    { id: 'assistant', text: t('telegramDemo.buttons.assistant'), icon: '🤖', action: 'assistant' },
    { id: 'commands', text: t('telegramDemo.buttons.commands'), icon: '📋', action: 'commands' },
    { id: 'language', text: t('telegramDemo.buttons.language'), icon: '🌐', action: 'language' },
    { id: 'about', text: t('telegramDemo.buttons.about'), icon: 'ℹ️', action: 'about' },
  ];

  const languageButtons = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const assistantQuestions = [
    t('telegramDemo.assistant.questions.q1'),
    t('telegramDemo.assistant.questions.q2'),
    t('telegramDemo.assistant.questions.q3'),
  ];

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'assistant':
        handleAssistant();
        break;
      case 'orders':
        handleOrders();
        break;
      case 'messages':
        handleMessages();
        break;
      case 'about':
        handleAbout();
        break;
      case 'commands':
        handleCommands();
        break;
      case 'marketplace':
        addMessage('user', t('telegramDemo.buttons.marketplace'), 0);
        showTypingIndicator(1000).then(() => {
          addMessage('bot', t('telegramDemo.marketplace.info'), 100);
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Telegram Window */}
      <div className="bg-[#0e1621] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="bg-[#17212b] px-4 py-3 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-lg">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <div className="font-semibold text-white">Hiwwer Bot</div>
              <div className="text-xs text-gray-400">{t('telegramDemo.status.online')}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={chatContainerRef}
          className="bg-[#0e1621] h-[500px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {!hasStarted ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-xl">
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hiwwer Bot</h3>
              <p className="text-gray-400 mb-6">{t('telegramDemo.startPrompt')}</p>
              <Button
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {t('telegramDemo.startButton')}
              </Button>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col animate-slide-in ${
                    message.type === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-md ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-[#182533] text-white rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.text}</div>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500 px-2">
                    <span>{message.timestamp}</span>
                    {message.type === 'user' && (
                      <span className="ml-1 text-blue-400">✓✓</span>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start animate-slide-in">
                  <div className="bg-[#182533] rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Buttons */}
              {hasStarted && currentScreen === 'main' && messages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4 animate-fade-in">
                  {mainMenuButtons.map((button) => (
                    <button
                      key={button.id}
                      onClick={() => handleButtonClick(button.action)}
                      className="bg-[#182533] hover:bg-[#1f2e3f] text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-start shadow-md hover:shadow-lg"
                    >
                      <span className="text-xl mr-2">{button.icon}</span>
                      <span className="text-sm font-medium">{button.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Assistant Question Buttons */}
              {currentScreen === 'assistant' && (
                <div className="space-y-2 mt-4 animate-fade-in">
                  {assistantQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleAssistantQuestion(question)}
                      className="w-full bg-[#182533] hover:bg-[#1f2e3f] text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm text-left shadow-md hover:shadow-lg"
                    >
                      {question}
                    </button>
                  ))}
                  <button
                    onClick={handleMainMenu}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    ⬅️ {t('telegramDemo.backToMenu')}
                  </button>
                </div>
              )}

              {/* Language Selection */}
              {currentScreen === 'main' && messages.some(m => m.text.includes(t('telegramDemo.buttons.language'))) && (
                <div className="space-y-2 mt-4 animate-fade-in">
                  {languageButtons.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full bg-[#182533] hover:bg-[#1f2e3f] text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm flex items-center shadow-md hover:shadow-lg ${
                        i18n.language === lang.code ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <span className="text-xl mr-3">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {i18n.language === lang.code && (
                        <span className="ml-auto text-blue-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Back to Menu for other screens */}
              {currentScreen !== 'main' && currentScreen !== 'assistant' && (
                <div className="mt-4 animate-fade-in">
                  <button
                    onClick={handleMainMenu}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    ⬅️ {t('telegramDemo.backToMenu')}
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        {hasStarted && (
          <div className="bg-[#17212b] px-4 py-3 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-white transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <Input
                type="text"
                placeholder={t('telegramDemo.inputPlaceholder')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-[#0e1621] border-gray-700 text-white placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
