/**
 * Room-related type definitions
 */

export interface Location {
  city: string;
  area: string;
  address: string;
}

export interface Pricing {
  rent: number;
  securityDeposit: number;
  admissionCharge?: number;
  pettyCashReserve?: number;
  currency: string;
}

export interface RatingCategory {
  rating: number;
  amenities?: string[];
  services?: string[];
  offerings?: string[];
  activities?: string[];
}

export interface Facilities {
  sharedSpaces: string[];
  safetyFeatures: string[];
  accessibility: string[];
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

export interface Room {
  id: string;
  name: string;
  facilityName: string;
  location: Location;
  pricing: Pricing;
  roomType: 'assisted_living' | 'independent_living' | 'memory_care' | 'daycare';
  occupancy: 'single' | 'double' | 'shared';
  lengthOfStay: 'short' | 'medium' | 'long';
  careLevel: 'high' | 'medium' | 'low';
  description: string;
  medicalServices: string[];
  lifestyle: RatingCategory;
  medical: RatingCategory;
  services: RatingCategory;
  community: RatingCategory;
  facilities: Facilities;
  images: string[];
  contactInfo: ContactInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  overallRating: number;
  totalCost: number;
}

export interface RoomListResponse {
  success: boolean;
  data: {
    rooms: Room[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    statistics: {
      totalRooms: number;
      averageRating: number;
      priceRange: {
        min: number;
        max: number;
      };
      roomTypeDistribution: Record<string, number>;
    };
  };
}

export interface RoomDetailsResponse {
  success: boolean;
  data: {
    room: Room;
  };
}

export interface RoomComparisonResponse {
  success: boolean;
  data: {
    rooms: Room[];
    summary: {
      totalRooms: number;
      priceRange: {
        min: number;
        max: number;
        average: number;
      };
      ratingComparison: {
        lifestyle: Array<{ id: string; name: string; rating: number }>;
        medical: Array<{ id: string; name: string; rating: number }>;
        services: Array<{ id: string; name: string; rating: number }>;
        community: Array<{ id: string; name: string; rating: number }>;
        overall: Array<{ id: string; name: string; rating: number }>;
      };
    };
  };
}

export interface RoomFilters {
  city?: string;
  area?: string;
  roomType?: string;
  minRent?: number;
  maxRent?: number;
  minRating?: number;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
