// File Path: apps/frontend/src/app/properties/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyPublic, PropertyFilters } from '@/lib/definitions';
import { getPublicProperties } from '@/services/propertyService';
import { PropertyCard } from '@/components/home/PropertyCard';
import { Footer } from '@/components/home/Footer';
import { PropertySearchFilters } from '@/components/properties/PropertySearchFilters';

const SearchResults = () => {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const initialType = searchParams.get('type') || 'ALL';

    const [properties, setProperties] = useState<PropertyPublic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (filters: PropertyFilters) => {
        setIsLoading(true);
        const fetchProperties = async () => {
            try {
                const data = await getPublicProperties(filters);
                setProperties(data);
            } catch (err) {
                console.error("Failed to fetch properties:", err);
                setError("Could not load properties. Please try searching again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    };
    
    useEffect(() => {
        handleSearch({ search: initialSearch, type: initialType });
    }, [initialSearch, initialType]);


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            <PropertySearchFilters onSearch={handleSearch} initialFilters={{ search: initialSearch, type: initialType }} />
            
            <h1 className="text-3xl font-bold text-gray-900 my-8">
                {initialSearch ? `Search Results for "${initialSearch}"` : "All Properties"}
            </h1>
            
            {isLoading ? (
                 <div className="text-center py-20">Loading search results...</div>
            ) : error ? (
                 <div className="text-center py-20 text-red-500">{error}</div>
            ) : properties.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-20">No properties found matching your search criteria.</p>
            )}
        </div>
    );
};

export default function PropertyListPage() {
    return (
        <div className="bg-white min-h-screen">
            <Suspense fallback={<div className="text-center py-20">Loading page...</div>}>
                <SearchResults />
            </Suspense>
            <Footer />
        </div>
    );
}

