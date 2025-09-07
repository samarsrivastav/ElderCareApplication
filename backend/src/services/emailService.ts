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
      subject: 'Thank you for contacting ElderCare - We\'ll be in touch soon!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🏥 ElderCare</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Compassionate Care for Your Loved Ones</p>
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
      to: 'admin@eldercare.com', // Admin email
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
