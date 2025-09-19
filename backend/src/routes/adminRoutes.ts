import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

/**
 * Admin authentication routes
 */
router.post('/login', adminController.login);
router.get('/profile', adminAuth, adminController.getProfile);

/**
 * Contact management routes
 */
router.get('/contacts', adminAuth, adminController.getContacts);
router.get('/contacts/:id', adminAuth, adminController.getContactById);
router.delete('/contacts/:id', adminAuth, adminController.deleteContact);

/**
 * Dashboard routes
 */
router.get('/dashboard/stats', adminAuth, adminController.getDashboardStats);

export default router;
