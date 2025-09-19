import nodemailer from 'nodemailer';

/**
 * Email service for sending emails using Brevo SMTP
 */
class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      const smtpConfig = {
        host: process.env['SMTP_HOST'],
        port: parseInt(process.env['SMTP_PORT'] || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env['SMTP_USER'],
          pass: process.env['SMTP_PASS'],
        },
      };
      
      
      this.transporter = nodemailer.createTransport(smtpConfig);
    }
    return this.transporter;
  }

  /**
   * Send contact form confirmation email to user
   * @param to - Recipient email address
   * @param name - User's name
   * @param subject - Contact form subject
   * @param message - Contact form message
   */
  async sendContactConfirmation(
    to: string,
    name: string,
    subject: string,
    message: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env['SMTP_FROM'],
      to: to,
      subject: 'Thank you for contacting AGEVAA - We\'ll be in touch soon!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🏠 AGEVAA</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Senior Living Solutions</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1e293b; margin-top: 0;">Thank you for reaching out, ${name}!</h2>
            
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              We have received your message and truly appreciate you taking the time to contact us. 
              Our team is committed to providing the best elder care services and will review your inquiry carefully.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e293b; margin-top: 0;">Your Message Details:</h3>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0;"><strong>Message:</strong></p>
              <p style="background: #f1f5f9; padding: 15px; border-radius: 5px; margin: 10px 0; color: #475569;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            </div>
            
            <p style="color: #475569; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              • Our team will review your message within 24 hours<br>
              • We'll respond to your inquiry as soon as possible<br>
              • If urgent, please call us directly at our emergency line
            </p>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Need immediate assistance?</h3>
              <p style="color: #1e40af; margin: 5px 0;">
                📞 Emergency Line: <strong>+1 (555) 123-4567</strong><br>
                📧 Email: <strong>support@eldercare.com</strong><br>
                🌐 Website: <strong>www.eldercare.com</strong>
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 30px;">
              This is an automated confirmation. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.getTransporter().sendMail(mailOptions);
      console.log(`Contact confirmation email sent to ${to}`);
    } catch (error) {
      console.error('Error sending contact confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }

  /**
   * Send contact form notification to admin
   * @param contactData - Contact form data
   */
  async sendContactNotification(contactData: {
    name: string;
    email: string;
    phone?: string | undefined;
    subject: string;
    message: string;
  }): Promise<void> {
    const mailOptions = {
      from: process.env['SMTP_FROM'],
      to: process.env['ADMIN_EMAIL'] || 'admin@agevaa.com', // Admin email
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0;">🚨 New Contact Form Submission</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1e293b; margin-top: 0;">Contact Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${contactData.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${contactData.email}</p>
              ${contactData.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
              <p style="margin: 5px 0;"><strong>Message:</strong></p>
              <p style="background: #f1f5f9; padding: 15px; border-radius: 5px; margin: 10px 0; color: #475569;">
                ${contactData.message.replace(/\n/g, '<br>')}
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; text-align: center;">
              Please respond to this inquiry as soon as possible.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.getTransporter().sendMail(mailOptions);
      console.log(`Contact notification email sent to admin`);
    } catch (error) {
      console.error('Error sending contact notification email:', error);
      // Don't throw error for admin notification to avoid breaking user experience
    }
  }

  /**
   * Send payment confirmation email to customer
   * @param paymentData - Payment confirmation data
   */
  async sendPaymentConfirmation(paymentData: {
    to: string;
    customerName: string;
    roomName: string;
    paymentType: string;
    amount: number;
    currency: string;
    transactionId: string;
  }): Promise<void> {
    const { to, customerName, roomName, paymentType, amount, currency, transactionId } = paymentData;
    
    const formatPrice = (amount: number, currency: string): string => {
      const symbols: { [key: string]: string } = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        INR: '₹',
      };
      const symbol = symbols[currency] || currency;
      return `${symbol}${amount.toLocaleString()}`;
    };

    const mailOptions = {
      from: process.env['SMTP_FROM'],
      to,
      subject: `Payment Confirmation - ${roomName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🏠 AGEVAA</h1>
              <h2 style="color: #16a34a; margin: 10px 0 0 0; font-size: 24px;">Payment Received!</h2>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 25px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0;">Dear ${customerName},</h3>
              <p style="color: #374151; margin: 0; line-height: 1.6;">
                Thank you for choosing AGEVAA! We have received your payment details and are processing your ${paymentType === 'buy' ? 'purchase' : 'rental'} request.
              </p>
            </div>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">📋 Payment Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Room:</td>
                  <td style="padding: 8px 0; color: #374151; font-weight: 600;">${roomName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Type:</td>
                  <td style="padding: 8px 0; color: #374151; font-weight: 600; text-transform: capitalize;">${paymentType}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Amount:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 18px;">${formatPrice(amount, currency)}${paymentType === 'rent' ? '/month' : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Transaction ID:</td>
                  <td style="padding: 8px 0; color: #374151; font-weight: 600; font-family: monospace;">${transactionId}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">⏳ What's Next?</h3>
              <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Our team will verify your payment within 24-48 hours</li>
                <li>You will receive a confirmation email once verified</li>
                <li>We will contact you shortly to discuss next steps</li>
                <li>Keep your transaction ID safe for future reference</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0;">Need help? Contact us:</p>
              <p style="color: #2563eb; margin: 0; font-weight: 600;">
                📧 support@eldercare.com | 📞 +1 (555) 123-4567
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.getTransporter().sendMail(mailOptions);
      console.log(`Payment confirmation email sent to ${to}`);
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
      throw new Error('Failed to send payment confirmation email');
    }
  }

  /**
   * Send payment notification to admin
   * @param paymentData - Payment notification data
   */
  async sendPaymentNotification(paymentData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    roomName: string;
    paymentType: string;
    amount: number;
    currency: string;
    transactionId: string;
  }): Promise<void> {
    const { customerName, customerEmail, customerPhone, roomName, paymentType, amount, currency, transactionId } = paymentData;
    
    const formatPrice = (amount: number, currency: string): string => {
      const symbols: { [key: string]: string } = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        INR: '₹',
      };
      const symbol = symbols[currency] || currency;
      return `${symbol}${amount.toLocaleString()}`;
    };

    const mailOptions = {
      from: process.env['SMTP_FROM'],
      to: process.env['ADMIN_EMAIL'] || 'admin@agevaa.com', // Admin email
      subject: `New Payment Submission - ${roomName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">💰 New Payment Submission</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            ${customerPhone ? `<p><strong>Phone:</strong> ${customerPhone}</p>` : ''}
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Payment Details</h3>
            <p><strong>Room:</strong> ${roomName}</p>
            <p><strong>Type:</strong> ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}</p>
            <p><strong>Amount:</strong> ${formatPrice(amount, currency)}${paymentType === 'rent' ? '/month' : ''}</p>
            <p><strong>Transaction ID:</strong> <code>${transactionId}</code></p>
          </div>

          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px;">
            <p style="color: #dc2626; margin: 0; font-weight: 600;">
              ⚠️ Action Required: Please verify this payment and update the status in the admin panel.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.getTransporter().sendMail(mailOptions);
      console.log(`Payment notification email sent to admin`);
    } catch (error) {
      console.error('Error sending payment notification email:', error);
      // Don't throw error for admin notification to avoid breaking user experience
    }
  }

  /**
   * Verify email service connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.getTransporter().verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
