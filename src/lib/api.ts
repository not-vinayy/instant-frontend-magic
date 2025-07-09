import { CloudOffer, FilterOptions, PaginatedResponse, SearchFilters } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

// Mock data for demo purposes
const mockOffers: CloudOffer[] = [
  { id: '1', name: 't4g.nano Linux', provider: 'AWS', cpu: 2, ram: '536 MB', disk: '0 MB', bandwidth: '0 MBps', network_speed: '625 MBps', location: 'us-east-1', price: 0.0185, currency: 'CNY', offer_type: 'compute' },
  { id: '2', name: 't4g.nano SUSE', provider: 'AWS', cpu: 2, ram: '536 MB', disk: '0 MB', bandwidth: '0 MBps', network_speed: '625 MBps', location: 'us-east-1', price: 0.0185, currency: 'CNY', offer_type: 'compute' },
  { id: '3', name: 't3a.nano Linux', provider: 'AWS', cpu: 2, ram: '536 MB', disk: '0 MB', bandwidth: '0 MBps', network_speed: '625 MBps', location: 'us-west-2', price: 0.0216, currency: 'CNY', offer_type: 'compute' },
];

class ApiService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed, using mock data:', error);
      throw error;
    }
  }

  async getOffers(offerType: string, filters: SearchFilters = {}): Promise<PaginatedResponse<CloudOffer>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const url = `${API_BASE_URL}/offers/${offerType}?${params.toString()}`;
      return this.fetchWithErrorHandling<PaginatedResponse<CloudOffer>>(url);
    } catch (error) {
      // Return mock data if API fails
      return {
        data: mockOffers,
        total: 6773,
        page: 1,
        limit: 50,
        has_next: true,
        has_prev: false
      };
    }
  }

  async getProviders(): Promise<string[]> {
    try {
      const url = `${API_BASE_URL}/providers`;
      const response = await this.fetchWithErrorHandling<any>(url);
      return response.providers || [];
    } catch (error) {
      return ['AWS', 'Google Cloud', 'Azure'];
    }
  }

  async getCompanies(): Promise<any[]> {
    try {
      const url = `${API_BASE_URL}/companies`;
      return this.fetchWithErrorHandling<any[]>(url);
    } catch (error) {
      return [];
    }
  }

  async getFilters(filterType: string, params: Record<string, any> = {}): Promise<any> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${API_BASE_URL}/filters/${filterType}?${searchParams.toString()}`;
      return this.fetchWithErrorHandling<any>(url);
    } catch (error) {
      if (filterType === 'locations') {
        return { locations: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'] };
      }
      return {};
    }
  }
}

export const apiService = new ApiService();