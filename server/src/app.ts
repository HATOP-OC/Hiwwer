import express, { Request, Response, NextFunction } from 'express';
import { query } from './db';
import bcrypt from 'bcrypt';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { config } from './config/config';

// Routes
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import servicesRouter from './routes/services';
import performersRouter from './routes/performers';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Health check
app.get('/v1/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: Date.now() });
});

// Public routes
app.use('/v1/auth', authRouter);
app.use('/v1/services', servicesRouter);

// Protected routes
app.use('/v1/users', usersRouter);
app.use('/v1/admin', adminRouter);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Initialize default admin users from ENV if provided
const initAdmin = async () => {
  const admins = config.admins;
  if (!Array.isArray(admins) || admins.length === 0) return;
  for (const { email, password, name } of admins) {
    if (!email || !password) continue;
    try {
      const hash = await bcrypt.hash(password, 10);
      await query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE
           SET name = EXCLUDED.name,
               password_hash = EXCLUDED.password_hash,
               role = 'admin'`,
        [name, email, hash, 'admin']
      );
      console.log(`Admin upserted: ${email}`);
    } catch (err) {
      console.error(`Admin init error for ${email}:`, err);
    }
  }
};

// Start server only after initializing all admins
initAdmin().then(() => {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`API server running at http://0.0.0.0:${config.port}/v1`);
  });
});
