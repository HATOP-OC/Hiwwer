import { Router, Response, Request } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import { createNotification } from '../services/notificationService';
import { getWebSocketService } from '../services/webSocketService';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for dispute file uploads
const disputeStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/disputes');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${timestamp}-${safeBaseName}${ext}`);
  }
});

const disputeUpload = multer({
  storage: disputeStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
    files: 5 // Max 5 files per message
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types for disputes (admin can review)
    cb(null, true);
  }
});

// Extend Request interface locally
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      name: string;
      role: 'client' | 'performer' | 'admin';
      avatar?: string;
      bio?: string;
      rating?: number;
      telegramId?: string;
      createdAt: Date;
    };
  }
}

const router = Router({ mergeParams: true });
router.use(authenticate);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/disputes/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${uuidv4()}-${name}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
    files: 5 // max 5 files per message
  }
});

// GET /v1/orders/:orderId/disputes - list or fetch user's dispute
router.get('/', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const result = await query(
      `SELECT id, order_id AS "orderId", client_id AS "clientId", performer_id AS "performerId", moderator_id AS "moderatorId", reason, status, created_at AS "createdAt", updated_at AS "updatedAt"
       FROM disputes WHERE order_id = $1`,
      [orderId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Dispute not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dispute' });
  }
});

// POST /v1/orders/:orderId/disputes - open a dispute
router.post('/', authenticate, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user!.id;
  const { reason } = req.body;
  
  console.log('Dispute creation attempt:', {
    orderId,
    userId,
    reason,
    body: req.body,
    hasReason: !!reason
  });
  
  if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
    console.log('Invalid reason:', { reason, type: typeof reason, trimmed: reason?.trim?.() });
    return res.status(400).json({ message: 'Reason is required' });
  }
  try {
    console.log('Checking if order exists for orderId:', orderId);
    // ensure order exists and not already disputed
    const ord = await query(`SELECT client_id, performer_id FROM orders WHERE id = $1`, [orderId]);
    if (ord.rowCount === 0) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log('Checking if dispute already exists for orderId:', orderId);
    const exists = await query(`SELECT 1 FROM disputes WHERE order_id = $1`, [orderId]);
    if ((exists.rowCount ?? 0) > 0) {
      console.log('Dispute already exists for orderId:', orderId);
      return res.status(409).json({ message: 'Спір для цього замовлення вже існує' });
    }
    
    const [o] = ord.rows;
    const performerId = o.performer_id;
    
    console.log('Creating dispute with data:', { orderId, userId, performerId, reason });
    // open dispute
    const result = await query(
      `INSERT INTO disputes(order_id, client_id, performer_id, reason) VALUES($1,$2,$3,$4) RETURNING id, reason, status, created_at AS "createdAt"`,
      [orderId, userId, performerId, reason]
    );
    const dispute = result.rows[0];
    
    // Update order status to disputed
    await query(`UPDATE orders SET status = 'disputed' WHERE id = $1`, [orderId]);
    
    // notify moderator (assume role=admin)
    const mods = await query(`SELECT id FROM users WHERE role = 'admin'`);
    for (const m of mods.rows) {
      await createNotification(m.id, 'dispute', `Відкрито спір для замовлення ${orderId}`, orderId);
    }
    res.status(201).json(dispute);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to open dispute' });
  }
});

// GET /v1/orders/:orderId/disputes/:disputeId/messages - list dispute messages
router.get('/:disputeId/messages', async (req: Request, res: Response) => {
  const { disputeId } = req.params;
  try {
    // Get messages with attachments
    const messagesResult = await query(
      `SELECT dm.id, dm.sender_id AS "senderId", dm.content, dm.created_at AS "createdAt"
       FROM dispute_messages dm WHERE dm.dispute_id = $1 ORDER BY dm.created_at`,
      [disputeId]
    );
    
    const messages = messagesResult.rows;
    
    // Get attachments for each message
    for (const message of messages) {
      const attachmentsResult = await query(
        `SELECT id, file_name AS "fileName", file_url AS "fileUrl", file_size AS "fileSize", mime_type AS "mimeType"
         FROM dispute_message_attachments WHERE message_id = $1`,
        [message.id]
      );
      message.attachments = attachmentsResult.rows;
    }
    
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dispute messages' });
  }
});

