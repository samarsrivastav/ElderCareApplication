import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { UserRepository } from '../repositories/userRepository';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
    
    // Get user from database
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found.', 401);
    }

    // Check if user is still active
    if (!user.isActive) {
      throw new AppError('User account is deactivated.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid token.', 401));
    }
  }
};

/**
 * Middleware to check if user has required role
 * @param roles - Array of allowed roles
 * @returns Express middleware function
 */
export const authorize = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Access denied. User not authenticated.', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('Access denied. Insufficient permissions.', 403));
      return;
    }

    next();
  };
};
