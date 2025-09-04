import { Router } from 'express';
import { 
  getRoomDetails, 
  getAllRooms, 
  compareRooms 
} from '../controllers/roomController';
import { seedRooms } from '../utils/sampleData';

const router = Router();

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms with filtering and pagination
 * @access  Public
 */
router.get('/', getAllRooms);

/**
 * @route   GET /api/rooms/:id
 * @desc    Get room details by ID
 * @access  Public
 */
router.get('/:id', getRoomDetails);

/**
 * @route   POST /api/rooms/compare
 * @desc    Compare two or more rooms
 * @access  Public
 */
router.post('/compare', compareRooms);

/**
 * @route   POST /api/rooms/seed
 * @desc    Seed database with sample room data (Development only)
 * @access  Public
 */
router.post('/seed', async (_req, res) => {
  try {
    await seedRooms();
    res.status(200).json({
      success: true,
      message: 'Sample rooms seeded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding rooms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
