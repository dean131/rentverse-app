import Image from 'next/image';
import { PropertyPublic } from '@/lib/definitions';
import { ListingTypeTag } from './ListingTypeTag'; // Import the new component

interface Props {
  property: Pick<PropertyPublic, 'title' | 'images' | 'listingType'>;
}

export const PropertyCardImage = ({ property }: Props) => {
  const imageUrl = property.images?.[0]?.imageUrl || 'https://placehold.co/600x400/FCCC99/FFFFFF/jpg?text=Rentverse';

  return (
    <div className="relative h-56 overflow-hidden">
      <Image
        src={imageUrl}
        alt={`Image of ${property.title}`}
        layout="fill"
        objectFit="cover"
        className="group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      <ListingTypeTag listingType={property.listingType} />
      <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.5l-7.682-7.682a4.5 4.5 0 010-6.364z" />
        </svg>
      </button>
    </div>
  );
};