// POST /v1/orders/:orderId/disputes/:disputeId/messages - send dispute message
router.post('/:disputeId/messages', disputeUpload.array('attachments', 5), async (req: Request, res: Response) => {
  const { disputeId } = req.params;
  const userId = req.user!.id;
  const { content } = req.body;
  const files = req.files as Express.Multer.File[];
  
  if (!content && (!files || files.length === 0)) {
    return res.status(400).json({ message: 'Content or attachments are required' });
  }
  
  try {
    // Start transaction
    await query('BEGIN');
    
    // Insert message
    const messageResult = await query(
      `INSERT INTO dispute_messages(dispute_id, sender_id, content) VALUES($1,$2,$3) RETURNING id, sender_id AS "senderId", content, created_at AS "createdAt"`,
      [disputeId, userId, content || '']
    );
    const message = messageResult.rows[0];
    
    // Insert attachments if any
    const attachments = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const attachmentResult = await query(
          `INSERT INTO dispute_message_attachments(message_id, file_name, file_url, file_size, mime_type) 
           VALUES($1, $2, $3, $4, $5) RETURNING id, file_name AS "fileName", file_url AS "fileUrl", file_size AS "fileSize", mime_type AS "mimeType"`,
          [
            message.id,
            file.originalname,
            `/uploads/disputes/${file.filename}`,
            file.size,
            file.mimetype
          ]
        );
        attachments.push(attachmentResult.rows[0]);
      }
    }
    
    // Commit transaction
    await query('COMMIT');
    
    // Add attachments to message object
    message.attachments = attachments;
    
    // notify other party + moderator
    const dispute = await query(`SELECT client_id, performer_id FROM disputes WHERE id = $1`, [disputeId]);
    if (dispute.rowCount) {
      const { client_id, performer_id } = dispute.rows[0];
      const other = userId === client_id ? performer_id : client_id;
      await createNotification(other, 'message', `Нове повідомлення в спорі ${disputeId}`, req.params.orderId);
      const mods = await query(`SELECT id FROM users WHERE role = 'admin'`);
      for (const m of mods.rows) await createNotification(m.id, 'message', `Нове повідомлення в спорі ${disputeId}`, req.params.orderId);
    }

    // Broadcast message via WebSocket
    const webSocketService = getWebSocketService();
    if (webSocketService) {
      webSocketService.broadcastDisputeMessage({
        disputeId,
        orderId: req.params.orderId,
        messageId: message.id,
        senderId: userId,
        content: content || '',
        attachments,
        createdAt: message.createdAt
      });
    }

    res.status(201).json({
      ...message,
      attachments
    });
  } catch (err) {
    await query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to send dispute message' });
  }
});

// PATCH /v1/orders/:orderId/disputes/:disputeId - moderator or dispute initiator resolves dispute
router.patch('/:disputeId', async (req: Request, res: Response) => {
  const { disputeId } = req.params;
  const { status } = req.body;
  const userId = req.user!.id;
  if (!['in_review','resolved'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  
  try {
    // Get dispute info to check permissions
    const disputeInfo = await query(`SELECT client_id, performer_id FROM disputes WHERE id = $1`, [disputeId]);
    if (disputeInfo.rowCount === 0) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    
    const { client_id, performer_id } = disputeInfo.rows[0];
    
    // Check permissions: admin or the client who initiated the dispute
    const isAdmin = req.user!.role === 'admin';
    const isDisputeInitiator = userId === client_id;
    
    if (!isAdmin && !isDisputeInitiator) {
      return res.status(403).json({ message: 'Only moderator or dispute initiator can change status' });
    }
    
    const result = await query(
      `UPDATE disputes SET status = $1, moderator_id = $2, updated_at = NOW() WHERE id = $3 RETURNING id, status`,
      [status, userId, disputeId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Dispute not found' });
    const dispute = result.rows[0];
    
    // notify both parties  
    await createNotification(client_id, 'status_change', `Статус спору ${disputeId} змінено на ${status}`, req.params.orderId);
    await createNotification(performer_id, 'status_change', `Статус спору ${disputeId} змінено на ${status}`, req.params.orderId);

    // Broadcast status update via WebSocket
    const webSocketService = getWebSocketService();
    if (webSocketService) {
      webSocketService.broadcastDisputeStatusUpdate(disputeId, req.params.orderId, status, userId);
    }

    res.json(dispute);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update dispute status' });
  }
});

export default router;
