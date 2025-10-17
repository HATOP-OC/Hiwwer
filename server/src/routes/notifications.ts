import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';

const router = Router();

// ==========================================
// PUBLIC ENDPOINTS (для Telegram бота)
// ==========================================

// GET /v1/notifications/pending-telegram - get notifications that need to be sent to Telegram
router.get('/pending-telegram', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT 
        n.id,
        n.user_id AS "userId",
        n.type,
        n.content,
        n.related_id AS "relatedId",
        n.created_at AS "createdAt",
        u.telegram_chat_id AS "chatId"
       FROM notifications n
       INNER JOIN users u ON n.user_id = u.id
       WHERE n.telegram_sent = false 
         AND u.telegram_chat_id IS NOT NULL
       ORDER BY n.created_at ASC
       LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pending notifications' });
  }
});

// PATCH /v1/notifications/:id/telegram-sent - mark as sent to Telegram (for bot use)
router.patch('/:id/telegram-sent', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE notifications 
       SET telegram_sent = true, telegram_sent_at = NOW() 
       WHERE id = $1 
       RETURNING id, telegram_sent, telegram_sent_at AS "telegramSentAt"`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Notification not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// GET /v1/notifications/users/:userId/telegram-chat - get user's Telegram chat_id (for bot use)
router.get('/users/:userId/telegram-chat', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await query(
      `SELECT telegram_chat_id AS "chatId" FROM users WHERE id = $1`,
      [userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user chat_id' });
  }
});

// ==========================================
// PROTECTED ENDPOINTS (потребують авторизації)
// ==========================================
router.use(authenticate);

// GET /v1/notifications - list for user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await query(
      `SELECT id, type, content, read, related_id AS "relatedId", created_at AS "createdAt"
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// PATCH /v1/notifications/:id/read - mark as read
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await query(
      `UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING id, read`,
      [id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Notification not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

export default router;
