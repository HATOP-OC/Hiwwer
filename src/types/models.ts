// User related types
export type UserRole = 'client' | 'performer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  rating?: number;
  telegramId?: string;
  createdAt: Date;
}

// Service related types
export type ServiceCategory = 
  | 'design' 
  | 'development' 
  | 'writing' 
  | 'translation' 
  | 'marketing' 
  | 'video' 
  | 'audio' 
  | 'business' 
  | 'lifestyle' 
  | 'other';

export interface ServiceTag {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  tags: ServiceTag[];
  price: number;
  currency: string;
  deliveryTime: number; // in days
  performerId: string;
  performer: User;
  rating: number;
  reviewCount: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Order related types
export type OrderStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'revision' 
  | 'completed' 
  | 'canceled'
  | 'disputed';

// Attachment for orders
export interface OrderAttachment {
  id: string;
  fileUrl: string;
  fileName: string;
}

// History record for status changes
export interface OrderHistory {
  status: OrderStatus;
  changedAt: Date;
  by: 'client' | 'performer' | 'system';
}

// Dispute details
export interface OrderDispute {
  reason: string;
  openedAt: Date;
  status: 'open' | 'resolved';
}

export interface Order {
  id: string;
  title: string;
  description: string;
  status: OrderStatus;
  price: number;
  currency: string;
  deadline: Date;
  createdAt: Date;
  client: User;
  performer: User;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  unreadMessages: number;
  files?: OrderAttachment[];
  history: OrderHistory[];
  additionalOptions?: any;
  rating?: number;
  dispute?: OrderDispute;
}

// Review related types
export interface Review {
  id: string;
  orderId: string;
  order: Order;
  clientId: string;
  client: User;
  performerId: string;
  performer: User;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Message related types
export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

// Notification related types
export type NotificationType = 
  | 'new_order' 
  | 'status_change' 
  | 'message' 
  | 'review' 
  | 'deadline';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  read: boolean;
  relatedId?: string; // could be orderId, messageId, etc.
  createdAt: Date;
}
