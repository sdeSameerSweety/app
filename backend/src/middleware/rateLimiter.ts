import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const identifier = req.ip || 'unknown';
  const now = Date.now();

  if (!store[identifier]) {
    store[identifier] = {
      count: 1,
      resetTime: now + config.rateLimit.windowMs,
    };
    next();
    return;
  }

  if (now > store[identifier].resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + config.rateLimit.windowMs,
    };
    next();
    return;
  }

  if (store[identifier].count >= config.rateLimit.maxRequests) {
    res.status(429).json({
      error: 'Too many requests, please try again later',
    });
    return;
  }

  store[identifier].count++;
  next();
};
