// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
export const API_ENDPOINTS = {
  PLACED_ITEMS: '/x3pl/razmeshennye',
} as const;

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Table Configuration
export const TABLE = {
  SORT_DIRECTIONS: ['asc', 'desc'] as const,
} as const;

// Export Configuration
export const EXPORT = {
  FILENAME_PREFIX: 'inventory_export',
  DATE_FORMAT: 'YYYY-MM-DD_HH-mm-ss',
} as const; 