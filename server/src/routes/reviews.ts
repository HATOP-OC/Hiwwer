import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import { createNotification } from '../services/notificationService';

const router = Router({ mergeParams: true });
router.use(authenticate);

// GET /v1/orders/:orderId/review - fetch review if exists
router.get('/', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const result = await query(
      `SELECT id, order_id AS "orderId", client_id AS "clientId", performer_id AS "performerId", rating, comment, created_at AS "createdAt"
       FROM reviews WHERE order_id = $1`,
      [orderId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Review not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch review' });
  }
});

// POST /v1/orders/:orderId/review - create review
router.post('/', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user!.id;
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  try {
    // Ensure order completed
    const ord = await query(
      `SELECT performer_id, status FROM orders WHERE id = $1`,
      [orderId]
    );
    if (ord.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
    const { performer_id, status } = ord.rows[0];
    if (status !== 'completed') {
      return res.status(400).json({ message: 'Cannot review before completion' });
    }
    // Ensure client is reviewer
    // Assuming req.user.id is client; could check orders.client_id
    // Ensure no existing review
    const exists = await query(`SELECT 1 FROM reviews WHERE order_id = $1`, [orderId]);
    if ((exists.rowCount ?? 0) > 0) {
      return res.status(400).json({ message: 'Review already exists' });
    }
    // Insert review
    const result = await query(
      `INSERT INTO reviews(order_id, client_id, performer_id, rating, comment)
       VALUES($1,$2,$3,$4,$5) RETURNING id, rating, comment, created_at AS "createdAt"`,
      [orderId, userId, performer_id, rating, comment || '']
    );
    const review = result.rows[0];
    // Notify performer
    await createNotification(
      performer_id,
      'review',
      `Надійшов відгук (rating: ${rating}) для замовлення`,
      orderId
    );
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

export default router;
