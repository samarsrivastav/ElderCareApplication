/**
 * Application constants
 */

export const API_BASE_URL = 'http://localhost:5001/api';

export const ROOM_TYPES = {
  ASSISTED_LIVING: 'assisted_living',
  INDEPENDENT_LIVING: 'independent_living',
  MEMORY_CARE: 'memory_care',
  DAYCARE: 'daycare',
} as const;

export const OCCUPANCY_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  SHARED: 'shared',
} as const;

export const CARE_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const LENGTH_OF_STAY = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
} as const;

export const RATING_CATEGORIES = {
  LIFESTYLE: 'lifestyle',
  MEDICAL: 'medical',
  SERVICES: 'services',
  COMMUNITY: 'community',
} as const;

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
} as const;

export const SEARCH_DEBOUNCE_DELAY = 300;

export const COLORS = {
  PRIMARY: '#0ea5e9',
  PRIMARY_LIGHT: '#38bdf8',
  PRIMARY_DARK: '#0284c7',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  WHITE: '#ffffff',
  GRAY_50: '#f8fafc',
  GRAY_100: '#f1f5f9',
  GRAY_200: '#e2e8f0',
  GRAY_300: '#cbd5e1',
  GRAY_400: '#94a3b8',
  GRAY_500: '#64748b',
  GRAY_600: '#475569',
  GRAY_700: '#334155',
  GRAY_800: '#1e293b',
  GRAY_900: '#0f172a',
} as const;
