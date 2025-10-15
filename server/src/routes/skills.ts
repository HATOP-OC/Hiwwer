import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';

const router = Router();

// GET /v1/skills - get all skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name, slug FROM skills ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
});

// GET /v1/users/:userId/skills - get skills for a specific user
router.get('/users/:userId/skills', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await query(
      `SELECT s.id, s.name, s.slug
       FROM skills s
       JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = $1
       ORDER BY s.name`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user skills' });
  }
});

// PUT /v1/profile/skills - update skills for the current user
router.put('/profile/skills', authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { skillIds } = req.body;

  if (!Array.isArray(skillIds)) {
    return res.status(400).json({ message: 'skillIds must be an array' });
  }

  try {
    // Start a transaction
    await query('BEGIN');

    // Delete existing skills for the user
    await query('DELETE FROM user_skills WHERE user_id = $1', [userId]);

    // Insert new skills
    if (skillIds.length > 0) {
      const values = skillIds.map((skillId, index) => `($1, $${index + 2})`).join(',');
      await query(`INSERT INTO user_skills (user_id, skill_id) VALUES ${values}`, [userId, ...skillIds]);
    }

    // Commit the transaction
    await query('COMMIT');

    res.json({ success: true, message: 'Skills updated successfully' });
  } catch (err) {
    await query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Failed to update skills' });
  }
});

export default router;