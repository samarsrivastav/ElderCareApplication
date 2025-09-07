import { Router } from 'express';
import { contactController } from '../controllers/contactController';

const router = Router();

/**
 * Contact form routes
 */
router.post('/submit', contactController.submitContactForm.bind(contactController));
router.get('/test-email', contactController.testEmailService.bind(contactController));

export default router;
