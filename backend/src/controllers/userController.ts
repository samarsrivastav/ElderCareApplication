import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { UserRepository } from '../repositories/userRepository';

/**
 * Zod schema for user update validation
 */
const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name cannot exceed 50 characters').optional(),
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
  }).optional(),
  isActive: z.boolean().optional()
});

/**
 * Get all users with pagination and filtering
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, role, isActive, search } = req.query;
    
    const userRepository = new UserRepository();
    const result = await userRepository.findAll({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      role: role as string,
      isActive: isActive === 'true',
      search: search as string
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new AppError('User ID is required', 400);
    }
    
    const userRepository = new UserRepository();
    const user = await userRepository.findById(id);

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
 * Update user by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new AppError('User ID is required', 400);
    }
    
    // Validate request body
    const validatedData = updateUserSchema.parse(req.body);

    const userRepository = new UserRepository();

    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Update user
    const updatedUser = await userRepository.updateById(id, validatedData);

    if (!updatedUser) {
      throw new AppError('Failed to update user', 500);
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          phoneNumber: updatedUser.phoneNumber,
          dateOfBirth: updatedUser.dateOfBirth,
          address: updatedUser.address,
          emergencyContact: updatedUser.emergencyContact,
          fullName: updatedUser.fullName,
          isActive: updatedUser.isActive,
          lastLogin: updatedUser.lastLogin,
          emailVerified: updatedUser.emailVerified,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
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
 * Delete user by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new AppError('User ID is required', 400);
    }
    
    const userRepository = new UserRepository();

    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Prevent self-deletion
    if (id === req.user!.id) {
      throw new AppError('Cannot delete your own account', 400);
    }

    // Delete user
    const deleted = await userRepository.deleteById(id);

    if (!deleted) {
      throw new AppError('Failed to delete user', 500);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get users by role
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getUsersByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.params;
    
    if (!role) {
      throw new AppError('Role is required', 400);
    }
    
    const userRepository = new UserRepository();
    const users = await userRepository.findByRole(role);

    res.status(200).json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          isActive: user.isActive,
          createdAt: user.createdAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
