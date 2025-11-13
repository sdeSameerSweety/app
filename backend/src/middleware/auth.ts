import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import prisma from '../config/database';

export interface JwtPayload {
  userId: string;
  email: string;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const checkSubscriptionTier = (requiredTier: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const tierHierarchy: { [key: string]: number } = {
      FREE: 0,
      STUDENT_PREMIUM: 1,
      PROFESSIONAL_PREMIUM: 2,
      ENTERPRISE_PREMIUM: 3,
    };

    if (tierHierarchy[req.user.subscriptionTier] < tierHierarchy[requiredTier]) {
      res.status(403).json({ error: 'Subscription upgrade required' });
      return;
    }

    next();
  };
};

export const checkVerificationLevel = (requiredLevel: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const levelHierarchy: { [key: string]: number } = {
      LEVEL_1: 1,
      LEVEL_2: 2,
      LEVEL_3: 3,
      LEVEL_4: 4,
    };

    if (levelHierarchy[req.user.verificationLevel] < levelHierarchy[requiredLevel]) {
      res.status(403).json({ error: 'Higher verification level required' });
      return;
    }

    next();
  };
};
