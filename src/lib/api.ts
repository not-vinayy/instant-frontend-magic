import { CloudOffer, FilterOptions, PaginatedResponse, SearchFilters } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getOffers(offerType: string, filters: SearchFilters = {}): Promise<PaginatedResponse<CloudOffer>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/offers/${offerType}?${params.toString()}`;
    return this.fetchWithErrorHandling<PaginatedResponse<CloudOffer>>(url);
  }

  async getProviders(): Promise<string[]> {
    const url = `${API_BASE_URL}/providers`;
    const response = await this.fetchWithErrorHandling<any>(url);
    return response.providers || [];
  }

  async getCompanies(): Promise<any[]> {
    const url = `${API_BASE_URL}/companies`;
    return this.fetchWithErrorHandling<any[]>(url);
  }

  async getFilters(filterType: string, params: Record<string, any> = {}): Promise<any> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/filters/${filterType}?${searchParams.toString()}`;
    return this.fetchWithErrorHandling<any>(url);
  }
}

export const apiService = new ApiService();