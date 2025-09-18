// File Path: apps/frontend/src/components/home/property-card/ListingTypeTag.tsx
import { PropertyPublic } from '@/lib/definitions';

interface Props {
  listingType: PropertyPublic['listingType'];
}

export const ListingTypeTag = ({ listingType }: Props) => {
  const label = listingType === 'RENT' ? 'For Rent' : 'For Sale';
  
  return (
    // UPDATED: Reverted from bg-brandOrange to bg-orange-500
    <div className="absolute top-4 left-4 bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
      {label}
    </div>
  );
};

