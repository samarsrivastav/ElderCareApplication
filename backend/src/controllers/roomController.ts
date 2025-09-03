import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { RoomRepository } from '../repositories/roomRepository';

/**
 * Get room details by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getRoomDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new AppError('Room ID is required', 400);
    }
    
    const roomRepository = new RoomRepository();
    const room = await roomRepository.findById(id);

    if (!room) {
      throw new AppError('Room not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        room: {
          id: room._id,
          name: room.name,
          facilityName: room.facilityName,
          location: room.location,
          pricing: room.pricing,
          roomType: room.roomType,
          occupancy: room.occupancy,
          lengthOfStay: room.lengthOfStay,
          careLevel: room.careLevel,
          description: room.description,
          medicalServices: room.medicalServices,
          lifestyle: room.lifestyle,
          medical: room.medical,
          services: room.services,
          community: room.community,
          facilities: room.facilities,
          images: room.images,
          contactInfo: room.contactInfo,
          overallRating: room.overallRating,
          totalCost: room.totalCost,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all rooms with filtering and pagination
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAllRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      city, 
      area, 
      roomType, 
      minRent, 
      maxRent, 
      minRating, 
      search 
    } = req.query;
    
    const roomRepository = new RoomRepository();
    
    // Build options object with only defined values
    const options: any = {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    };
    
    if (city) options.city = city as string;
    if (area) options.area = area as string;
    if (roomType) options.roomType = roomType as string;
    if (minRent) options.minRent = parseInt(minRent as string);
    if (maxRent) options.maxRent = parseInt(maxRent as string);
    if (minRating) options.minRating = parseInt(minRating as string);
    if (search) options.search = search as string;
    
    const result = await roomRepository.findAll(options);

    // Get statistics for the current query
    const stats = await roomRepository.getStatistics();

    res.status(200).json({
      success: true,
      data: {
        rooms: result.rooms.map(room => ({
          id: room._id,
          name: room.name,
          facilityName: room.facilityName,
          location: room.location,
          pricing: room.pricing,
          roomType: room.roomType,
          occupancy: room.occupancy,
          careLevel: room.careLevel,
          lifestyle: room.lifestyle,
          medical: room.medical,
          services: room.services,
          community: room.community,
          overallRating: room.overallRating,
          images: room.images.slice(0, 3) // Show only first 3 images in list
        })),
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit)
        },
        statistics: stats
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compare two or more rooms
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const compareRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roomIds } = req.body;
    
    if (!roomIds || !Array.isArray(roomIds) || roomIds.length < 2) {
      throw new AppError('At least 2 room IDs are required for comparison', 400);
    }

    if (roomIds.length > 5) {
      throw new AppError('Cannot compare more than 5 rooms at once', 400);
    }
    
    const roomRepository = new RoomRepository();
    const rooms = await roomRepository.findForComparison(roomIds);

    if (rooms.length < 2) {
      throw new AppError('At least 2 valid rooms are required for comparison', 400);
    }

    // Create comparison data
    const comparison = {
      rooms: rooms.map(room => ({
        id: room._id,
        name: room.name,
        facilityName: room.facilityName,
        location: room.location,
        pricing: room.pricing,
        roomType: room.roomType,
        occupancy: room.occupancy,
        careLevel: room.careLevel,
        lifestyle: room.lifestyle,
        medical: room.medical,
        services: room.services,
        community: room.community,
        overallRating: room.overallRating,
        totalCost: room.totalCost,
        facilities: room.facilities,
        medicalServices: room.medicalServices
      })),
      summary: {
        totalRooms: rooms.length,
        priceRange: {
          min: Math.min(...rooms.map(r => r.pricing.rent)),
          max: Math.max(...rooms.map(r => r.pricing.rent)),
          average: Math.round(rooms.reduce((sum, r) => sum + r.pricing.rent, 0) / rooms.length)
        },
        ratingComparison: {
          lifestyle: rooms.map(r => ({ id: r._id, name: r.name, rating: r.lifestyle.rating })),
          medical: rooms.map(r => ({ id: r._id, name: r.name, rating: r.medical.rating })),
          services: rooms.map(r => ({ id: r._id, name: r.name, rating: r.services.rating })),
          community: rooms.map(r => ({ id: r._id, name: r.name, rating: r.community.rating })),
          overall: rooms.map(r => ({ id: r._id, name: r.name, rating: r.overallRating }))
        }
      }
    };

    res.status(200).json({
      success: true,
      data: comparison
    });
  } catch (error) {
    next(error);
  }
};
