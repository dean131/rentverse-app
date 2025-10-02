// File Path: apps/frontend/src/app/(public)/properties/page.tsx
'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PropertyPublic, PropertyFilters } from '@/lib/definitions';
import { getPublicProperties } from '@/features/properties/propertyService';
import { PropertyCard } from '@/features/home/components/PropertyCard';
import { PropertySearchFilters } from '@/features/properties/components/PropertySearchFilters';
import { Pagination } from '@/ui/ui/Pagination';
import { PropertyCardSkeleton } from '@/features/properties/components/PropertyCardSkeleton';
import { NoResultsFound } from '@/features/properties/components/NoResultsFound';

const SearchResults = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [properties, setProperties] = useState<PropertyPublic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    const currentPage = Number(searchParams.get('page')) || 1;
    const initialType = searchParams.get('type') || 'ALL';
    const initialBeds = searchParams.get('beds') || 'ALL';

    const fetchProperties = useCallback(async (filters: PropertyFilters) => {
        setIsLoading(true);
        setError(null);
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
            search: searchParams.get('search') || undefined,
            type: searchParams.get('type') || undefined,
            beds: searchParams.get('beds') || undefined,
            page: Number(searchParams.get('page')) || 1,
        };
        fetchProperties(currentFilters);
    }, [searchParams, fetchProperties]);

    const handleFilterChange = (filters: Omit<PropertyFilters, 'search' | 'page'>) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filters.type && filters.type !== 'ALL') {
            params.set('type', filters.type);
        } else {
            params.delete('type');
        }

        if (filters.beds && filters.beds !== 'ALL') {
            params.set('beds', filters.beds);
        } else {
            params.delete('beds');
        }

        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Find Your Next Property</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Search through our curated list of properties. Use the filters to narrow down your options.
                </p>
            </div>

            {/* Filters are now at the top */}
            <div className="mb-8">
                <PropertySearchFilters 
                    onFilterChange={handleFilterChange} 
                    initialFilters={{ type: initialType, beds: initialBeds }} 
                />
            </div>
            
            <main>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {isLoading ? 'Searching...' : `Showing ${properties.length} Results`}
                    </h1>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort-by" className="text-sm font-medium text-gray-600">Sort by:</label>
                        <select id="sort-by" className="w-full sm:w-auto border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900">
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 9 }).map((_, index) => (
                            <PropertyCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                        <div className="text-center py-20 text-red-500">{error}</div>
                ) : properties.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                ) : (
                    <NoResultsFound />
                )}
            </main>
        </div>
    );
};

export default function PropertyListPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Suspense fallback={<div className="text-center py-20">Loading page...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    );
}