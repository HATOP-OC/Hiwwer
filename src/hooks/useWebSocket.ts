import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  OrderChatMessage, 
  OrderChatTyping, 
  DisputeChatMessage, 
  DisputeChatTyping,
  OrderStatusUpdate,
  DisputeStatusUpdate,
  UserPresence,
  NotificationEvent
} from '@/types/websocket';

export interface WebSocketHookOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export interface WebSocketHookReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  
  // Order chat methods
  joinOrderChat: (orderId: string) => void;
  leaveOrderChat: (orderId: string) => void;
  sendOrderMessage: (orderId: string, content: string, attachments?: any[]) => void;
  setOrderTyping: (orderId: string, isTyping: boolean) => void;
  markOrderMessagesRead: (orderId: string) => void;
  
  // Dispute chat methods  
  joinDisputeChat: (disputeId: string) => void;
  leaveDisputeChat: (disputeId: string) => void;
  sendDisputeMessage: (disputeId: string, content: string) => void;
  setDisputeTyping: (disputeId: string, isTyping: boolean) => void;
  
  // Event listeners
  onOrderMessage: (callback: (message: OrderChatMessage) => void) => void;
  onOrderTyping: (callback: (typing: OrderChatTyping) => void) => void;
  onDisputeMessage: (callback: (message: DisputeChatMessage) => void) => void;
  onDisputeTyping: (callback: (typing: DisputeChatTyping) => void) => void;
  onOrderStatusUpdate: (callback: (update: OrderStatusUpdate) => void) => void;
  onDisputeStatusUpdate: (callback: (update: DisputeStatusUpdate) => void) => void;
  onUserPresence: (callback: (presence: UserPresence) => void) => void;
  onNotification: (callback: (notification: NotificationEvent) => void) => void;
  
  // Remove event listeners
  offOrderMessage: (callback: (message: OrderChatMessage) => void) => void;
  offOrderTyping: (callback: (typing: OrderChatTyping) => void) => void;
  offDisputeMessage: (callback: (message: DisputeChatMessage) => void) => void;
  offDisputeTyping: (callback: (typing: DisputeChatTyping) => void) => void;
  offOrderStatusUpdate: (callback: (update: OrderStatusUpdate) => void) => void;
  offDisputeStatusUpdate: (callback: (update: DisputeStatusUpdate) => void) => void;
  offUserPresence: (callback: (presence: UserPresence) => void) => void;
  offNotification: (callback: (notification: NotificationEvent) => void) => void;
}

const API_BASE = (import.meta.env as any)?.VITE_API_BASE || 'http://localhost:3000/v1';
// Connect to main server WebSocket on port 3000
const WS_URL = 'http://localhost:3000'; // Main server WebSocket

