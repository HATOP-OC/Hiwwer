import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  Download
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import { OrderChatMessage, OrderChatTyping } from '@/types/websocket';
import { Message } from '@/lib/api';
import { fetchMessages, sendMessage, uploadOrderAttachment, editMessage, deleteMessage } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { getAcceptString, validateFile } from '@/lib/fileTypes';
import FilePreview from './FilePreview';

interface OrderChatProps {
  orderId: string;
  participants: {
    client: { id: string; name: string; avatar?: string };
    performer?: { id: string; name: string; avatar?: string };
  };
}

export default function OrderChat({ orderId, participants }: OrderChatProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const webSocket = useWebSocket();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', orderId],
    queryFn: () => fetchMessages(orderId),
    refetchInterval: !webSocket.isConnected ? 5000 : false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { content: string; attachments?: any[] }) => 
      sendMessage(orderId, data),
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['messages', orderId] });
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      editMessage(orderId, messageId, content),
    onSuccess: () => {
      setEditingMessageId(null);
      setEditingText('');
      queryClient.invalidateQueries({ queryKey: ['messages', orderId] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage(orderId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', orderId] });
    },
  });

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

  const handleMessageEdit = useCallback((data: any) => {
    if (data.orderId === orderId) {
      queryClient.setQueryData(['messages', orderId], (oldMessages: Message[] = []) => 
        oldMessages.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, content: data.content, edited: data.edited, updatedAt: data.updatedAt }
            : msg
        )
      );
    }
  }, [orderId, queryClient]);

  const handleMessageDelete = useCallback((data: any) => {
    if (data.orderId === orderId) {
      queryClient.setQueryData(['messages', orderId], (oldMessages: Message[] = []) =>
        oldMessages.map(msg =>
          msg.id === data.messageId
            ? { ...msg, content: t('orderChat.messageDeleted'), deleted: true }
            : msg
        )
      );
    }
  }, [orderId, queryClient, t]);

  useEffect(() => {
    if (webSocket.socket && webSocket.isConnected) {
      webSocket.joinOrderChat(orderId);
      webSocket.onOrderMessage(handleNewMessage);
      webSocket.onOrderTyping(handleTyping);
      webSocket.onMessageEdit(handleMessageEdit);
      webSocket.onMessageDelete(handleMessageDelete);

      return () => {
        webSocket.offOrderMessage(handleNewMessage);
        webSocket.offOrderTyping(handleTyping);
        webSocket.offMessageEdit(handleMessageEdit);
        webSocket.offMessageDelete(handleMessageDelete);
        webSocket.leaveOrderChat(orderId);
      };
    }
  }, [webSocket, webSocket.socket, webSocket.isConnected, orderId, handleNewMessage, handleTyping, handleMessageEdit, handleMessageDelete]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    };
    
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      webSocket.setOrderTyping(orderId, true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      webSocket.setOrderTyping(orderId, false);
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = await validateFile(file);
      if (!validation.isValid) {
        alert(validation.error); // This part is not localized yet
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setPreviewFile(file);
      setShowFilePreview(true);
    }
  };

  const handleFilePreviewConfirm = () => {
    if (previewFile) {
      setSelectedFile(previewFile);
      handleFileUpload(previewFile);
      setShowFilePreview(false);
      setPreviewFile(null);
    }
  };

  const handleFilePreviewCancel = () => {
    setShowFilePreview(false);
    setPreviewFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const attachment = await uploadOrderAttachment(orderId, file);
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '');
      const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension || '');
      const isAudio = ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(fileExtension || '');
      
      let emoji = '📎';
      if (isImage) emoji = '🖼️';
      else if (isVideo) emoji = '🎥';
      else if (isAudio) emoji = '🎵';
      else if (fileExtension === 'pdf') emoji = '📄';
      else if (['doc', 'docx'].includes(fileExtension || '')) emoji = '📝';
      else if (['xls', 'xlsx'].includes(fileExtension || '')) emoji = '📊';
      else if (['zip', 'rar', '7z'].includes(fileExtension || '')) emoji = '🗜️';
      
      sendMessageMutation.mutate({
        content: messageText.trim() || `${emoji} ${file.name}`,
        attachments: [{
          fileUrl: attachment.fileUrl,
          fileName: attachment.fileName
        }]
      });
      
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert(t('orderChat.uploadError'));
    }
  };

  const getMessageSender = (senderId: string) => {
    if (senderId === participants.client.id) return participants.client;
    if (senderId === participants.performer?.id) return participants.performer;
    return { id: senderId, name: t('orderChat.unknownUser') };
  };

  const getTypingUsersNames = () => {
    const names: string[] = [];
    typingUsers.forEach(userId => {
      const sender = getMessageSender(userId);
      if (sender) names.push(sender.name);
    });
    return names;
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditingText(currentContent);
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editingText.trim()) {
      editMessageMutation.mutate({
        messageId: editingMessageId,
        content: editingText.trim()
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
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
          <CardTitle className="text-lg">{t('orderChat.title')}</CardTitle>
          <div className="flex items-center space-x-2">
            {webSocket.isConnected ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                {t('orderChat.online')}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {t('orderChat.offline')}
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 min-h-0">
          <div className="space-y-4 py-4">
            {messages.map((message) => {
              const sender = getMessageSender(message.senderId);
              const isOwn = message.senderId === user?.id;
              const isEditing = editingMessageId === message.id;
              
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
                    
                    <div className={`space-y-1 ${isOwn ? 'text-right' : ''} flex-1`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {sender?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.createdAt), 'HH:mm', { locale: i18n.language === 'uk' ? uk : enUS })}
                            {message.edited && (
                              <span className="ml-1 text-xs text-muted-foreground italic">
                                {t('orderChat.edited')}
                              </span>
                            )}
                          </span>
                        </div>
                        
                        {isOwn && !message.deleted && !isEditing && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-50 hover:opacity-100">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditMessage(message.id, message.content)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                {t('orderChat.edit')}
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('orderChat.delete')}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t('orderChat.deleteConfirm.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t('orderChat.deleteConfirm.description')}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t('orderChat.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteMessage(message.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {t('orderChat.deleteConfirm.confirm')}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveEdit();
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                            placeholder={t('orderChat.editPlaceholder')}
                            className="w-full"
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={handleSaveEdit}
                              disabled={!editingText.trim() || editMessageMutation.isPending}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              {t('orderChat.save')}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleCancelEdit}
                            >
                              <X className="h-3 w-3 mr-1" />
                              {t('orderChat.cancel')}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          } ${message.deleted ? 'opacity-60 italic' : ''}`}
                        >
                          {message.content}
                          
                          {message.attachments && message.attachments.length > 0 && !message.deleted && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => {
                                const fileUrl = typeof attachment === 'string' ? attachment : attachment.fileUrl || '';
                                const fileName = typeof attachment === 'string' ? t('orderChat.attachmentName', {index: index + 1}) : attachment.fileName;
                                const fileExtension = fileName?.split('.').pop()?.toLowerCase() || '';
                                
                                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
                                const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension);
                                const isAudio = ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(fileExtension);
                                const isDocument = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(fileExtension);
                                const isSpreadsheet = ['xls', 'xlsx', 'csv', 'ods'].includes(fileExtension);
                                const isArchive = ['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension);
                                const isCode = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift'].includes(fileExtension);
                                
                                let FileIcon = Paperclip;
                                if (isImage) FileIcon = FileImage;
                                else if (isVideo) FileIcon = FileVideo;
                                else if (isAudio) FileIcon = FileAudio;
                                else if (isDocument || isSpreadsheet) FileIcon = FileText;
                                else if (isArchive) FileIcon = FileArchive;
                                else if (isCode) FileIcon = FileCode;
                                
                                return (
                                  <div key={index}>
                                    {isImage ? (
                                      <div className="max-w-xs">
                                        <img
                                          src={fileUrl}
                                          alt={fileName}
                                          className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-80 transition-opacity"
                                          onClick={() => window.open(fileUrl, '_blank')}
                                          style={{ maxHeight: '200px' }}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{fileName}</p>
                                      </div>
                                    ) : isVideo ? (
                                      <div className="max-w-xs">
                                        <video
                                          src={fileUrl}
                                          controls
                                          className="rounded-lg max-w-full h-auto"
                                          style={{ maxHeight: '200px' }}
                                        >
                                          {t('orderChat.videoNotSupported')}
                                        </video>
                                        <p className="text-xs text-gray-500 mt-1">{fileName}</p>
                                      </div>
                                    ) : isAudio ? (
                                      <div className="max-w-xs">
                                        <audio
                                          src={fileUrl}
                                          controls
                                          className="w-full"
                                        >
                                          {t('orderChat.audioNotSupported')}
                                        </audio>
                                        <p className="text-xs text-gray-500 mt-1">{fileName}</p>
                                      </div>
                                    ) : (
                                      <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <FileIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        <div className="flex-1 min-w-0">
                                          <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm hover:underline truncate block font-medium"
                                          >
                                            {fileName}
                                          </a>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            .{fileExtension.toUpperCase()}
                                          </p>
                                        </div>
                                        <a
                                          href={fileUrl}
                                          download={fileName}
                                          className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                                          title={t('orderChat.downloadFile')}
                                        >
                                          <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {typingUsers.size > 0 && (
              <div className="flex justify-start">
                <div className="flex space-x-2 max-w-[70%]">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {t('orderChat.typing', { users: getTypingUsersNames().join(', '), count: typingUsers.size })}
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
        
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleFileSelect}>
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Input
              value={messageText}
              onChange={handleInputChange}
              placeholder={t('orderChat.inputPlaceholder')}
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
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={getAcceptString()}
            />
          </form>
        </div>
      </CardContent>

      <FilePreview
        file={previewFile}
        isOpen={showFilePreview}
        onClose={handleFilePreviewCancel}
        onSend={handleFilePreviewConfirm}
        isUploading={sendMessageMutation.isPending}
      />
    </Card>
  );
}