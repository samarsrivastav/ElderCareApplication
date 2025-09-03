import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { UserRepository } from '../repositories/userRepository';

/**
 * Zod schema for user registration validation
 */
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name cannot exceed 50 characters'),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['admin', 'caregiver', 'family_member', 'patient']).default('family_member'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional().transform(val => val ? new Date(val) : undefined),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('USA')
  }).optional(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phoneNumber: z.string(),
    email: z.string().email().optional()
  }).optional()
});

/**
 * Zod schema for user login validation
 */
const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required')
});

/**
 * Generate JWT token for user
 * @param userId - User ID
 * @returns string - JWT token
 */
const generateToken = (userId: string): string => {
  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  return jwt.sign(
    { id: userId },
    secret
  );
};

/**
 * User registration controller
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    const userRepository = new UserRepository();

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(validatedData.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Create new user
    const user = await userRepository.create(validatedData);

    // Generate token
    const token = generateToken((user._id as any).toString());

    // Update last login
    await userRepository.updateLastLogin((user._id as any).toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        },
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      next(new AppError(`Validation failed: ${JSON.stringify(validationErrors)}`, 400));
    } else {
      next(error);
    }
  }
};

/**
 * User login controller
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    const userRepository = new UserRepository();

    // Find user by email
    const user = await userRepository.findByEmail(validatedData.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    // Update last login
    await userRepository.updateLastLogin((user._id as any).toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        },
        token
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      next(new AppError(`Validation failed: ${JSON.stringify(validationErrors)}`, 400));
    } else {
      next(error);
    }
  }
};

/**
 * Get current user profile controller
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userRepository = new UserRepository();
    const user = await userRepository.findById(req.user!.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          emergencyContact: user.emergencyContact,
          fullName: user.fullName,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout controller (client-side token removal)
 * @param _req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};
