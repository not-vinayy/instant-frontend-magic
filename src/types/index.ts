export interface CloudOffer {
  id: string;
  name: string;
  provider: string;
  cpu: number;
  ram: string;
  disk: string;
  bandwidth: string;
  network_speed: string;
  location: string;
  price: number;
  currency: string;
  offer_type: string;
}

export interface FilterOptions {
  providers: string[];
  locations: string[];
  currencies: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SearchFilters {
  currency?: string;
  min_price?: number;
  max_price?: number;
  location?: string;
  provider?: string;
  name?: string;
  min_cpu?: number;
  max_cpu?: number;
  min_ram?: number;
  max_ram?: number;
  page?: number;
  limit?: number;
}