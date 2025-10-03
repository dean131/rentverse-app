import { PropertyPublic } from '@/lib/definitions';
import { PropertyCardImage } from './property-card/PropertyCardImage';
import { PropertyCardInfo } from './property-card/PropertyCardInfo';
import { PropertyCardStats } from './property-card/PropertyCardStats';
import Link from 'next/link';

interface PropertyCardProps {
  property: PropertyPublic;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link href={`/properties/${property.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <PropertyCardImage property={property} />
        <PropertyCardInfo property={property} />
        <PropertyCardStats property={property} />
      </div>
    </Link>
  );
};
