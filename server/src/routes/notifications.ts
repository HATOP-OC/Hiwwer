import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';

const router = Router();
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
