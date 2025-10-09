import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const router = Router();

// Get user by telegram_id (for bot authentication)
router.get('/by-telegram/:telegram_id', async (req: Request, res: Response) => {
    const { telegram_id } = req.params;
    try {
        const result = await query(
            'SELECT id, name, email, role, avatar_url as avatar, bio, rating, telegram_id as "telegramId", telegram_chat_id as "telegramChatId", language_code as "languageCode", is_performer as "isPerformer" FROM users WHERE telegram_id = $1',
            [telegram_id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        // Generate a token for the bot to use on behalf of the user
        const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
        res.json({ ...user, token });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch user by Telegram ID';
        console.error(error);
        res.status(500).json({ message });
    }
});

// Get current user profile
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await query(
      'SELECT id, name, email, role, avatar_url as avatar, bio, rating, telegram_id as "telegramId", telegram_chat_id as "telegramChatId", language_code as "languageCode", is_performer as "isPerformer" FROM users WHERE id = $1',
      [userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    console.error(error);
    res.status(500).json({ message });
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    console.error(error);
    res.status(500).json({ message });
  }
});

// Link telegram account
router.patch('/profile/link-telegram', authenticate, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { telegram_id, telegram_chat_id } = req.body;

    if (!telegram_id || !telegram_chat_id) {
        return res.status(400).json({ message: 'Missing telegram_id or telegram_chat_id' });
    }

    try {
        await query(
            'UPDATE users SET telegram_id = $1, telegram_chat_id = $2, updated_at = NOW() WHERE id = $3',
            [telegram_id, telegram_chat_id, userId]
        );
        res.json({ success: true, message: 'Telegram account linked successfully' });
    } catch (error: unknown) {
        const pgError = error as { code?: string };
        if (pgError.code === '23505') { // unique_violation
            return res.status(409).json({ message: 'This Telegram account is already linked to another user.' });
        }
        const message = error instanceof Error ? error.message : 'Failed to link Telegram account';
        console.error(error);
        res.status(500).json({ message });
    }
});

// Update user language
router.patch('/profile/language', authenticate, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { languageCode } = req.body;

    if (!languageCode) {
        return res.status(400).json({ message: 'Missing languageCode' });
    }

    try {
        await query(
            'UPDATE users SET language_code = $1, updated_at = NOW() WHERE id = $2',
            [languageCode, userId]
        );
        res.json({ success: true, message: 'Language updated successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update language';
        console.error(error);
        res.status(500).json({ message });
    }
});

// Activate performer mode (simple activation without additional data)
router.post('/activate-performer', authenticate, async (req: Request, res: Response) => {
    const userId = req.user!.id;

    try {
        // Simply set is_performer to true
        await query(
            'UPDATE users SET is_performer = TRUE, updated_at = NOW() WHERE id = $1',
            [userId]
        );

        // Return updated user data
        const result = await query(
            'SELECT id, name, email, role, avatar_url as avatar, bio, rating, telegram_id as "telegramId", telegram_chat_id as "telegramChatId", language_code as "languageCode", is_performer as "isPerformer" FROM users WHERE id = $1',
            [userId]
        );

        res.json({ 
            success: true, 
            message: 'Performer mode activated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to activate performer mode';
        console.error(error);
        res.status(500).json({ message });
    }
});

export default router;