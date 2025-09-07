import { message } from 'antd';
import { contactService } from '../../services/contactService';

/**
 * Contact form data interface
 */
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/**
 * Handle contact form submission
 * @param formData - Form data to submit
 * @returns Promise that resolves when submission is complete
 */
export const handleContactFormSubmit = async (formData: ContactFormData): Promise<void> => {
  try {
    // Prepare data for backend API
    const submitData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    };

    // Use contact service to submit form
    const result = await contactService.submitContactForm(submitData);

    if (result.success) {
      message.success(result.message || 'Thank you for your message! We have sent a confirmation email and will get back to you soon.');
    } else {
      throw new Error(result.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
    message.error(errorMessage);
    throw error;
  }
};

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param phone - Phone number string to validate
 * @returns Boolean indicating if phone is valid
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9]\d{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Format phone number for display
 * @param phone - Raw phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const phoneRegex = /^(\d{3})(\d{3})(\d{4})$/;
  const match = phoneRegex.exec(cleaned);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};
