import { query } from '../db';
import { getWebSocketService } from './webSocketService';
import axios from 'axios';
import { config } from '../config/config';

// TODO: implement real email and push services
async function sendEmail(userId: string, content: string) {
  // EmailService.send(userId, content);
}
async function sendPush(userId: string, content: string) {
  // PushService.send(userId, content);
}

async function sendTelegram(userId: string, content: string) {
    if (!config.telegramBotToken) {
        console.error("Telegram bot token is not configured.");
        return;
    }

    try {
        const userResult = await query('SELECT telegram_chat_id FROM users WHERE id = $1', [userId]);
        if (userResult.rowCount === 0 || !userResult.rows[0].telegram_chat_id) {
            console.log(`User ${userId} does not have a linked Telegram chat_id.`);
            return;
        }

        const chatId = userResult.rows[0].telegram_chat_id;
        const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;

        await axios.post(url, {
            chat_id: chatId,
            text: content,
            parse_mode: 'Markdown'
        });

        console.log(`Successfully sent Telegram notification to user ${userId}`);

    } catch (error) {
        console.error(`Failed to send Telegram notification to user ${userId}:`, error);
    }
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