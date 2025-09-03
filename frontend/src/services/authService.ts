import axios from 'axios';

/**
 * API base URL configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Response interface for API calls
 */
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * User interface for authentication responses
 */
interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  fullName?: string;
}

/**
 * Authentication response interface
 */
interface AuthResponse {
  user: AuthUser;
  token: string;
}

/**
 * Authentication service class
 */
class AuthService {
  /**
   * User login
   * @param email - User email
   * @param password - User password
   * @returns Promise<ApiResponse<AuthResponse>>
   */
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error?.message || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * User registration
   * @param userData - User registration data
   * @returns Promise<ApiResponse<AuthResponse>>
   */
  async register(userData: any): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error?.message || 'Registration failed');
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get current user profile
   * @param token - JWT token
   * @returns Promise<ApiResponse<AuthUser>>
   */
  async getProfile(token: string): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await apiClient.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error?.message || 'Failed to get profile');
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Logout user
   * @param token - JWT token
   * @returns Promise<ApiResponse>
   */
  async logout(token: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.error?.message || 'Logout failed');
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Set authentication token for future requests
   * @param token - JWT token
   */
  setAuthToken(token: string): void {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }
}

export const authService = new AuthService();
