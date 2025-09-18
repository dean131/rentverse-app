// File Path: apps/frontend/src/components/home/property-card/PropertyCardImage.tsx
import Image from 'next/image';
import { PropertyPublic } from '@/lib/definitions';
import { ListingTypeTag } from './ListingTypeTag'; // Import the new component

interface Props {
  property: Pick<PropertyPublic, 'title' | 'images' | 'listingType'>;
}

export const PropertyCardImage = ({ property }: Props) => {
  const imageUrl = property.images?.[0]?.imageUrl || 'https://placehold.co/600x400/FCCC99/FFFFFF/jpg?text=Rentverse';

  return (
    <div className="relative h-56">
      <Image
        src={imageUrl}
        alt={`Image of ${property.title}`}
        layout="fill"
        objectFit="cover"
      />
      <ListingTypeTag listingType={property.listingType} />
    </div>
  );
};

