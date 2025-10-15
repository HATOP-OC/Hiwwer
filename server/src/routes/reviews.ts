import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import { createNotification } from '../services/notificationService';

const router = Router({ mergeParams: true });
router.use(authenticate);

// GET /v1/orders/:orderId/review - fetch reviews for an order
router.get('/', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user!.id;
  
  try {
    const result = await query(
      `SELECT r.id, r.order_id AS "orderId", r.client_id AS "clientId", r.performer_id AS "performerId", 
              r.rating, r.comment, r.created_at AS "createdAt", r.reviewer_id AS "reviewerId", 
              r.review_type AS "reviewType"
       FROM reviews r WHERE r.order_id = $1`,
      [orderId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// POST /v1/orders/:orderId/review - create review (both directions)
router.post('/', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user!.id;
  const { rating, comment } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  
  try {
    // Get order details
    const ord = await query(
      `SELECT client_id, performer_id, status FROM orders WHERE id = $1`,
      [orderId]
    );
    
    if (ord.rowCount === 0) return res.status(404).json({ message: 'Order not found' });
    
    const { client_id, performer_id, status } = ord.rows[0];
    
    if (status !== 'completed') {
      return res.status(400).json({ message: 'Cannot review before completion' });
    }
    
    // Determine review type and who is being reviewed
    let reviewType: string;
    let reviewedUserId: string;
    
    if (userId === client_id) {
      // Client is reviewing performer
      reviewType = 'client_to_performer';
      reviewedUserId = performer_id;
    } else if (userId === performer_id) {
      // Performer is reviewing client
      reviewType = 'performer_to_client';
      reviewedUserId = client_id;
    } else {
      return res.status(403).json({ message: 'You are not part of this order' });
    }
    
    // Check if user already left a review
    const exists = await query(
      `SELECT 1 FROM reviews WHERE order_id = $1 AND reviewer_id = $2`,
      [orderId, userId]
    );
    
    if ((exists.rowCount ?? 0) > 0) {
      return res.status(400).json({ message: 'You already reviewed this order' });
    }
    
    // Insert review
    const result = await query(
      `INSERT INTO reviews(order_id, client_id, performer_id, rating, comment, reviewer_id, review_type)
       VALUES($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, rating, comment, created_at AS "createdAt", review_type AS "reviewType"`,
      [orderId, client_id, performer_id, rating, comment || '', userId, reviewType]
    );
    
    const review = result.rows[0];
    
    // Notify the reviewed user
    await createNotification(
      reviewedUserId,
      'review',
      `Надійшов новий відгук (рейтинг: ${rating})`,
      orderId
    );
    
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

export default router;
