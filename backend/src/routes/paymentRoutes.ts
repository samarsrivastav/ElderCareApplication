import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const router = Router();

/**
 * @route POST /api/payments/submit
 * @desc Submit payment details
 * @access Public
 */
router.post('/submit', paymentController.submitPayment);

/**
 * @route GET /api/payments/:id
 * @desc Get payment by ID
 * @access Public (in real app, this should be protected)
 */
router.get('/:id', paymentController.getPayment);

/**
 * @route GET /api/payments
 * @desc Get all payments (admin only)
 * @access Admin
 */
router.get('/', paymentController.getAllPayments);

/**
 * @route PUT /api/payments/:id/status
 * @desc Update payment status
 * @access Admin
 */
router.put('/:id/status', paymentController.updatePaymentStatus);

export default router;
