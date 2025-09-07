import axios from 'axios';
import { API_BASE_URL } from '../constants';

/**
 * Room service for API interactions
 */
class RoomService {
  private baseURL = `${API_BASE_URL}/rooms`;

  /**
   * Get all rooms with filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with rooms data
   */
  async getAllRooms(params: {
    page?: number;
    limit?: number;
    city?: string;
    area?: string;
    roomType?: string;
    minRent?: number;
    maxRent?: number;
    minRating?: number;
    search?: string;
  } = {}) {
    try {
      const response = await axios.get(this.baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  /**
   * Get room details by ID
   * @param id - Room ID
   * @returns Promise with room details
   */
  async getRoomById(id: string) {
    try {
      const response = await axios.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room details:', error);
      throw error;
    }
  }

  /**
   * Compare multiple rooms
   * @param roomIds - Array of room IDs to compare
   * @returns Promise with comparison data
   */
  async compareRooms(roomIds: string[]) {
    try {
      const response = await axios.post(`${this.baseURL}/compare`, {
        roomIds,
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing rooms:', error);
      throw error;
    }
  }

  /**
   * Seed database with sample data (development only)
   * @returns Promise with seeding result
   */
  async seedRooms() {
    try {
      const response = await axios.post(`${this.baseURL}/seed`);
      return response.data;
    } catch (error) {
      console.error('Error seeding rooms:', error);
      throw error;
    }
  }
}

export const roomService = new RoomService();
