// WebSocket event types and interfaces

export interface AuthenticatedSocket {
  userId: string;
  userRole: 'client' | 'performer' | 'admin';
  socketId: string;
}

// Message types for WebSocket communication
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

// Order chat events
export interface OrderChatMessage {
  type: 'order_message';
  data: {
    orderId: string;
    messageId: string;
    senderId: string;
    receiverId: string;
    content: string;
    attachments?: Array<{
      id: string;
      fileUrl: string;
      fileName: string;
    }>;
    createdAt: string;
  };
}

export interface OrderChatTyping {
  type: 'order_typing';
  data: {
    orderId: string;
    userId: string;
    isTyping: boolean;
  };
}

export interface OrderChatMessageRead {
  type: 'order_message_read';
  data: {
    orderId: string;
    messageId: string;
    readBy: string;
    readAt: string;
  };
}

// Dispute chat events
export interface DisputeChatMessage {
  type: 'dispute_message';
  data: {
    disputeId: string;
    orderId: string;
    messageId: string;
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
  };
}

export interface DisputeChatTyping {
  type: 'dispute_typing';
  data: {
    disputeId: string;
    userId: string;
    isTyping: boolean;
  };
}

// Order status updates
export interface OrderStatusUpdate {
  type: 'order_status_update';
  data: {
    orderId: string;
    status: string;
    updatedBy: string;
    updatedAt: string;
  };
}

// Dispute status updates
export interface DisputeStatusUpdate {
  type: 'dispute_status_update';
  data: {
    disputeId: string;
    orderId: string;
    status: string;
    updatedBy: string;
    updatedAt: string;
  };
}

// User presence
export interface UserPresence {
  type: 'user_presence';
  data: {
    userId: string;
    isOnline: boolean;
    lastSeen?: string;
  };
}

// Notification events
export interface NotificationEvent {
  type: 'notification';
  data: {
    id: string;
    userId: string;
    type: string;
    content: string;
    relatedId?: string;
    createdAt: string;
  };
}

// Union type for all WebSocket events
export type WebSocketEvent = 
  | OrderChatMessage
  | OrderChatTyping 
  | OrderChatMessageRead
  | DisputeChatMessage
  | DisputeChatTyping
  | OrderStatusUpdate
  | DisputeStatusUpdate
  | UserPresence
  | NotificationEvent;

// Room naming conventions
export const ROOM_TYPES = {
  ORDER_CHAT: (orderId: string) => `order:${orderId}`,
  DISPUTE_CHAT: (disputeId: string) => `dispute:${disputeId}`,
  USER_NOTIFICATIONS: (userId: string) => `user:${userId}`,
  ADMIN_NOTIFICATIONS: () => 'admin:notifications'
} as const;
