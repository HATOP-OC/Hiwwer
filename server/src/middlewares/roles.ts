import { Request, Response, NextFunction } from 'express';
import { User } from '../@types';

// Ensure user is authenticated (any authenticated user can be a client)
export const authorizeClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  // Будь-який автентифікований користувач може бути клієнтом
  // (навіть performer може замовляти послуги)
  next();
};

// Ensure user is performer
export const authorizePerformer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'performer') return res.status(403).json({ message: 'Forbidden: performers only' });
  next();
};
