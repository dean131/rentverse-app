// File Path: apps/frontend/src/components/properties/detail-page/PropertyImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: { imageUrl: string }[];
  title: string;
}

export const PropertyImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0]?.imageUrl || 'https://placehold.co/600x400/FFFFFF/F99933/jpg?text=No+Image');

  if (!images || images.length === 0) {
    return (
        <div className="relative h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
             <Image src={selectedImage} alt="Placeholder Image" layout="fill" objectFit="cover" className="rounded-lg" />
        </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[500px]">
      {/* Main Image */}
      <div className="flex-grow relative rounded-lg overflow-hidden">
        <Image src={selectedImage} alt={`Main view of ${title}`} layout="fill" objectFit="cover" />
      </div>
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-auto">
        {images.slice(0, 4).map((image, index) => (
          <button 
            key={index}
            onClick={() => setSelectedImage(image.imageUrl)}
            className={`relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-md overflow-hidden transition-opacity duration-200 ${selectedImage === image.imageUrl ? 'opacity-100 ring-2 ring-orange-500' : 'opacity-70 hover:opacity-100'}`}
          >
            <Image src={image.imageUrl} alt={`Thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

