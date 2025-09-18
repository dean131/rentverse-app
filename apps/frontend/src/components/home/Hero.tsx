// File Path: apps/frontend/src/components/home/Hero.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Navigate to the properties page with the search query as a URL parameter
        router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <section className="relative h-[60vh] flex items-center justify-center text-white">
            <Image
                src="/login-bg.jpg"
                alt="Beautiful modern home interior"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Build Your Dream Home, Live The Lifestyle You Crave.
                </h1>
                <p className="mt-4 text-lg md:text-xl">
                    Realize your dream home. We craft spaces that are functional, inspiring joy, tranquility, and connection.
                </p>
                <form 
                    onSubmit={handleSearch}
                    className="mt-8 max-w-2xl mx-auto bg-white rounded-md p-2 flex items-center"
                >
                    <svg className="h-5 w-5 text-gray-400 mx-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by location"
                        className="w-full p-2 text-gray-800 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-orange-400 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
};

