// File Path: apps/frontend/src/features/home/components/Hero.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { debounce } from 'lodash';

// Define the shape of a suggestion from the Nominatim API
interface NominatimResult {
    place_id: number;
    display_name: string;
}

export const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Debounced function to fetch address suggestions as the user types
    const searchAddress = useCallback(
        debounce(async (query: string) => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5`);
                const data: NominatimResult[] = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Failed to fetch address suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300), // Wait 300ms after user stops typing
        []
    );

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        searchAddress(query);
    };

    const handleSuggestionClick = (suggestion: NominatimResult) => {
        const address = suggestion.display_name;
        setSearchQuery(address);
        setSuggestions([]);
        router.push(`/properties?search=${encodeURIComponent(address)}`);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuggestions([]);
        const trimmedQuery = searchQuery.trim();
        router.push(trimmedQuery ? `/properties?search=${encodeURIComponent(trimmedQuery)}` : '/properties');
    };

    // Effect to close the suggestions dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section className="relative h-[60vh] flex items-center justify-center text-white">
            <Image
                src="/hero-bg.jpg"
                alt="Beautiful modern home exterior"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 text-center max-w-3xl mx-auto px-4" ref={searchContainerRef}>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Build Your Dream Home, Live The Lifestyle You Crave.
                </h1>
                <p className="mt-4 text-lg md:text-xl">
                    Realize your dream home. We craft spaces that are functional, inspiring joy, tranquility, and connection.
                </p>
                <form 
                    onSubmit={handleSearchSubmit}
                    className="mt-8 max-w-2xl mx-auto"
                >
                    <div className="relative bg-white rounded-md p-2 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mx-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleQueryChange}
                            placeholder="Search by address or location"
                            className="w-full p-2 text-gray-800 focus:outline-none"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {(isSearching || suggestions.length > 0) && (
                        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 text-left">
                            {isSearching && <div className="p-3 text-sm text-gray-500">Searching...</div>}
                            <ul className="max-h-60 overflow-auto">
                                {suggestions.map(suggestion => (
                                    <li
                                        key={suggestion.place_id}
                                        className="p-3 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(suggestion); }}
                                    >
                                        {suggestion.display_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};