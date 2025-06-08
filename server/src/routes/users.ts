import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import bcrypt from 'bcrypt';

const router = Router();

// Get current user profile
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await query(
      'SELECT id, name, email, role, avatar_url as avatar, bio, rating, telegram_id as "telegramId" FROM users WHERE id = $1',
      [userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update current user profile
router.put('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, bio, avatar } = req.body;
    await query(
      'UPDATE users SET name = $1, bio = $2, avatar_url = $3, updated_at = NOW() WHERE id = $4',
      [name, bio, avatar, userId]
    );
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;
