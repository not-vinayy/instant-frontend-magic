import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { FiltersSidebar } from "@/components/FiltersSidebar";
import { OffersTable } from "@/components/OffersTable";
import { Pagination } from "@/components/Pagination";
import { CloudOffer, SearchFilters, PaginatedResponse } from "@/types";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [offers, setOffers] = useState<CloudOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 50,
    total: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [filters, setFilters] = useState<SearchFilters>({
    currency: 'CNY',
    page: 1,
    limit: 50
  });

  const { toast } = useToast();

  // Load offers when filters change
  useEffect(() => {
    loadOffers();
  }, [filters]);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const response: PaginatedResponse<CloudOffer> = await apiService.getOffers('compute', filters);
      
      setOffers(response.data || []);
      setPagination({
        currentPage: response.page || 1,
        totalPages: Math.ceil((response.total || 0) / (response.limit || 50)),
        limit: response.limit || 50,
        total: response.total || 0,
        hasNext: response.has_next || false,
        hasPrev: response.has_prev || false
      });
    } catch (error) {
      console.error('Failed to load offers:', error);
      toast({
        title: "Error",
        description: "Failed to load offers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
      limit: filters.limit
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page
    });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({
      ...filters,
      limit,
      page: 1 // Reset to first page when limit changes
    });
  };

  const handleSelectOffer = (offerId: string) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedOffers(offers.map((offer, index) => offer.id || index.toString()));
    } else {
      setSelectedOffers([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="flex-shrink-0">
          <FiltersSidebar 
            filters={filters} 
            onFiltersChange={handleFiltersChange}
          />
        </div>
        
        <div className="flex-1 flex flex-col min-h-[calc(100vh-73px)]">
          <OffersTable
            offers={offers}
            loading={loading}
            selectedOffers={selectedOffers}
            onSelectOffer={handleSelectOffer}
            onSelectAll={handleSelectAll}
            totalOffers={pagination.total}
          />
          
          {offers.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              limit={pagination.limit}
              total={pagination.total}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
