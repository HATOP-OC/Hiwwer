import { query } from '../db';
import { getWebSocketService } from './webSocketService';

// TODO: інтегрувати реальні сервіси
async function sendEmail(userId: string, content: string) {
  // EmailService.send(userId, content);
}
async function sendPush(userId: string, content: string) {
  // PushService.send(userId, content);
}
async function sendTelegram(userId: string, content: string) {
  // TelegramService.send(userId, content);
}

/**
 * Create a notification record and dispatch via channels
 */
export async function createNotification(userId: string, type: string, content: string, relatedId?: string) {
  console.log(`Creating notification: userId=${userId}, type=${type}, content=${content}, relatedId=${relatedId}`);
  
  const result = await query(
    `INSERT INTO notifications(user_id, type, content, related_id) VALUES($1, $2, $3, $4) RETURNING id, created_at`,
    [userId, type, content, relatedId]
  );
  
  const notification = result.rows[0];
  console.log(`Notification created successfully:`, notification);
  
  // Send via WebSocket
  const webSocketService = getWebSocketService();
  if (webSocketService) {
    webSocketService.sendNotificationToUser(userId, {
      id: notification.id,
      userId,
      type,
      content,
      relatedId,
      createdAt: notification.created_at
    });
  }
  
  // dispatch other channels
  await Promise.all([sendEmail(userId, content), sendPush(userId, content), sendTelegram(userId, content)]);
}
