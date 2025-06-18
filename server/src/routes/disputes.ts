import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import { createNotification } from '../services/notificationService';
import { getWebSocketService } from '../services/webSocketService';

const router = Router({ mergeParams: true });
router.use(authenticate);

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
router.post('/', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user!.id;
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ message: 'Reason is required' });
  try {
    // ensure order exists and not already disputed
    const ord = await query(`SELECT client_id, performer_id FROM orders WHERE id = $1`, [orderId]);
    if (ord.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
    const exists = await query(`SELECT 1 FROM disputes WHERE order_id = $1`, [orderId]);
    if ((exists.rowCount ?? 0) > 0) return res.status(400).json({ message: 'Dispute already exists' });
    const [o] = ord.rows;
    const performerId = o.performer_id;
    // open dispute
    const result = await query(
      `INSERT INTO disputes(order_id, client_id, performer_id, reason) VALUES($1,$2,$3,$4) RETURNING id, reason, status, created_at AS "createdAt"`,
      [orderId, userId, performerId, reason]
    );
    const dispute = result.rows[0];
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
    const result = await query(
      `SELECT dm.id, dm.sender_id AS "senderId", dm.content, dm.created_at AS "createdAt"
       FROM dispute_messages dm WHERE dm.dispute_id = $1 ORDER BY dm.created_at`,
      [disputeId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dispute messages' });
  }
});

// POST /v1/orders/:orderId/disputes/:disputeId/messages - send dispute message
router.post('/:disputeId/messages', async (req: Request, res: Response) => {
  const { disputeId } = req.params;
  const userId = req.user!.id;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content is required' });
  try {
    const result = await query(
      `INSERT INTO dispute_messages(dispute_id, sender_id, content) VALUES($1,$2,$3) RETURNING id, sender_id AS "senderId", content, created_at AS "createdAt"`,
      [disputeId, userId, content]
    );
    const message = result.rows[0];
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
        content,
        createdAt: message.createdAt
      });
    }

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send dispute message' });
  }
});

// PATCH /v1/orders/:orderId/disputes/:disputeId - moderator resolves dispute
router.patch('/:disputeId', async (req: Request, res: Response) => {
  const { disputeId } = req.params;
  const { status } = req.body;
  const userId = req.user!.id;
  if (!['in_review','resolved'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  // check moderator role
  if (req.user!.role !== 'admin') {
    return res.status(403).json({ message: 'Only moderator can change status' });
  }
  try {
    const result = await query(
      `UPDATE disputes SET status = $1, moderator_id = $2, updated_at = NOW() WHERE id = $3 RETURNING id, status`,
      [status, userId, disputeId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Dispute not found' });
    const dispute = result.rows[0];
    // notify both parties
    const parties = await query(`SELECT client_id, performer_id FROM disputes WHERE id = $1`, [disputeId]);
    if (parties.rowCount) {
      const { client_id, performer_id } = parties.rows[0];
      await createNotification(client_id, 'status_change', `Статус спору ${disputeId} змінено на ${status}`, req.params.orderId);
      await createNotification(performer_id, 'status_change', `Статус спору ${disputeId} змінено на ${status}`, req.params.orderId);
    }

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
