import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { OrderChatMessage, OrderChatTyping } from '@/types/websocket';
import { Message } from '@/types/models';
import { fetchMessages, sendMessage } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface OrderChatProps {
  orderId: string;
  participants: {
    client: { id: string; name: string; avatar?: string };
    performer?: { id: string; name: string; avatar?: string };
  };
}

export default function OrderChat({ orderId, participants }: OrderChatProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const webSocket = useWebSocket();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', orderId],
    queryFn: () => fetchMessages(orderId),
    refetchInterval: !webSocket.isConnected ? 5000 : false, // Fallback polling if WebSocket is not connected
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { content: string; attachments?: any[] }) => 
      sendMessage(orderId, data),
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['messages', orderId] });
    },
  });

  // WebSocket event handlers
  const handleNewMessage = useCallback((message: OrderChatMessage) => {
    if (message.orderId === orderId) {
      queryClient.setQueryData(['messages', orderId], (oldMessages: Message[] = []) => [
        ...oldMessages,
        {
          id: message.messageId,
          orderId: message.orderId,
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          attachments: message.attachments,
          read: false,
          createdAt: message.createdAt,
        }
      ]);
      
      // Mark messages as read if we're the receiver
      if (message.receiverId === user?.id) {
        webSocket.markOrderMessagesRead(orderId);
      }
    }
  }, [orderId, user?.id, queryClient, webSocket]);

  const handleTyping = useCallback((typing: OrderChatTyping) => {
    if (typing.orderId === orderId && typing.userId !== user?.id) {
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
  }, [orderId, user?.id]);

  // Set up WebSocket listeners
  useEffect(() => {
    if (webSocket.socket && webSocket.isConnected) {
      webSocket.joinOrderChat(orderId);
      webSocket.onOrderMessage(handleNewMessage);
      webSocket.onOrderTyping(handleTyping);

      return () => {
        webSocket.offOrderMessage(handleNewMessage);
        webSocket.offOrderTyping(handleTyping);
        webSocket.leaveOrderChat(orderId);
      };
    }
  }, [webSocket.socket, webSocket.isConnected, orderId, handleNewMessage, handleTyping]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      webSocket.setOrderTyping(orderId, true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      webSocket.setOrderTyping(orderId, false);
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    // Clear typing indicator
    if (isTyping) {
      setIsTyping(false);
      webSocket.setOrderTyping(orderId, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
    
    sendMessageMutation.mutate({
      content: messageText.trim(),
    });
  };

  const getMessageSender = (senderId: string) => {
    if (senderId === participants.client.id) return participants.client;
    if (senderId === participants.performer?.id) return participants.performer;
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Чат замовлення</CardTitle>
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
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
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
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={sender?.avatar} />
                      <AvatarFallback>
                        {sender?.name?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`space-y-1 ${isOwn ? 'text-right' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {sender?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), 'HH:mm', { locale: uk })}
                        </span>
                      </div>
                      
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Paperclip className="h-3 w-3" />
                                <a
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs underline hover:no-underline"
                                >
                                  Вкладення {index + 1}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
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
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Button type="button" variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Input
              value={messageText}
              onChange={handleInputChange}
              placeholder="Напишіть повідомлення..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            
            <Button 
              type="submit" 
              size="sm"
              disabled={!messageText.trim() || sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
