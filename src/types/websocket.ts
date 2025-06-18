// WebSocket types for frontend
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

// Order chat events
export interface OrderChatMessage {
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
}

export interface OrderChatTyping {
  orderId: string;
  userId: string;
  isTyping: boolean;
}

export interface OrderChatMessageRead {
  orderId: string;
  messageId: string;
  readBy: string;
  readAt: string;
}

// Dispute chat events
export interface DisputeChatMessage {
  disputeId: string;
  orderId: string;
  messageId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface DisputeChatTyping {
  disputeId: string;
  userId: string;
  isTyping: boolean;
}

// Status updates
export interface OrderStatusUpdate {
  orderId: string;
  status: string;
  updatedBy: string;
  updatedAt: string;
}

export interface DisputeStatusUpdate {
  disputeId: string;
  orderId: string;
  status: string;
  updatedBy: string;
  updatedAt: string;
}

// User presence
export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

// Notification events
export interface NotificationEvent {
  id: string;
  userId: string;
  type: string;
  content: string;
  relatedId?: string;
  createdAt: string;
}
