import { useState } from "react";
import { CloudOffer } from "@/types";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown,
  MapPin,
  ExternalLink
} from "lucide-react";

interface OffersTableProps {
  offers: CloudOffer[];
  loading?: boolean;
  selectedOffers: string[];
  onSelectOffer: (offerId: string) => void;
  onSelectAll: (selected: boolean) => void;
  totalOffers: number;
}

type SortField = 'name' | 'cpu' | 'ram' | 'price' | 'location' | 'bandwidth';
type SortDirection = 'asc' | 'desc';

export function OffersTable({ 
  offers, 
  loading, 
  selectedOffers, 
  onSelectOffer, 
  onSelectAll,
  totalOffers 
}: OffersTableProps) {
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const formatPrice = (price: number, currency: string = 'CNY') => {
    if (currency === 'CNY') return `¥${price}`;
    if (currency === 'USD') return `$${price}`;
    if (currency === 'EUR') return `€${price}`;
    return `${price} ${currency}`;
  };

  const getProviderLogo = (provider: string) => {
    const lowerProvider = provider.toLowerCase();
    if (lowerProvider.includes('aws') || lowerProvider.includes('amazon')) {
      return (
        <div className="w-5 h-5 bg-aws rounded text-white text-xs flex items-center justify-center font-bold">
          aws
        </div>
      );
    }
    return (
      <div className="w-5 h-5 bg-muted rounded text-xs flex items-center justify-center">
        {provider.substring(0, 2).toLowerCase()}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="flex-1 bg-card border-border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading offers...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 bg-card border-border">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              {totalOffers.toLocaleString()} offers found
            </h1>
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
              ⚠️ Change currency to USD to see more offers.
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-table-border bg-table-header">
                <th className="text-left p-3 w-12">
                  <Checkbox
                    checked={selectedOffers.length === offers.length && offers.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 h-auto p-0 text-foreground hover:text-primary"
                  >
                    <span>Name</span>
                    {getSortIcon('name')}
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('cpu')}
                    className="flex items-center space-x-1 h-auto p-0 text-foreground hover:text-primary"
                  >
                    <span>CPU</span>
                    {getSortIcon('cpu')}
                  </Button>
                </th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('ram')}
                    className="flex items-center space-x-1 h-auto p-0 text-foreground hover:text-primary"
                  >
                    <span>RAM</span>
                    {getSortIcon('ram')}
                  </Button>
                </th>
                <th className="text-left p-3">Disk</th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('bandwidth')}
                    className="flex items-center space-x-1 h-auto p-0 text-foreground hover:text-primary"
                  >
                    <span>Bandwidth</span>
                    {getSortIcon('bandwidth')}
                  </Button>
                </th>
                <th className="text-left p-3">Network Speed</th>
                <th className="text-left p-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('location')}
                    className="flex items-center space-x-1 h-auto p-0 text-foreground hover:text-primary"
                  >
                    <span>Location</span>
                    {getSortIcon('location')}
                  </Button>
                </th>
                <th className="text-right p-3">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('price')}
                    className="flex items-center justify-end space-x-1 h-auto p-0 text-foreground hover:text-primary"
                  >
                    <span>Price</span>
                    {getSortIcon('price')}
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => (
                <tr 
                  key={offer.id || index}
                  className="border-b border-table-border hover:bg-table-row-hover transition-colors"
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedOffers.includes(offer.id || index.toString())}
                      onCheckedChange={() => onSelectOffer(offer.id || index.toString())}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {getProviderLogo(offer.provider)}
                      <span className="font-medium text-foreground">{offer.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-foreground">{offer.cpu}</td>
                  <td className="p-3 text-foreground">{offer.ram}</td>
                  <td className="p-3 text-foreground">{offer.disk}</td>
                  <td className="p-3 text-foreground">{offer.bandwidth}</td>
                  <td className="p-3 text-foreground">{offer.network_speed}</td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1 h-auto p-1 text-primary hover:text-primary-hover"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{offer.location}</span>
                    </Button>
                  </td>
                  <td className="p-3 text-right">
                    <Badge className="bg-price-badge text-price-badge-foreground">
                      {formatPrice(offer.price, offer.currency)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {offers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No offers found matching your criteria.</p>
          </div>
        )}
      </div>
    </Card>
  );
}