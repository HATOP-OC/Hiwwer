import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { query } from './db';
import bcrypt from 'bcrypt';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { config } from './config/config';
import { scheduleAttachmentCleanup } from './services/cleanupService';

// Routes
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import servicesRouter from './routes/services';
import performersRouter from './routes/performers';
import ordersRouter from './routes/orders';
import messagesRouter from './routes/messages';
import notificationsRouter from './routes/notifications';
import adminRouter from './routes/admin';
import orderOptionsRouter from './routes/orderOptions';
import orderAttachmentsRouter from './routes/orderAttachments';
import paymentsRouter from './routes/payments';
import reviewsRouter from './routes/reviews';
import disputesRouter from './routes/disputes';

const app = express();

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

// Middleware
// CORS для API: дозволяємо Authorization та Content-Type, всі методи
app.use(cors({
  origin: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));
// Preflight
app.options('*', cors());
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
app.use('/v1/performers', performersRouter);
// Chat messages under orders
app.use('/v1/orders/:orderId/messages', messagesRouter);
app.use('/v1/orders/:orderId/options', orderOptionsRouter);
app.use('/v1/notifications', notificationsRouter);
app.use('/v1/orders', ordersRouter);

// Admin routes
app.use('/v1/admin', adminRouter);

// Order attachments, payments and reviews routes
app.use('/v1/orders/:orderId/attachments', orderAttachmentsRouter);
app.use('/v1/orders/:orderId/payments', paymentsRouter);
app.use('/v1/orders/:orderId/review', reviewsRouter);
app.use('/v1/orders/:orderId/disputes', disputesRouter);

// Error handler
interface ErrorWithStatus extends Error { status?: number }
const isErrorWithStatus = (error: unknown): error is ErrorWithStatus =>
  typeof error === 'object' && error !== null && 'status' in error && typeof (error as any).status === 'number';
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  const status = isErrorWithStatus(error) && typeof error.status === 'number' ? error.status : 500;
  const message = error instanceof Error ? error.message : 'Internal Server Error';
  console.error(error);
  res.status(status).json({ message });
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
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`Admin init error for ${email}:`, msg);
    }
  }
};

// Start server only after initializing all admins
initAdmin().then(() => {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`API server running at http://0.0.0.0:${config.port}/v1`);
    // Запускаємо очищення файлів за TTL
    scheduleAttachmentCleanup();
  });
});
