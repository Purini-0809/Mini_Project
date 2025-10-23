export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    HEALTH: '/health',
    PROPERTY_ESTIMATE: '/api/property/estimate',
  }
} as const;
