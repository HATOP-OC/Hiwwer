import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../@types';

type JwtPayload = {
  id: string;
  role: string;
};

// Authenticate JWT and attach user payload
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(`[AUTH] Missing or invalid Authorization header for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    // Create a minimal user object that matches User interface requirements
    req.user = {
      id: payload.id,
      role: payload.role as 'client' | 'performer' | 'admin',
      email: '', // Will be populated from DB if needed
      name: '', // Will be populated from DB if needed
      createdAt: new Date() // Will be populated from DB if needed
    };
    next();
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Invalid token';
    console.warn(`[AUTH] Invalid token for ${req.method} ${req.originalUrl}: ${msg}`);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Authorize only admins
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    console.warn(`[AUTHZ] No user payload for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.role !== 'admin') {
    console.warn(`[AUTHZ] Forbidden: user ${req.user.id} with role ${req.user.role} attempted to access ${req.method} ${req.originalUrl}`);
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
