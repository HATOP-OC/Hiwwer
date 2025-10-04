import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from '../db';
import { config } from '../config/config';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashed, role]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ ...user, token });
  } catch (error: unknown) {
    const pgError = error as { code?: string };
    if (pgError.code === '23505') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const message = error instanceof Error ? error.message : 'Server error';
    console.error(error);
    res.status(500).json({ message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }
  try {
    const result = await query('SELECT id, name, email, password_hash, role FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, token });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    console.error(error);
    res.status(500).json({ message });
  }
});

// Generate Telegram Linking Code
router.post('/generate-telegram-link-code', authenticate, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Invalidate any existing codes for this user
    await query('DELETE FROM telegram_linking_codes WHERE user_id = $1', [userId]);

    const code = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8-character hex code
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    await query(
      'INSERT INTO telegram_linking_codes (user_id, code, expires_at) VALUES ($1, $2, $3)',
      [userId, code, expiresAt]
    );

    res.json({ code });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    console.error('Error generating Telegram link code:', error);
    res.status(500).json({ message });
  }
});

// Link Telegram Account
router.post('/link-telegram-account', async (req: Request, res: Response) => {
  const { code, telegramId, telegramUsername, chatId } = req.body;
  if (!code || !telegramId || !chatId) {
    return res.status(400).json({ message: 'Missing required fields: code, telegramId, chatId' });
  }

  try {
    const result = await query(
      'SELECT user_id, expires_at FROM telegram_linking_codes WHERE code = $1',
      [code]
    );
    const linkingCode = result.rows[0];

    if (!linkingCode) {
      return res.status(404).json({ message: 'Invalid or expired code' });
    }

    if (new Date() > new Date(linkingCode.expires_at)) {
      await query('DELETE FROM telegram_linking_codes WHERE code = $1', [code]);
      return res.status(410).json({ message: 'Code has expired' });
    }

    const userId = linkingCode.user_id;

    // Check if another user is already linked to this telegramId
    const existingUserResult = await query('SELECT id FROM users WHERE telegram_id = $1 AND id != $2', [telegramId, userId]);
    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({ message: 'This Telegram account is already linked to another user.' });
    }

    await query(
      'UPDATE users SET telegram_id = $1, telegram_username = $2, telegram_chat_id = $3 WHERE id = $4',
      [telegramId, telegramUsername, chatId, userId]
    );

    await query('DELETE FROM telegram_linking_codes WHERE code = $1', [code]);

    res.json({ message: 'Account linked successfully' });
  } catch (error: unknown) {
    const pgError = error as { code?: string };
    if (pgError.code === '23505') { // unique_violation
        return res.status(409).json({ message: 'This Telegram account is already linked to another user.' });
    }
    const message = error instanceof Error ? error.message : 'Server error';
    console.error('Error linking Telegram account:', error);
    res.status(500).json({ message });
  }
});

// Login with Telegram
router.post('/login-with-telegram', async (req: Request, res: Response) => {
  const { telegramId } = req.body;
  if (!telegramId) {
    return res.status(400).json({ message: 'Missing telegramId' });
  }

  try {
    const result = await query('SELECT id, name, email, role FROM users WHERE telegram_id = $1', [telegramId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found for this Telegram ID' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, token });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    console.error('Error during Telegram login:', error);
    res.status(500).json({ message });
  }
});

export default router;