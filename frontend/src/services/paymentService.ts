/**
 * Payment form data interface
 */
export interface PaymentFormData {
  roomId: string;
  roomName: string;
  paymentType: 'buy' | 'rent';
  amount: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  transactionId: string;
}

/**
 * Payment response interface
 */
interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Payment service class
 */
class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.PROD
      ? 'https://your-production-api.com/api'
      : 'http://localhost:5001/api';
  }

  /**
   * Submit payment details
   * @param paymentData - Payment form data
   * @returns Promise<PaymentResponse>
   */
  async submitPayment(paymentData: PaymentFormData): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit payment');
      }

      return data;
    } catch (error) {
      console.error('Payment service error:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   * @param paymentId - Payment ID
   * @returns Promise<PaymentResponse>
   */
  async getPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch payment');
      }

      return data;
    } catch (error) {
      console.error('Payment service error:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
