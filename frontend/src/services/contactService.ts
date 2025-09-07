/**
 * Contact service for handling contact form API calls
 */

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    email: string;
    subject: string;
    submittedAt: string;
  };
}

/**
 * Contact service class
 */
class ContactService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.com/api' 
      : 'http://localhost:5001/api';
  }

  /**
   * Submit contact form
   * @param formData - Contact form data
   * @returns Promise with contact response
   */
  async submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      return result;
    } catch (error) {
      console.error('Contact form submission error:', error);
      throw error;
    }
  }

  /**
   * Test email service connection
   * @returns Promise with test result
   */
  async testEmailService(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/contact/test-email`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Email service test failed');
      }

      return result;
    } catch (error) {
      console.error('Email service test error:', error);
      throw error;
    }
  }
}

export const contactService = new ContactService();
