import { Room, IRoom } from '../models/Room';

/**
 * Repository class for Room model operations
 */
export class RoomRepository {
  /**
   * Find room by ID
   * @param id - Room ID
   * @returns Promise<IRoom | null>
   */
  async findById(id: string): Promise<IRoom | null> {
    try {
      return await Room.findById(id);
    } catch (error) {
      throw new Error(`Error finding room by ID: ${error}`);
    }
  }

  /**
   * Find all rooms with pagination and filtering
   * @param options - Query options
   * @returns Promise<{ rooms: IRoom[]; total: number; page: number; limit: number }>
   */
  async findAll(options: {
    page?: number;
    limit?: number;
    city?: string;
    area?: string;
    roomType?: string;
    minRent?: number;
    maxRent?: number;
    minRating?: number;
    search?: string;
  } = {}): Promise<{ rooms: IRoom[]; total: number; page: number; limit: number }> {
    try {
      const { page = 1, limit = 10, city, area, roomType, minRent, maxRent, minRating, search } = options;
      const skip = (page - 1) * limit;

      // Build query
      const query: any = { isActive: true };
      
      if (city) query['location.city'] = { $regex: city, $options: 'i' };
      if (area) query['location.area'] = { $regex: area, $options: 'i' };
      if (roomType) query.roomType = roomType;
      if (minRent !== undefined || maxRent !== undefined) {
        query['pricing.rent'] = {};
        if (minRent !== undefined) query['pricing.rent'].$gte = minRent;
        if (maxRent !== undefined) query['pricing.rent'].$lte = maxRent;
      }
      if (minRating !== undefined) {
        query.$or = [
          { 'lifestyle.rating': { $gte: minRating } },
          { 'medical.rating': { $gte: minRating } },
          { 'services.rating': { $gte: minRating } },
          { 'community.rating': { $gte: minRating } }
        ];
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { facilityName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'location.city': { $regex: search, $options: 'i' } },
          { 'location.area': { $regex: search, $options: 'i' } }
        ];
      }

      const [rooms, total] = await Promise.all([
        Room.find(query)
          .sort({ 'lifestyle.rating': -1, 'pricing.rent': 1 })
          .skip(skip)
          .limit(limit),
        Room.countDocuments(query)
      ]);

      return {
        rooms,
        total,
        page,
        limit
      };
    } catch (error) {
      throw new Error(`Error finding rooms: ${error}`);
    }
  }

  /**
   * Find rooms for comparison
   * @param roomIds - Array of room IDs to compare
   * @returns Promise<IRoom[]>
   */
  async findForComparison(roomIds: string[]): Promise<IRoom[]> {
    try {
      return await Room.find({
        _id: { $in: roomIds },
        isActive: true
      }).sort({ 'lifestyle.rating': -1 });
    } catch (error) {
      throw new Error(`Error finding rooms for comparison: ${error}`);
    }
  }

  /**
   * Get room statistics
   * @returns Promise<{ totalRooms: number; averageRent: number; topRatedRooms: number }>
   */
  async getStatistics(): Promise<{ totalRooms: number; averageRent: number; topRatedRooms: number }> {
    try {
      const [totalRooms, averageRent, topRatedRooms] = await Promise.all([
        Room.countDocuments({ isActive: true }),
        Room.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, avgRent: { $avg: '$pricing.rent' } } }
        ]),
        Room.countDocuments({
          isActive: true,
          $or: [
            { 'lifestyle.rating': { $gte: 8 } },
            { 'medical.rating': { $gte: 8 } },
            { 'services.rating': { $gte: 8 } },
            { 'community.rating': { $gte: 8 } }
          ]
        })
      ]);

      return {
        totalRooms,
        averageRent: averageRent[0]?.avgRent || 0,
        topRatedRooms
      };
    } catch (error) {
      throw new Error(`Error getting room statistics: ${error}`);
    }
  }
}
