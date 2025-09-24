import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import { app } from '../src/app';
import { connectDB } from '../src/config/database';

/**
 * Vercel serverless handler wrapping the Express app.
 * - Bypasses DB connection for /api/health
 * - Uses basePath '/api' so Express routes like '/health' match '/api/health'
 */
let isConnected = false;
const handlerFn = serverless(app, { basePath: '/api' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';

  // Fast health check without DB
  if (url.startsWith('/api/health')) {
    res.status(200).json({ status: 'OK', message: 'ElderCare API is running' });
    return;
  }

  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return handlerFn(req as any, res as any);
}
