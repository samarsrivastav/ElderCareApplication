import { AdminResponse, AdminLoginData } from '../types/blog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Admin service for API interactions
 */
class AdminService {
  private getAuthToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Admin login
   * @param loginData - Login credentials
   * @returns Promise with login result
   */
  async login(loginData: AdminLoginData): Promise<AdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      if (data.data.token) {
        localStorage.setItem('adminToken', data.data.token);
      }

      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  /**
   * Get admin profile
   * @returns Promise with admin profile
   */
  async getProfile(): Promise<AdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Get all contacts
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise with contacts
   */
  async getContacts(page: number = 1, limit: number = 10): Promise<AdminResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/contacts?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contacts');
      }

      return data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  /**
   * Get contact by ID
   * @param id - Contact ID
   * @returns Promise with contact
   */
  async getContactById(id: string): Promise<AdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch contact');
      }

      return data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  /**
   * Delete contact
   * @param id - Contact ID
   * @returns Promise with deletion result
   */
  async deleteContact(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete contact');
      }

      return data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   * @returns Promise with dashboard stats
   */
  async getDashboardStats(): Promise<AdminResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Logout admin
   */
  logout(): void {
    localStorage.removeItem('adminToken');
  }

  /**
   * Check if admin is authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const adminService = new AdminService();
