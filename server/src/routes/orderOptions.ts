import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import { createNotification } from '../services/notificationService';

const router = Router({ mergeParams: true });
router.use(authenticate);

// GET /v1/orders/:orderId/options - list additional options
router.get('/', async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  try {
    const result = await query(
      `SELECT id, title, description, price, status, proposed_by AS "proposedBy", created_at AS "createdAt", updated_at AS "updatedAt"
       FROM order_additional_options WHERE order_id = $1 ORDER BY created_at`,
      [orderId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch additional options' });
  }
});

// POST /v1/orders/:orderId/options - propose a new option
router.post('/', async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user!.id;
  const { title, description, price } = req.body;
  if (!title || price === undefined) {
    return res.status(400).json({ message: 'Title and price are required' });
  }
  try {
    // Insert option
    const result = await query(
      `INSERT INTO order_additional_options(order_id, title, description, price, proposed_by)
       VALUES($1,$2,$3,$4,$5) RETURNING id, title, description, price, status, proposed_by AS "proposedBy", created_at AS "createdAt", updated_at AS "updatedAt"`,
      [orderId, title, description || '', price, userId]
    );
    const option = result.rows[0];
    // Notify other party
    const ord = await query(`SELECT client_id, performer_id, title FROM orders WHERE id = $1`, [orderId]);
    if (ord.rowCount) {
      const { client_id, performer_id, title: orderTitle } = ord.rows[0];
      const recipient = userId === client_id ? performer_id : client_id;
      await createNotification(
        recipient,
        'message',
        `Нова додаткова опція до замовлення "${orderTitle}"`,
        orderId
      );
    }
    res.status(201).json(option);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to propose option' });
  }
});

// PATCH /v1/orders/:orderId/options/:optionId - update option status
router.patch('/:optionId', async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const optionId = req.params.optionId;
  const userId = req.user!.id;
  const { status } = req.body as { status?: string };
  if (!['accepted', 'rejected'].includes(status!)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    // Update status
    const result = await query(
      `UPDATE order_additional_options SET status = $1, updated_at = NOW() WHERE id = $2 AND order_id = $3 RETURNING id, title, status, proposed_by AS "proposedBy", updated_at AS "updatedAt"`,
      [status, optionId, orderId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Option not found' });
    const updated = result.rows[0];
    // Notify proposer
    await createNotification(
      updated.proposedBy,
      'status_change',
      `Ваша опція "${updated.title}" була ${status}`,
      orderId
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update option' });
  }
});

export default router;
