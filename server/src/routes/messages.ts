import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import { createNotification } from '../services/notificationService';

const router = Router({ mergeParams: true });
router.use(authenticate);

// GET /v1/orders/:orderId/messages - list messages and mark as read
router.get('/', async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user!.id;
  try {
    // Fetch messages
    const result = await query(
      `SELECT m.id, m.sender_id AS "senderId", m.receiver_id AS "receiverId", m.content, m.read, m.created_at AS "createdAt",
              (SELECT COALESCE(json_agg(json_build_object('id', id, 'fileUrl', file_url, 'fileName', file_name)), '[]')
               FROM message_attachments ma WHERE ma.message_id = m.id) AS attachments
       FROM messages m
       WHERE m.order_id = $1
       ORDER BY m.created_at`,
      [orderId]
    );
    const messages = result.rows;
    // Mark unread messages where receiver is current user as read
    await query(
      `UPDATE messages SET read = true WHERE order_id = $1 AND receiver_id = $2 AND read = false`,
      [orderId, userId]
    );
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// POST /v1/orders/:orderId/messages - send new message
router.post('/', async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user!.id;
  const { content, attachments } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }
  try {
    // Determine recipient
    const ord = await query(`SELECT client_id, performer_id, title FROM orders WHERE id = $1`, [orderId]);
    if (ord.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
    const { client_id, performer_id, title } = ord.rows[0];
    const receiverId = userId === client_id ? performer_id : client_id;
    // Insert message
    const msgRes = await query(
      `INSERT INTO messages(order_id, sender_id, receiver_id, content) VALUES($1,$2,$3,$4) RETURNING id, content, read, created_at AS "createdAt", sender_id AS "senderId", receiver_id AS "receiverId"`,
      [orderId, userId, receiverId, content]
    );
    const message = msgRes.rows[0];
    // Attachments if any
    if (Array.isArray(attachments)) {
      for (const att of attachments) {
        await query(
          `INSERT INTO message_attachments(message_id, file_url, file_name, file_size, file_type) VALUES($1,$2,$3,0,'')`,
          [message.id, att.fileUrl, att.fileName]
        );
      }
    }
    // Fetch attachments
    const attRes = await query(
      `SELECT id, file_url AS "fileUrl", file_name AS "fileName" FROM message_attachments WHERE message_id = $1`,
      [message.id]
    );
    message.attachments = attRes.rows;
    // Notify recipient
    await createNotification(
      receiverId,
      'message',
      `Нове повідомлення у замовленні "${title}"`,
      orderId
    );
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;
