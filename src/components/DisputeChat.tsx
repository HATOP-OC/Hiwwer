import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, AlertTriangle } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { DisputeChatMessage, DisputeChatTyping } from '@/types/websocket';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface DisputeMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface DisputeChatProps {
  disputeId: string;
  orderId: string;
  participants: {
    client: { id: string; name: string; avatar?: string };
    performer: { id: string; name: string; avatar?: string };
    moderator?: { id: string; name: string; avatar?: string };
  };
  initialMessages?: DisputeMessage[];
}

export default function DisputeChat({ 
  disputeId, 
  orderId, 
  participants, 
  initialMessages = [] 
}: DisputeChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DisputeMessage[]>(initialMessages);
  const [messageText, setMessageText] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const webSocket = useWebSocket();

  // WebSocket event handlers
  const handleNewMessage = useCallback((message: DisputeChatMessage) => {
    if (message.disputeId === disputeId) {
      setMessages(prev => [...prev, {
        id: message.messageId,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt,
      }]);
    }
  }, [disputeId]);

  const handleTyping = useCallback((typing: DisputeChatTyping) => {
    if (typing.disputeId === disputeId && typing.userId !== user?.id) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (typing.isTyping) {
          newSet.add(typing.userId);
        } else {
          newSet.delete(typing.userId);
        }
        return newSet;
      });
    }
  }, [disputeId, user?.id]);

  // Set up WebSocket listeners
  useEffect(() => {
    if (webSocket.socket && webSocket.isConnected) {
      webSocket.joinDisputeChat(disputeId);
      webSocket.onDisputeMessage(handleNewMessage);
      webSocket.onDisputeTyping(handleTyping);

      return () => {
        webSocket.offDisputeMessage(handleNewMessage);
        webSocket.offDisputeTyping(handleTyping);
        webSocket.leaveDisputeChat(disputeId);
      };
    }
  }, [webSocket, webSocket.socket, webSocket.isConnected, disputeId, handleNewMessage, handleTyping]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      webSocket.setDisputeTyping(disputeId, true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      webSocket.setDisputeTyping(disputeId, false);
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      // Clear typing indicator
      if (isTyping) {
        setIsTyping(false);
        webSocket.setDisputeTyping(disputeId, false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
      
      // Send via API
      const response = await fetch(`/v1/orders/${orderId}/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: messageText.trim() }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setMessageText('');
    } catch (error) {
      console.error('Error sending dispute message:', error);
      // TODO: Show error toast
    } finally {
      setIsSending(false);
    }
  };

  const getMessageSender = (senderId: string) => {
    if (senderId === participants.client.id) return participants.client;
    if (senderId === participants.performer.id) return participants.performer;
    if (senderId === participants.moderator?.id) return participants.moderator;
    return { id: senderId, name: 'Невідомий користувач' };
  };

  const getTypingUsersNames = () => {
    const names: string[] = [];
    typingUsers.forEach(userId => {
      const sender = getMessageSender(userId);
      if (sender) names.push(sender.name);
    });
    return names;
  };

  const getSenderRole = (senderId: string) => {
    if (senderId === participants.client.id) return 'Клієнт';
    if (senderId === participants.performer.id) return 'Виконавець';
    if (senderId === participants.moderator?.id) return 'Модератор';
    return 'Невідомий';
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Чат спору</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {webSocket.isConnected ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Онлайн
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Оффлайн
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages area */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => {
              const sender = getMessageSender(message.senderId);
              const isOwn = message.senderId === user?.id;
              const senderRole = getSenderRole(message.senderId);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={sender?.avatar} />
                      <AvatarFallback className={
                        senderRole === 'Модератор' ? 'bg-purple-100 text-purple-600' :
                        senderRole === 'Клієнт' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }>
                        {sender?.name?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`space-y-1 ${isOwn ? 'text-right' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {sender?.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {senderRole}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), 'HH:mm', { locale: uk })}
                        </span>
                      </div>
                      
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : senderRole === 'Модератор'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            {typingUsers.size > 0 && (
              <div className="flex justify-start">
                <div className="flex space-x-2 max-w-[70%]">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {getTypingUsersNames().join(', ')} друкує
                      </span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Message input */}
        <div className="border-t p-4">
          <div className="mb-2 text-xs text-muted-foreground bg-orange-50 text-orange-700 p-2 rounded">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Це чат спору. Усі повідомлення можуть бути розглянуті модератором.
          </div>
          
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Input
              value={messageText}
              onChange={handleInputChange}
              placeholder="Напишіть повідомлення..."
              className="flex-1"
              disabled={isSending}
            />
            
            <Button 
              type="submit" 
              size="sm"
              disabled={!messageText.trim() || isSending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
