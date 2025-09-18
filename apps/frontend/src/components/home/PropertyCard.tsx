// File Path: apps/frontend/src/components/home/PropertyCard.tsx
import { PropertyPublic } from '@/lib/definitions';
import { PropertyCardImage } from './property-card/PropertyCardImage';
import { PropertyCardInfo } from './property-card/PropertyCardInfo';
import { PropertyCardStats } from './property-card/PropertyCardStats';

interface PropertyCardProps {
  property: PropertyPublic;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
      <PropertyCardImage property={property} />
      <PropertyCardInfo property={property} />
      <PropertyCardStats property={property} />
    </div>
  );
};

