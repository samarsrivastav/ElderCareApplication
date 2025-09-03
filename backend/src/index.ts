import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import roomRoutes from './routes/roomRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'),
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'),
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/rooms', roomRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'ElderCare API is running' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env['NODE_ENV']}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🏠 Room API: http://localhost:${PORT}/api/rooms`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
