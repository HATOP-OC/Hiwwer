import { query } from '../db';

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
  await query(
    `INSERT INTO notifications(user_id, type, content, related_id) VALUES($1, $2, $3, $4)`,
    [userId, type, content, relatedId]
  );
  // dispatch
  await Promise.all([sendEmail(userId, content), sendPush(userId, content), sendTelegram(userId, content)]);
}
