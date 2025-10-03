// File Path: apps/frontend/src/components/properties/detail-page/PropertyImageGallery.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: { imageUrl: string }[];
  title: string;
}

export const PropertyImageGallery = ({ images, title }: ImageGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Function to go to the next slide
    const nextSlide = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Set up the auto-slide interval
    useEffect(() => {
        // Only start the slideshow if there is more than one image
        if (images.length > 1) {
            intervalRef.current = setInterval(nextSlide, 5000); // Change image every 5 seconds
        }
        // Clean up the interval when the component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [images.length]);

    // Handlers to pause and resume the slideshow on hover
    const handleMouseEnter = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleMouseLeave = () => {
        if (images.length > 1) {
            intervalRef.current = setInterval(nextSlide, 5000);
        }
    };


    // Handle case with no images gracefully
    if (!images || images.length === 0) {
        return (
            <div className="relative h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                 <Image 
                    src='https://placehold.co/1200x600/F99933/FFFFFF/jpg?text=No+Image+Available' 
                    alt="Placeholder Image" 
                    fill 
                    className="object-cover rounded-lg" 
                />
            </div>
        );
    }

    const selectedImage = images[selectedIndex];

    return (
        <div 
            className="space-y-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Main Image Display */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-lg">
                <Image
                    key={selectedImage.imageUrl} // Add key to force re-render on change for transitions
                    src={selectedImage.imageUrl}
                    alt={`Main view of ${title}`}
                    fill
                    className="object-cover animate-fade-in" // Simple fade-in animation
                />
            </div>

            {/* Thumbnail Strip - only show if there are multiple images */}
            {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto p-2 scrollbar-hide">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative h-20 w-28 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                                selectedIndex === index ? 'ring-2 ring-orange-500' : 'opacity-60 hover:opacity-100'
                            }`}
                        >
                            <Image
                                src={image.imageUrl}
                                alt={`Thumbnail ${index + 1} of ${title}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
            {/* Add a little helper CSS for the animation and scrollbar */}
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0.4; }
                    to { opacity: 1; }
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

