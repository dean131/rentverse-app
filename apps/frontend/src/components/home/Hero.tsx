// File Path: apps/frontend/src/components/home/Hero.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export const Hero = () => {
    return (
        <div className="relative h-[600px] text-white">
            <Image
                src="/login-bg.jpg" // Reusing the same beautiful image
                alt="Luxurious property background"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Build Your Dream Home <br /> Live The Lifestyle You Crave.
                </h1>
                <p className="mt-4 max-w-2xl text-lg md:text-xl">
                    Realize your dream home. We craft spaces that are functional, inspiring joy, tranquility, and connection.
                </p>
                <div className="mt-8 bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text"
                        placeholder="Search by location"
                        className="flex-grow bg-transparent focus:outline-none text-gray-800"
                    />
                    <Button className="w-auto">Search</Button>
                </div>
            </div>
        </div>
    );
};
