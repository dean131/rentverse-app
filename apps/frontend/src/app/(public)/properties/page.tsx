// File Path: apps/frontend/src/app/properties/page.tsx
'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PropertyPublic, PropertyFilters } from '@/lib/definitions';
import { getPublicProperties } from '@/features/properties/propertyService';
import { PropertyCard } from '@/features/home/components/PropertyCard';
import { PropertySearchFilters } from '@/features/properties/components/PropertySearchFilters';
import { Pagination } from '@/ui/ui/Pagination';

const SearchResults = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [properties, setProperties] = useState<PropertyPublic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    const currentPage = Number(searchParams.get('page')) || 1;
    const initialSearch = searchParams.get('search') || '';
    const initialType = searchParams.get('type') || 'ALL';
    const initialBeds = searchParams.get('beds') || 'ALL';

    const fetchProperties = useCallback(async (filters: PropertyFilters) => {
        setIsLoading(true);
        try {
            const data = await getPublicProperties(filters);
            setProperties(data.items);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Failed to fetch properties:", err);
            setError("Could not load properties. Please try searching again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const currentFilters: PropertyFilters = {
            search: searchParams.get('search') || '',
            type: searchParams.get('type') || 'ALL',
            beds: searchParams.get('beds') || 'ALL',
            page: Number(searchParams.get('page')) || 1,
        };
        fetchProperties(currentFilters);
    }, [searchParams, fetchProperties]);

    const handleSearch = (filters: PropertyFilters) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filters.search) params.set('search', filters.search); else params.delete('search');
        if (filters.type && filters.type !== 'ALL') params.set('type', filters.type); else params.delete('type');
        if (filters.beds && filters.beds !== 'ALL') params.set('beds', filters.beds); else params.delete('beds');
        params.set('page', '1'); // Reset to first page on new search
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <PropertySearchFilters onSearch={handleSearch} initialFilters={{ search: initialSearch, type: initialType, beds: initialBeds }} />
            
            <h1 className="text-3xl font-bold text-gray-900 my-8">
                {initialSearch ? `Search Results for "${initialSearch}"` : "All Properties"}
            </h1>
            
            {isLoading ? (
                 <div className="text-center py-20">Loading search results...</div>
            ) : error ? (
                 <div className="text-center py-20 text-red-500">{error}</div>
            ) : properties.length > 0 ? (
                <>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
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
        </div>
    );
}

