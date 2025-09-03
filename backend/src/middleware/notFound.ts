import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle 404 errors for undefined routes
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function
 */
export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      statusCode: 404
    }
  });
};
