import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { app as expressApp } from './app';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config({ path: '.env' });

const app = expressApp as express.Express;
const PORT = process.env['PORT'] || 5001;

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to database
let isConnected = false;

/**
 * Ensures database connection is established
 */
const ensureDbConnection = async (): Promise<void> => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

/**
 * Serverless handler for Vercel
 */
export default async (req: any, res: any) => {
  await ensureDbConnection();
  return app(req, res);
};

/**
 * Starts the HTTP server for local development.
 */
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start server only if not in serverless environment
if (require.main === module) {
  startServer();
}
