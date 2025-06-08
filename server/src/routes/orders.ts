import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';

const router = Router();

// All order routes require auth
router.use(authenticate);

// GET /v1/orders - fetch orders for authenticated user
// Query param role determines whether client or performer
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    // Fetch orders where user is client or performer
    const result = await query(
      `SELECT o.id, s.title, s.description, o.status, o.price, o.currency, o.deadline, o.created_at as "createdAt",
        u1.id as client_id, u1.name as client_name, u1.avatar_url as client_avatar, u1.rating as client_rating,
        u2.id as performer_id, u2.name as performer_name, u2.avatar_url as performer_avatar, u2.rating as performer_rating,
        c.name as category, 
        (SELECT COUNT(*) FROM messages m WHERE m.order_id = o.id AND m.receiver_id = $1 AND m.read = false) as "unreadMessages"
       FROM orders o
       JOIN users u1 ON o.client_id = u1.id
       JOIN users u2 ON o.performer_id = u2.id
       JOIN services s ON o.service_id = s.id
       JOIN service_categories c ON s.category_id = c.id
       WHERE o.client_id = $1 OR o.performer_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );
    const orders = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      price: Number(r.price),
      currency: r.currency,
      deadline: r.deadline,
      createdAt: r.createdAt,
      client: { id: r.client_id, name: r.client_name, avatar: r.client_avatar, rating: Number(r.client_rating) },
      performer: { id: r.performer_id, name: r.performer_name, avatar: r.performer_avatar, rating: Number(r.performer_rating) },
      category: r.category,
      unreadMessages: Number(r.unreadMessages)
    }));
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

export default router;