export function useWebSocket(options: WebSocketHookOptions = {}): WebSocketHookReturn {
  const {
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const callbacksRef = useRef<Map<string, Set<(...args: any[]) => void>>>(new Map());

  const connect = useCallback(() => {
    if (socket?.connected) return;

    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No auth token found, cannot connect to WebSocket');
      return;
    }

    const newSocket = io(WS_URL, {
      auth: {
        token
      },
      autoConnect: false,
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
      transports: ['websocket', 'polling']
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Event handlers
    newSocket.on('order_message', (data: OrderChatMessage) => {
      const callbacks = callbacksRef.current.get('order_message');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('order_typing', (data: OrderChatTyping) => {
      const callbacks = callbacksRef.current.get('order_typing');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('dispute_message', (data: DisputeChatMessage) => {
      const callbacks = callbacksRef.current.get('dispute_message');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('dispute_typing', (data: DisputeChatTyping) => {
      const callbacks = callbacksRef.current.get('dispute_typing');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('order_status_update', (data: OrderStatusUpdate) => {
      const callbacks = callbacksRef.current.get('order_status_update');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('dispute_status_update', (data: DisputeStatusUpdate) => {
      const callbacks = callbacksRef.current.get('dispute_status_update');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('user_presence', (data: UserPresence) => {
      const callbacks = callbacksRef.current.get('user_presence');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('notification', (data: NotificationEvent) => {
      const callbacks = callbacksRef.current.get('notification');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('messages_read', (data: any) => {
      const callbacks = callbacksRef.current.get('messages_read');
      callbacks?.forEach(callback => callback(data));
    });

    newSocket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    newSocket.connect();
    setSocket(newSocket);
  }, [socket, reconnection, reconnectionAttempts, reconnectionDelay]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Order chat methods
  const joinOrderChat = useCallback((orderId: string) => {
    socket?.emit('join_order_chat', { orderId });
  }, [socket]);

  const leaveOrderChat = useCallback((orderId: string) => {
    socket?.emit('leave_order_chat', { orderId });
  }, [socket]);

  const sendOrderMessage = useCallback((orderId: string, content: string, attachments?: any[]) => {
    socket?.emit('order_message', { orderId, content, attachments });
  }, [socket]);

  const setOrderTyping = useCallback((orderId: string, isTyping: boolean) => {
    socket?.emit('order_typing', { orderId, isTyping });
  }, [socket]);

  const markOrderMessagesRead = useCallback((orderId: string) => {
    socket?.emit('mark_messages_read', { orderId });
  }, [socket]);

  // Dispute chat methods
  const joinDisputeChat = useCallback((disputeId: string) => {
    socket?.emit('join_dispute_chat', { disputeId });
  }, [socket]);

  const leaveDisputeChat = useCallback((disputeId: string) => {
    socket?.emit('leave_dispute_chat', { disputeId });
  }, [socket]);

  const sendDisputeMessage = useCallback((disputeId: string, content: string) => {
    socket?.emit('dispute_message', { disputeId, content });
  }, [socket]);

  const setDisputeTyping = useCallback((disputeId: string, isTyping: boolean) => {
    socket?.emit('dispute_typing', { disputeId, isTyping });
  }, [socket]);

  // Event listener management
  const addCallback = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (!callbacksRef.current.has(event)) {
      callbacksRef.current.set(event, new Set());
    }
    callbacksRef.current.get(event)!.add(callback);
  }, []);

  const removeCallback = useCallback((event: string, callback: (...args: any[]) => void) => {
    const callbacks = callbacksRef.current.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        callbacksRef.current.delete(event);
      }
    }
  }, []);

  // Event listener methods
  const onOrderMessage = useCallback((callback: (message: OrderChatMessage) => void) => {
    addCallback('order_message', callback);
  }, [addCallback]);

  const offOrderMessage = useCallback((callback: (message: OrderChatMessage) => void) => {
    removeCallback('order_message', callback);
  }, [removeCallback]);

  const onOrderTyping = useCallback((callback: (typing: OrderChatTyping) => void) => {
    addCallback('order_typing', callback);
  }, [addCallback]);

  const offOrderTyping = useCallback((callback: (typing: OrderChatTyping) => void) => {
    removeCallback('order_typing', callback);
  }, [removeCallback]);

  const onDisputeMessage = useCallback((callback: (message: DisputeChatMessage) => void) => {
    addCallback('dispute_message', callback);
  }, [addCallback]);

  const offDisputeMessage = useCallback((callback: (message: DisputeChatMessage) => void) => {
    removeCallback('dispute_message', callback);
  }, [removeCallback]);

  const onDisputeTyping = useCallback((callback: (typing: DisputeChatTyping) => void) => {
    addCallback('dispute_typing', callback);
  }, [addCallback]);

  const offDisputeTyping = useCallback((callback: (typing: DisputeChatTyping) => void) => {
    removeCallback('dispute_typing', callback);
  }, [removeCallback]);

  const onOrderStatusUpdate = useCallback((callback: (update: OrderStatusUpdate) => void) => {
    addCallback('order_status_update', callback);
  }, [addCallback]);

  const offOrderStatusUpdate = useCallback((callback: (update: OrderStatusUpdate) => void) => {
    removeCallback('order_status_update', callback);
  }, [removeCallback]);

  const onDisputeStatusUpdate = useCallback((callback: (update: DisputeStatusUpdate) => void) => {
    addCallback('dispute_status_update', callback);
  }, [addCallback]);

  const offDisputeStatusUpdate = useCallback((callback: (update: DisputeStatusUpdate) => void) => {
    removeCallback('dispute_status_update', callback);
  }, [removeCallback]);

  const onUserPresence = useCallback((callback: (presence: UserPresence) => void) => {
    addCallback('user_presence', callback);
  }, [addCallback]);

  const offUserPresence = useCallback((callback: (presence: UserPresence) => void) => {
    removeCallback('user_presence', callback);
  }, [removeCallback]);

  const onNotification = useCallback((callback: (notification: NotificationEvent) => void) => {
    addCallback('notification', callback);
  }, [addCallback]);

  const offNotification = useCallback((callback: (notification: NotificationEvent) => void) => {
    removeCallback('notification', callback);
  }, [removeCallback]);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    
    // Order chat methods
    joinOrderChat,
    leaveOrderChat,
    sendOrderMessage,
    setOrderTyping,
    markOrderMessagesRead,
    
    // Dispute chat methods
    joinDisputeChat,
    leaveDisputeChat,
    sendDisputeMessage,
    setDisputeTyping,
    
    // Event listeners
    onOrderMessage,
    onOrderTyping,
    onDisputeMessage,
    onDisputeTyping,
    onOrderStatusUpdate,
    onDisputeStatusUpdate,
    onUserPresence,
    onNotification,
    
    // Remove event listeners
    offOrderMessage,
    offOrderTyping,
    offDisputeMessage,
    offDisputeTyping,
    offOrderStatusUpdate,
    offDisputeStatusUpdate,
    offUserPresence,
    offNotification
  };
}
