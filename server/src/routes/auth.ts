import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { config } from '../config/config';

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

export default router;
