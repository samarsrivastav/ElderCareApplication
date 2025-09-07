import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { emailService } from '../services/emailService';

/**
 * Payment controller class
 */
class PaymentController {
  /**
   * Submit payment details
   * @param req - Express request object
   * @param res - Express response object
   */
  async submitPayment(req: Request, res: Response): Promise<void> {
    try {
      const {
        roomId,
        roomName,
        paymentType,
        amount,
        currency,
        customerName,
        customerPhone,
        customerEmail,
        transactionId,
      } = req.body;

      // Validate required fields
      if (!roomId || !roomName || !paymentType || !amount || !customerName || !customerEmail || !transactionId) {
        res.status(400).json({
          success: false,
          message: 'All required fields must be provided',
        });
        return;
      }

      // Validate payment type
      if (!['buy', 'rent'].includes(paymentType)) {
        res.status(400).json({
          success: false,
          message: 'Payment type must be either "buy" or "rent"',
        });
        return;
      }

      // Validate amount
      if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({
          success: false,
          message: 'Amount must be a positive number',
        });
        return;
      }

      // Check if transaction ID already exists
      const existingPayment = await Payment.findOne({ transactionId });
      if (existingPayment) {
        res.status(409).json({
          success: false,
          message: 'Transaction ID already exists',
        });
        return;
      }

      // Create new payment record
      const payment = new Payment({
        roomId,
        roomName,
        paymentType,
        amount,
        currency: currency || 'USD',
        customerName,
        customerPhone,
        customerEmail,
        transactionId,
      });

      await payment.save();

      // Send confirmation email to customer
      try {
        await emailService.sendPaymentConfirmation({
          to: customerEmail,
          customerName,
          roomName,
          paymentType,
          amount,
          currency: currency || 'USD',
          transactionId,
        });
      } catch (emailError) {
        console.error('Error sending payment confirmation email:', emailError);
        // Don't fail the payment submission if email fails
      }

      // Send notification email to admin
      try {
        await emailService.sendPaymentNotification({
          customerName,
          customerEmail,
          customerPhone,
          roomName,
          paymentType,
          amount,
          currency: currency || 'USD',
          transactionId,
        });
      } catch (emailError) {
        console.error('Error sending payment notification email:', emailError);
        // Don't fail the payment submission if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Payment details submitted successfully',
        data: {
          paymentId: payment._id,
          status: payment.status,
        },
      });
    } catch (error) {
      console.error('Error processing payment submission:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * Get payment by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  async getPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const payment = await Payment.findById(id);
      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
        return;
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * Get all payments (admin only)
   * @param req - Express request object
   * @param res - Express response object
   */
  async getAllPayments(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const skip = (page - 1) * limit;

      const payments = await Payment.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Payment.countDocuments();

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * Update payment status
   * @param req - Express request object
   * @param res - Express response object
   */
  async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'verified', 'rejected'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be pending, verified, or rejected',
        });
        return;
      }

      const payment = await Payment.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!payment) {
        res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: payment,
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

export const paymentController = new PaymentController();
