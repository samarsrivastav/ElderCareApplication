import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getUsersByRole 
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin, Caregiver)
 */
router.get('/', authorize(['admin', 'caregiver']), getAllUsers);

/**
 * @route   GET /api/users/role/:role
 * @desc    Get users by specific role
 * @access  Private (Admin, Caregiver)
 */
router.get('/role/:role', authorize(['admin', 'caregiver']), getUsersByRole);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin, Caregiver, or self)
 */
router.get('/:id', (req, res, next) => {
  // Allow users to access their own profile or admins/caregivers to access any profile
  if (req.user!['id'] === req.params['id'] || ['admin', 'caregiver'].includes(req.user!['role'])) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access denied. Insufficient permissions.',
        statusCode: 403
      }
    });
  }
}, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID
 * @access  Private (Admin, Caregiver, or self)
 */
router.put('/:id', (req, res, next) => {
  // Allow users to update their own profile or admins/caregivers to update any profile
  if (req.user!['id'] === req.params['id'] || ['admin', 'caregiver'].includes(req.user!['role'])) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access denied. Insufficient permissions.',
        statusCode: 403
      }
    });
  }
}, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID
 * @access  Private (Admin only)
 */
router.delete('/:id', authorize(['admin']), deleteUser);

export default router;
