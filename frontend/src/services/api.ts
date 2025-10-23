import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface PropertyData {
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt?: number;
  propertyType?: string;
  condition?: string;
}

export interface ValuationResult {
  estimatedPrice: number;
  confidence: number;
  priceRange: {
    low: number;
    high: number;
  };
  marketTrend: "up" | "stable" | "down";
  dataCompleteness: number;
  calculatedAt: string;
}

export const api = {
  async estimateProperty(data: PropertyData): Promise<ValuationResult> {
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.PROPERTY_ESTIMATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to estimate property');
    }

    return response.json();
  },

  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    const response = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }
};
