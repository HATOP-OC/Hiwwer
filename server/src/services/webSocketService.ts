import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { config } from '../config/config';
import { 
  AuthenticatedSocket, 
  WebSocketEvent, 
  ROOM_TYPES,
  OrderChatMessage,
  DisputeChatMessage,
  OrderChatTyping,
  DisputeChatTyping,
  UserPresence
} from '../types/websocket';

export class WebSocketService {
  private io: SocketServer;
  private authenticatedSockets: Map<string, AuthenticatedSocket> = new Map();
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds
  private typingUsers: Map<string, Set<string>> = new Map(); // roomId -> Set of userIds

  constructor(httpServer: HttpServer) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupMiddlewares();
    this.setupEventHandlers();
  }

  private setupMiddlewares() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, config.jwtSecret) as any;
        
        // Verify user exists in database
        const userResult = await query(
          'SELECT id, name, email, role FROM users WHERE id = $1',
          [decoded.userId]
        );

        if (userResult.rowCount === 0) {
          return next(new Error('Authentication error: User not found'));
        }

        const user = userResult.rows[0];
        
        // Store authenticated user info
        const authSocket: AuthenticatedSocket = {
          userId: user.id,
          userRole: user.role,
          socketId: socket.id
        };

        this.authenticatedSockets.set(socket.id, authSocket);
        socket.data.user = authSocket;

        // Track user sockets
        if (!this.userSockets.has(user.id)) {
          this.userSockets.set(user.id, new Set());
        }
        this.userSockets.get(user.id)!.add(socket.id);

        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const authSocket = socket.data.user as AuthenticatedSocket;
      console.log(`User ${authSocket.userId} connected with socket ${socket.id}`);

      // Broadcast user online status
      this.broadcastUserPresence(authSocket.userId, true);

      // Join user to their personal notification room
      socket.join(ROOM_TYPES.USER_NOTIFICATIONS(authSocket.userId));

      // Join admin users to admin notification room
      if (authSocket.userRole === 'admin') {
        socket.join(ROOM_TYPES.ADMIN_NOTIFICATIONS());
      }

      // Handle joining order chat rooms
      socket.on('join_order_chat', async (data: { orderId: string }) => {
        await this.handleJoinOrderChat(socket, data.orderId);
      });

      // Handle leaving order chat rooms
      socket.on('leave_order_chat', (data: { orderId: string }) => {
        this.handleLeaveOrderChat(socket, data.orderId);
      });

      // Handle joining dispute chat rooms
      socket.on('join_dispute_chat', async (data: { disputeId: string }) => {
        await this.handleJoinDisputeChat(socket, data.disputeId);
      });

      // Handle leaving dispute chat rooms
      socket.on('leave_dispute_chat', (data: { disputeId: string }) => {
        this.handleLeaveDisputeChat(socket, data.disputeId);
      });

      // Handle order chat messages
      socket.on('order_message', async (data: any) => {
        await this.handleOrderMessage(socket, data);
      });

      // Handle dispute chat messages
      socket.on('dispute_message', async (data: any) => {
        await this.handleDisputeMessage(socket, data);
      });

      // Handle typing indicators
      socket.on('order_typing', (data: { orderId: string; isTyping: boolean }) => {
        this.handleOrderTyping(socket, data);
      });

      socket.on('dispute_typing', (data: { disputeId: string; isTyping: boolean }) => {
        this.handleDisputeTyping(socket, data);
      });

      // Handle message read receipts
      socket.on('mark_messages_read', async (data: { orderId: string }) => {
        await this.handleMarkMessagesRead(socket, data.orderId);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private async handleJoinOrderChat(socket: Socket, orderId: string) {
    const authSocket = socket.data.user as AuthenticatedSocket;
    
    try {
      // Verify user has access to this order
      const orderResult = await query(
        `SELECT client_id, performer_id FROM orders WHERE id = $1`,
        [orderId]
      );

      if (orderResult.rowCount === 0) {
        socket.emit('error', { message: 'Order not found' });
        return;
      }

      const order = orderResult.rows[0];
      const hasAccess = order.client_id === authSocket.userId || 
                       order.performer_id === authSocket.userId ||
                       authSocket.userRole === 'admin';

      if (!hasAccess) {
        socket.emit('error', { message: 'Access denied to this order chat' });
        return;
      }

      const roomName = ROOM_TYPES.ORDER_CHAT(orderId);
      socket.join(roomName);
      
      console.log(`User ${authSocket.userId} joined order chat ${orderId}`);
      socket.emit('joined_order_chat', { orderId });

    } catch (error) {
      console.error('Error joining order chat:', error);
      socket.emit('error', { message: 'Failed to join order chat' });
    }
  }

  private handleLeaveOrderChat(socket: Socket, orderId: string) {
    const roomName = ROOM_TYPES.ORDER_CHAT(orderId);
    socket.leave(roomName);
    
    const authSocket = socket.data.user as AuthenticatedSocket;
    console.log(`User ${authSocket.userId} left order chat ${orderId}`);
  }

  private async handleJoinDisputeChat(socket: Socket, disputeId: string) {
    const authSocket = socket.data.user as AuthenticatedSocket;
    
    try {
      // Verify user has access to this dispute
      const disputeResult = await query(
        `SELECT client_id, performer_id, moderator_id FROM disputes WHERE id = $1`,
        [disputeId]
      );

      if (disputeResult.rowCount === 0) {
        socket.emit('error', { message: 'Dispute not found' });
        return;
      }

      const dispute = disputeResult.rows[0];
      const hasAccess = dispute.client_id === authSocket.userId || 
                       dispute.performer_id === authSocket.userId ||
                       dispute.moderator_id === authSocket.userId ||
                       authSocket.userRole === 'admin';

      if (!hasAccess) {
        socket.emit('error', { message: 'Access denied to this dispute chat' });
        return;
      }

      const roomName = ROOM_TYPES.DISPUTE_CHAT(disputeId);
      socket.join(roomName);
      
      console.log(`User ${authSocket.userId} joined dispute chat ${disputeId}`);
      socket.emit('joined_dispute_chat', { disputeId });

    } catch (error) {
      console.error('Error joining dispute chat:', error);
      socket.emit('error', { message: 'Failed to join dispute chat' });
    }
  }

  private handleLeaveDisputeChat(socket: Socket, disputeId: string) {
    const roomName = ROOM_TYPES.DISPUTE_CHAT(disputeId);
    socket.leave(roomName);
    
    const authSocket = socket.data.user as AuthenticatedSocket;
    console.log(`User ${authSocket.userId} left dispute chat ${disputeId}`);
  }

  private async handleOrderMessage(socket: Socket, data: any) {
    const authSocket = socket.data.user as AuthenticatedSocket;
    const { orderId, content, attachments } = data;

    try {
      // This should be handled by the existing API, but we'll emit the event
      // The API will call our broadcastOrderMessage method
      console.log(`User ${authSocket.userId} sent message to order ${orderId}`);
      
    } catch (error) {
      console.error('Error handling order message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  private async handleDisputeMessage(socket: Socket, data: any) {
    const authSocket = socket.data.user as AuthenticatedSocket;
    const { disputeId, content } = data;

    try {
      // This should be handled by the existing API, but we'll emit the event
      // The API will call our broadcastDisputeMessage method
      console.log(`User ${authSocket.userId} sent message to dispute ${disputeId}`);
      
    } catch (error) {
      console.error('Error handling dispute message:', error);
      socket.emit('error', { message: 'Failed to send dispute message' });
    }
  }

  private handleOrderTyping(socket: Socket, data: { orderId: string; isTyping: boolean }) {
    const authSocket = socket.data.user as AuthenticatedSocket;
    const roomName = ROOM_TYPES.ORDER_CHAT(data.orderId);
    
    if (!this.typingUsers.has(roomName)) {
      this.typingUsers.set(roomName, new Set());
    }

    if (data.isTyping) {
      this.typingUsers.get(roomName)!.add(authSocket.userId);
    } else {
      this.typingUsers.get(roomName)!.delete(authSocket.userId);
    }

    const typingEvent: OrderChatTyping = {
      type: 'order_typing',
      data: {
        orderId: data.orderId,
        userId: authSocket.userId,
        isTyping: data.isTyping
      }
    };

    socket.to(roomName).emit('order_typing', typingEvent.data);
  }

  private handleDisputeTyping(socket: Socket, data: { disputeId: string; isTyping: boolean }) {
    const authSocket = socket.data.user as AuthenticatedSocket;
    const roomName = ROOM_TYPES.DISPUTE_CHAT(data.disputeId);
    
    if (!this.typingUsers.has(roomName)) {
      this.typingUsers.set(roomName, new Set());
    }

    if (data.isTyping) {
      this.typingUsers.get(roomName)!.add(authSocket.userId);
    } else {
      this.typingUsers.get(roomName)!.delete(authSocket.userId);
    }

    const typingEvent: DisputeChatTyping = {
      type: 'dispute_typing',
      data: {
        disputeId: data.disputeId,
        userId: authSocket.userId,
        isTyping: data.isTyping
      }
    };

    socket.to(roomName).emit('dispute_typing', typingEvent.data);
  }

  private async handleMarkMessagesRead(socket: Socket, orderId: string) {
    const authSocket = socket.data.user as AuthenticatedSocket;
    
    try {
      // Update read status in database
      await query(
        `UPDATE messages SET read_at = NOW() WHERE order_id = $1 AND sender_id != $2 AND read_at IS NULL`,
        [orderId, authSocket.userId]
      );

      // Notify other participants that messages were read
      const roomName = ROOM_TYPES.ORDER_CHAT(orderId);
      socket.to(roomName).emit('messages_read', {
        orderId,
        readBy: authSocket.userId,
        readAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  private handleDisconnect(socket: Socket) {
    const authSocket = this.authenticatedSockets.get(socket.id);
    
    if (authSocket) {
      console.log(`User ${authSocket.userId} disconnected`);
      
      // Remove from authenticated sockets
      this.authenticatedSockets.delete(socket.id);
      
      // Remove from user sockets tracking
      const userSocketSet = this.userSockets.get(authSocket.userId);
      if (userSocketSet) {
        userSocketSet.delete(socket.id);
        if (userSocketSet.size === 0) {
          this.userSockets.delete(authSocket.userId);
          // User is now offline
          this.broadcastUserPresence(authSocket.userId, false);
        }
      }

      // Clear typing indicators
      this.clearTypingIndicators(authSocket.userId);
    }
  }

  private clearTypingIndicators(userId: string) {
    this.typingUsers.forEach((userSet, roomName) => {
      if (userSet.has(userId)) {
        userSet.delete(userId);
        
        // Notify room that user stopped typing
        if (roomName.startsWith('order:')) {
          const orderId = roomName.replace('order:', '');
          this.io.to(roomName).emit('order_typing', {
            orderId,
            userId,
            isTyping: false
          });
        } else if (roomName.startsWith('dispute:')) {
          const disputeId = roomName.replace('dispute:', '');
          this.io.to(roomName).emit('dispute_typing', {
            disputeId,
            userId,
            isTyping: false
          });
        }
      }
    });
  }

  private broadcastUserPresence(userId: string, isOnline: boolean) {
    const presenceEvent: UserPresence = {
      type: 'user_presence',
      data: {
        userId,
        isOnline,
        lastSeen: isOnline ? undefined : new Date().toISOString()
      }
    };

    // Broadcast to all connected users
    this.io.emit('user_presence', presenceEvent.data);
  }

  // Public methods for broadcasting events from API routes

  public broadcastOrderMessage(messageData: OrderChatMessage['data']) {
    const roomName = ROOM_TYPES.ORDER_CHAT(messageData.orderId);
    const event: OrderChatMessage = {
      type: 'order_message',
      data: messageData
    };
    
    this.io.to(roomName).emit('order_message', event.data);
    console.log(`Broadcasted order message to room ${roomName}`);
  }

  public broadcastDisputeMessage(messageData: DisputeChatMessage['data']) {
    const roomName = ROOM_TYPES.DISPUTE_CHAT(messageData.disputeId);
    const event: DisputeChatMessage = {
      type: 'dispute_message',
      data: messageData
    };
    
    this.io.to(roomName).emit('dispute_message', event.data);
    console.log(`Broadcasted dispute message to room ${roomName}`);
  }

  public broadcastOrderStatusUpdate(orderId: string, status: string, updatedBy: string) {
    const roomName = ROOM_TYPES.ORDER_CHAT(orderId);
    
    this.io.to(roomName).emit('order_status_update', {
      orderId,
      status,
      updatedBy,
      updatedAt: new Date().toISOString()
    });
  }

  public broadcastDisputeStatusUpdate(disputeId: string, orderId: string, status: string, updatedBy: string) {
    const roomName = ROOM_TYPES.DISPUTE_CHAT(disputeId);
    
    this.io.to(roomName).emit('dispute_status_update', {
      disputeId,
      orderId,
      status,
      updatedBy,
      updatedAt: new Date().toISOString()
    });
  }

  public sendNotificationToUser(userId: string, notification: any) {
    const roomName = ROOM_TYPES.USER_NOTIFICATIONS(userId);
    this.io.to(roomName).emit('notification', notification);
  }

  public sendNotificationToAdmins(notification: any) {
    const roomName = ROOM_TYPES.ADMIN_NOTIFICATIONS();
    this.io.to(roomName).emit('notification', notification);
  }

  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  public getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }
}

// Singleton instance
let webSocketService: WebSocketService | null = null;

export function initializeWebSocket(httpServer: HttpServer): WebSocketService {
  if (!webSocketService) {
    webSocketService = new WebSocketService(httpServer);
  }
  return webSocketService;
}

export function getWebSocketService(): WebSocketService | null {
  return webSocketService;
}
