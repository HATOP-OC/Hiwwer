import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarSrc } from '@/lib/utils';
import { Send, AlertTriangle, Paperclip, X, Download, FileText, FileImage, FileVideo, FileAudio, FileArchive, FileCode } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { DisputeChatMessage, DisputeChatTyping } from '@/types/websocket';
import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { validateFile, getAcceptString } from '@/lib/fileTypes';
import FilePreview from '@/components/FilePreview';
import { useTranslation } from 'react-i18next';

interface DisputeMessage {
  id: string;
  senderId: string;
  content: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>;
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
  canResolve?: boolean; // Whether current user can resolve the dispute
  disputeStatus?: string;
  userRole?: 'client' | 'performer' | 'admin'; // Add user role
  onDisputeResolve?: () => void;
}

export default function DisputeChat({ 
  disputeId, 
  orderId, 
  participants, 
  initialMessages = [],
  canResolve = false,
  disputeStatus = 'open',
  userRole = 'client',
  onDisputeResolve
}: DisputeChatProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<DisputeMessage[]>(initialMessages);
  const [messageText, setMessageText] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isResolvingDispute, setIsResolvingDispute] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const webSocket = useWebSocket();

  // Load messages on component mount
  useEffect(() => {
    const loadMessages = async () => {
      if (initialMessages.length > 0) return; // Don't reload if we already have messages
      
      setIsLoading(true);
      try {
        const response = await fetch(`/v1/orders/${orderId}/disputes/${disputeId}/messages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const fetchedMessages = await response.json();
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error('Error loading dispute messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [disputeId, orderId, initialMessages.length]);

  // WebSocket event handlers
  const handleNewMessage = useCallback((message: DisputeChatMessage) => {
    if (message.disputeId === disputeId) {
      setMessages(prev => [...prev, {
        id: message.messageId,
        senderId: message.senderId,
        content: message.content,
        attachments: message.attachments || [],
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
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      // Alternative: scroll the ScrollArea viewport
      const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    };
    
    // Small delay to ensure DOM is updated
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    
    for (const file of files) {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        console.error(`File ${file.name} validation failed:`, validation.error);
        // TODO: Show error toast
      }
    }
    
    setAttachments(prev => [...prev, ...validFiles]);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleResolveDispute = async () => {
    if (!canResolve || isResolvingDispute) return;
    
    setIsResolvingDispute(true);
    
    try {
      const response = await fetch(`/v1/orders/${orderId}/disputes/${disputeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: 'resolved' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to resolve dispute');
      }
      
      if (onDisputeResolve) {
        onDisputeResolve();
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
      // TODO: Show error toast
    } finally {
      setIsResolvingDispute(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!messageText.trim() && attachments.length === 0) || isSending) return;
    
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
      
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('content', messageText.trim());
      
      // Add attachments
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
      
      // Send via API
      const response = await fetch(`/v1/orders/${orderId}/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await response.json();
      
      // Add message to local state immediately
      setMessages(prev => [...prev, {
        id: newMessage.id,
        senderId: newMessage.senderId,
        content: newMessage.content,
        attachments: newMessage.attachments || [],
        createdAt: newMessage.createdAt
      }]);
      
      setMessageText('');
      setAttachments([]);
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
    return { id: senderId, name: t('disputeChat.unknownUser') };
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
    if (senderId === participants.client.id) return t('disputeChat.roles.client');
    if (senderId === participants.performer.id) return t('disputeChat.roles.performer');
    if (senderId === participants.moderator?.id) return t('disputeChat.roles.moderator');
    return t('disputeChat.roles.unknown');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">{t('disputeChat.title')}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {canResolve && disputeStatus !== 'resolved' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleResolveDispute}
                disabled={isResolvingDispute}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                {isResolvingDispute 
                  ? (userRole === 'admin' ? t('disputeChat.resolving') : t('disputeChat.closing'))
                  : (userRole === 'admin' ? t('disputeChat.resolveDispute') : t('disputeChat.closeDisputeByAgreement'))
                }
              </Button>
            )}
            {webSocket.isConnected ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                {t('disputeChat.online')}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {t('disputeChat.offline')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 min-h-0">
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
                      <AvatarImage src={getAvatarSrc(sender?.avatar)} />
                      <AvatarFallback className={
                        senderRole === t('disputeChat.roles.moderator') ? 'bg-purple-100 text-purple-600' :
                        senderRole === t('disputeChat.roles.client') ? 'bg-blue-100 text-blue-600' :
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
                          {format(new Date(message.createdAt), 'HH:mm', { locale: i18n.language === 'uk' ? uk : enUS })}
                        </span>
                      </div>
                      
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : senderRole === t('disputeChat.roles.moderator')
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content && <div className="mb-2">{message.content}</div>}
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment) => {
                              const fileExtension = attachment.fileName?.split('.').pop()?.toLowerCase() || '';
                              
                              // Визначаємо тип файлу
                              const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
                              const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension);
                              const isAudio = ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(fileExtension);
                              const isDocument = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(fileExtension);
                              const isSpreadsheet = ['xls', 'xlsx', 'csv', 'ods'].includes(fileExtension);
                              const isArchive = ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension);
                              const isCode = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift'].includes(fileExtension);
                              
                              // Вибираємо іконку
                              let FileIcon = Paperclip;
                              if (isImage) FileIcon = FileImage;
                              else if (isVideo) FileIcon = FileVideo;
                              else if (isAudio) FileIcon = FileAudio;
                              else if (isDocument || isSpreadsheet) FileIcon = FileText;
                              else if (isArchive) FileIcon = FileArchive;
                              else if (isCode) FileIcon = FileCode;
                              
                              return (
                                <div key={attachment.id}>
                                  {isImage ? (
                                    <div className="max-w-xs">
                                      <img
                                        src={attachment.fileUrl}
                                        alt={attachment.fileName}
                                        className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => window.open(attachment.fileUrl, '_blank')}
                                        style={{ maxHeight: '200px' }}
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">{attachment.fileName}</p>
                                    </div>
                                  ) : isVideo ? (
                                    <div className="max-w-xs">
                                      <video
                                        src={attachment.fileUrl}
                                        controls
                                        className="rounded-lg max-w-full h-auto"
                                        style={{ maxHeight: '200px' }}
                                      >
                                        {t('disputeChat.videoNotSupported')}
                                      </video>
                                      <p className="text-xs text-muted-foreground mt-1">{attachment.fileName}</p>
                                    </div>
                                  ) : isAudio ? (
                                    <div className="max-w-xs">
                                      <audio
                                        src={attachment.fileUrl}
                                        controls
                                        className="w-full"
                                      >
                                        {t('disputeChat.audioNotSupported')}
                                      </audio>
                                      <p className="text-xs text-muted-foreground mt-1">{attachment.fileName}</p>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg max-w-xs hover:bg-muted/80 transition-colors">
                                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                                      <div className="flex-1 min-w-0">
                                        <a
                                          href={attachment.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm hover:underline truncate block font-medium"
                                        >
                                          {attachment.fileName}
                                        </a>
                                        <p className="text-xs text-muted-foreground">
                                          {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB • .{fileExtension.toUpperCase()}
                                        </p>
                                      </div>
                                      <a
                                        href={attachment.fileUrl}
                                        download={attachment.fileName}
                                        className="p-1 hover:bg-muted rounded"
                                        title={t('disputeChat.downloadFile')}
                                      >
                                        <Download className="h-4 w-4 text-muted-foreground" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
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
                        {getTypingUsersNames().join(', ')} {t('disputeChat.typing')}
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
            {t('disputeChat.moderatorWarning')}
          </div>
          
          {/* Dispute resolution controls */}
          {canResolve && disputeStatus !== 'resolved' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    {userRole === 'admin' ? t('disputeChat.adminActions') : t('disputeChat.closeDispute')}
                  </p>
                  <p className="text-xs text-green-700">
                    {userRole === 'admin' 
                      ? t('disputeChat.adminCanClose')
                      : t('disputeChat.canCloseByAgreement')
                    }
                  </p>
                </div>
                <Button
                  onClick={handleResolveDispute}
                  disabled={isResolvingDispute}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isResolvingDispute ? t('disputeChat.closing') : (userRole === 'admin' ? t('disputeChat.resolveDispute') : t('disputeChat.closeByAgreement'))}
                </Button>
              </div>
            </div>
          )}

          {/* Show loading indicator */}
          {isLoading && (
            <div className="mb-2 text-center text-sm text-muted-foreground">
              {t('disputeChat.loadingMessages')}
            </div>
          )}
          
          {/* File attachments preview */}
          {attachments.length > 0 && (
            <div className="mb-2 space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t('disputeChat.attachedFiles')}:
              </div>
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-muted rounded-lg"
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Input
              value={messageText}
              onChange={handleInputChange}
              placeholder={t('disputeChat.placeholder')}
              className="flex-1"
              disabled={isSending}
            />
            
            {/* File input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={getAcceptString()}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button 
              type="submit" 
              size="sm"
              disabled={(!messageText.trim() && attachments.length === 0) || isSending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}