import { Request, Response, NextFunction } from 'express';
import { User } from '../@types';

// Ensure user is client
export const authorizeClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'client') return res.status(403).json({ message: 'Forbidden: clients only' });
  next();
};

// Ensure user is performer
export const authorizePerformer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'performer') return res.status(403).json({ message: 'Forbidden: performers only' });
  next();
};
