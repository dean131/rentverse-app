'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PropertyPublic, PropertyFilters } from '@/lib/definitions';
import { getPublicProperties } from '@/features/properties/propertyService';
import { PropertyCard } from '@/features/home/components/PropertyCard';
import { PropertySearchFilters } from '@/features/properties/components/PropertySearchFilters';
import { Pagination } from '@/ui/ui/Pagination';
import { Button } from '@/ui/ui/Button';
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
    const initialSearch = searchParams.get('search') || '';
    const initialType = searchParams.get('type') || 'ALL';
    const initialBeds = searchParams.get('beds') || 'ALL';

    const [searchTerm, setSearchTerm] = useState(initialSearch);

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

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

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
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                 <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by location, project, or title..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto px-8 py-3">Search</Button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <aside className="lg:col-span-1">
                     <PropertySearchFilters onFilterChange={handleFilterChange} initialFilters={{ type: initialType, beds: initialBeds }} />
                </aside>
                
                <main className="lg:col-span-3">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                        <h1 className="text-xl font-semibold text-gray-800">
                           {isLoading ? 'Searching...' : `Showing ${properties.length} Results`}
                        </h1>
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-by" className="text-sm font-medium text-gray-600">Sort by:</label>
                            <select id="sort-by" className="w-full sm:w-auto border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <option>Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <PropertyCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : error ? (
                         <div className="text-center py-20 text-red-500">{error}</div>
                    ) : properties.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        </div>
    );
};

export default function PropertyListPage() {
    return (
        <div className="min-h-screen">
            <Suspense fallback={<div className="text-center py-20">Loading page...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    );
}