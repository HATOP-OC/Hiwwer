import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';

const router = Router();

// GET /v1/performers - public list of performers
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.avatar_url as avatar, u.rating
       FROM users u WHERE role = 'performer'`);
    res.json(result.rows.map(r => ({ id: r.id, name: r.name, avatar_url: r.avatar, rating: Number(r.rating) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch performers' });
  }
});

export default router;
