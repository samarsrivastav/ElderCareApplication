import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../services/jwtService';
import { Admin } from '../models/Admin';

/**
 * Admin authentication middleware
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function
 */
export const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    // Verify token
    const decoded = jwtService.verifyToken(token);
    
    // Check if it's an admin token
    if (decoded.type !== 'admin') {
      res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
      return;
    }

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.adminId).select('-password');
    if (!admin || !admin.isActive) {
      res.status(401).json({
        success: false,
        message: 'Admin not found or inactive'
      });
      return;
    }

    // Add admin info to request
    (req as any).adminId = (admin._id as any).toString();
    (req as any).admin = admin;

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Super admin authorization middleware
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function
 */
export const superAdminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const admin = (req as any).admin;
    
    if (!admin || admin.role !== 'super_admin') {
      res.status(403).json({
        success: false,
        message: 'Super admin access required'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Super admin auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
