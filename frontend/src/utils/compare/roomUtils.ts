import { Room } from '../../types/room';
import { CURRENCY_SYMBOLS } from '../../constants';

/**
 * Format price with currency symbol
 * @param amount - The amount to format
 * @param currency - The currency code
 * @returns Formatted price string
 */
export const formatPrice = (amount: number, currency: string): string => {
  const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || currency;
  return `${symbol}${amount.toLocaleString()}`;
};

/**
 * Get room type color for UI display
 * @param type - Room type string
 * @returns Color string for Ant Design components
 */
export const getRoomTypeColor = (type: string): string => {
  const colors = {
    assisted_living: 'blue',
    independent_living: 'green',
    memory_care: 'orange',
    daycare: 'purple',
  };
  return colors[type as keyof typeof colors] || 'default';
};

/**
 * Get care level color for UI display
 * @param level - Care level string
 * @returns Color string for Ant Design components
 */
export const getCareLevelColor = (level: string): string => {
  const colors = {
    high: 'red',
    medium: 'orange',
    low: 'green',
  };
  return colors[level as keyof typeof colors] || 'default';
};

/**
 * Prepare chart data for comparison visualization
 * @param rooms - Array of rooms to compare
 * @returns Chart data array
 */
export const prepareChartData = (rooms: Room[]) => {
  return rooms.map(room => ({
    name: room.name.length > 15 ? room.name.substring(0, 15) + '...' : room.name,
    lifestyle: room.lifestyle.rating,
    medical: room.medical.rating,
    services: room.services.rating,
    community: room.community.rating,
    overall: room.overallRating,
  }));
};

/**
 * Filter rooms based on search query
 * @param rooms - Array of rooms to filter
 * @param searchQuery - Search query string
 * @returns Filtered rooms array
 */
export const filterRoomsBySearch = (rooms: Room[], searchQuery: string): Room[] => {
  if (!searchQuery) return rooms;
  
  return rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.location.area.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

/**
 * Create search options for AutoComplete component
 * @param rooms - Array of rooms
 * @returns Search options array
 */
export const createSearchOptions = (rooms: Room[]) => {
  return rooms.map(room => ({
    value: room.name,
    label: room.name,
    room: room
  }));
};

/**
 * Check if two rooms can be compared
 * @param roomA - First room
 * @param roomB - Second room
 * @returns Boolean indicating if rooms can be compared
 */
export const canCompareRooms = (roomA: Room | null, roomB: Room | null): boolean => {
  return roomA !== null && roomB !== null && roomA.id !== roomB.id;
};
