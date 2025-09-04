import { Room } from '../../types/room';
import { formatPrice } from './roomUtils';

/**
 * Create comparison table columns configuration
 * @param rooms - Array of rooms to compare
 * @returns Table columns configuration
 */
export const createComparisonColumns = (rooms: Room[]) => {
  return [
    {
      title: 'Feature',
      dataIndex: 'feature',
      key: 'feature',
      width: 150,
      fixed: 'left' as const,
    },
    ...rooms.map(room => ({
      title: room.name,
      dataIndex: room.id,
      key: room.id,
      width: 200,
    })),
  ];
};

/**
 * Create comparison table data
 * @param rooms - Array of rooms to compare
 * @returns Table data array
 */
export const createComparisonTableData = (rooms: Room[]) => {
  return [
    {
      key: 'overall-rating',
      feature: 'Overall Rating',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = room.overallRating;
        return acc;
      }, {} as any),
    },
    {
      key: 'lifestyle-rating',
      feature: 'Lifestyle Rating',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = room.lifestyle.rating;
        return acc;
      }, {} as any),
    },
    {
      key: 'medical-rating',
      feature: 'Medical Rating',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = room.medical.rating;
        return acc;
      }, {} as any),
    },
    {
      key: 'services-rating',
      feature: 'Services Rating',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = room.services.rating;
        return acc;
      }, {} as any),
    },
    {
      key: 'community-rating',
      feature: 'Community Rating',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = room.community.rating;
        return acc;
      }, {} as any),
    },
    {
      key: 'rent',
      feature: 'Monthly Rent',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = formatPrice(room.pricing.rent, room.pricing.currency);
        return acc;
      }, {} as any),
    },
    {
      key: 'total-cost',
      feature: 'Total Cost',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = formatPrice(room.totalCost, room.pricing.currency);
        return acc;
      }, {} as any),
    },
    {
      key: 'room-type',
      feature: 'Room Type',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = room.roomType.replace('_', ' ');
        return acc;
      }, {} as any),
    },
    {
      key: 'care-level',
      feature: 'Care Level',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = room.careLevel;
        return acc;
      }, {} as any),
    },
    {
      key: 'occupancy',
      feature: 'Occupancy',
      ...rooms.reduce((acc, room) => {
        acc[room.id] = room.occupancy;
        return acc;
      }, {} as any),
    },
  ];
};

/**
 * Calculate comparison summary statistics
 * @param rooms - Array of rooms to compare
 * @returns Summary statistics object
 */
export const calculateComparisonSummary = (rooms: Room[]) => {
  const prices = rooms.map(room => room.totalCost);
  const ratings = rooms.map(room => room.overallRating);
  
  return {
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
    },
    ratingRange: {
      min: Math.min(...ratings),
      max: Math.max(...ratings),
      average: Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10,
    },
    totalRooms: rooms.length,
  };
};
