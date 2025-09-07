import { Request, Response } from 'express';
import { emailService } from '../services/emailService';

/**
 * Contact form submission interface
 */
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Contact controller for handling contact form submissions
 */
export class ContactController {
  /**
   * Submit contact form
   * @param req - Express request object
   * @param res - Express response object
   */
  async submitContactForm(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, subject, message }: ContactFormData = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields. Please provide name, email, subject, and message.',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
        return;
      }

      // Validate message length
      if (message.length < 10) {
        res.status(400).json({
          success: false,
          message: 'Message must be at least 10 characters long.',
        });
        return;
      }

      // Send confirmation email to user
      await emailService.sendContactConfirmation(email, name, subject, message);

      // Send notification email to admin
      const notificationData: {
        name: string;
        email: string;
        phone?: string | undefined;
        subject: string;
        message: string;
      } = {
        name,
        email,
        subject,
        message,
      };
      
      if (phone) {
        notificationData.phone = phone;
      }
      
      await emailService.sendContactNotification(notificationData);

      res.status(200).json({
        success: true,
        message: 'Thank you for your message! We have sent a confirmation email and will get back to you soon.',
        data: {
          name,
          email,
          subject,
          submittedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request. Please try again later.',
      });
    }
  }

  /**
   * Test email service connection
   * @param req - Express request object
   * @param res - Express response object
   */
  async testEmailService(_req: Request, res: Response): Promise<void> {
    try {
      const isConnected = await emailService.verifyConnection();
      
      if (isConnected) {
        res.status(200).json({
          success: true,
          message: 'Email service is working correctly.',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Email service connection failed.',
        });
      }
    } catch (error) {
      console.error('Error testing email service:', error);
      res.status(500).json({
        success: false,
        message: 'Error testing email service.',
      });
    }
  }
}

export const contactController = new ContactController();
