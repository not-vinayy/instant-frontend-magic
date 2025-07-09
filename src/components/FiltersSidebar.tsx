import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { SearchFilters } from "@/types";
import { apiService } from "@/lib/api";

interface FiltersSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const [providers, setProviders] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.min_price || 0, 
    filters.max_price || 2500
  ]);
  const [cpuRange, setCpuRange] = useState<number[]>([
    filters.min_cpu || 0, 
    filters.max_cpu || 896
  ]);
  const [ramRange, setRamRange] = useState<number[]>([
    filters.min_ram || 0, 
    filters.max_ram || 35000
  ]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [providersData, locationsData] = await Promise.all([
        apiService.getProviders(),
        apiService.getFilters('locations')
      ]);
      
      setProviders(providersData);
      setLocations(locationsData.locations || []);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    updateFilter('min_price', values[0]);
    updateFilter('max_price', values[1]);
  };

  const handleCpuRangeChange = (values: number[]) => {
    setCpuRange(values);
    updateFilter('min_cpu', values[0]);
    updateFilter('max_cpu', values[1]);
  };

  const handleRamRangeChange = (values: number[]) => {
    setRamRange(values);
    updateFilter('min_ram', values[0]);
    updateFilter('max_ram', values[1]);
  };

  return (
    <Card className="w-80 bg-sidebar border-sidebar-border h-fit">
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Filters</h2>
        
        {/* Currency */}
        <div className="space-y-2">
          <Label className="text-sidebar-foreground">Currency</Label>
          <Select 
            value={filters.currency || "USD"} 
            onValueChange={(value) => updateFilter('currency', value)}
          >
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="CNY">CNY</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sidebar-foreground">Price</Label>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>¥{priceRange[0]}</span>
            <span className="flex-1"></span>
            <span>¥{priceRange[1]}</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={2500}
            min={0}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sidebar-foreground">Location</Label>
          <Select 
            value={filters.location || ""} 
            onValueChange={(value) => updateFilter('location', value)}
          >
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provider */}
        <div className="space-y-2">
          <Label className="text-sidebar-foreground">Provider</Label>
          <Select 
            value={filters.provider || ""} 
            onValueChange={(value) => updateFilter('provider', value)}
          >
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All providers</SelectItem>
              {providers.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Name Search */}
        <div className="space-y-2">
          <Label className="text-sidebar-foreground">Name</Label>
          <Input
            placeholder="Search..."
            value={filters.name || ""}
            onChange={(e) => updateFilter('name', e.target.value)}
            className="bg-input border-border"
          />
        </div>

        {/* CPU Range */}
        <div className="space-y-3">
          <Label className="text-sidebar-foreground">CPU</Label>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{cpuRange[0]}</span>
            <span className="flex-1"></span>
            <span>{cpuRange[1]}</span>
          </div>
          <Slider
            value={cpuRange}
            onValueChange={handleCpuRangeChange}
            max={896}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        {/* RAM Range */}
        <div className="space-y-3">
          <Label className="text-sidebar-foreground">RAM</Label>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{ramRange[0]} MB</span>
            <span className="flex-1"></span>
            <span>{ramRange[1] >= 1000 ? `${(ramRange[1]/1000).toFixed(1)} TB` : `${ramRange[1]} MB`}</span>
          </div>
          <Slider
            value={ramRange}
            onValueChange={handleRamRangeChange}
            max={35000}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}