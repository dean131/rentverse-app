// File Path: frontend/src/app/(public)/properties/page.tsx
'use client';

import { useEffect, useState, Suspense, useCallback, ReactNode } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PropertyPublic, PropertyFilters } from '@/lib/definitions';
import { getPublicProperties } from '@/features/properties/propertyService';
import { PropertyCard } from '@/features/home/components/PropertyCard';
import { PropertySearchFilters } from '@/features/properties/components/PropertySearchFilters';
import { Pagination } from '@/ui/ui/Pagination';
import { PropertyCardSkeleton } from '@/features/properties/components/PropertyCardSkeleton';
import { NoResultsFound } from '@/features/properties/components/NoResultsFound';

// New Hero Section Component for this page
const PropertiesHero = ({ children }: { children: ReactNode }) => (
    <section className="relative bg-gray-800 pt-20 pb-12">
        <div className="absolute inset-0">
            <Image
                src="/hero-bg.jpg" // Reusing the existing hero background
                alt="Modern building exterior"
                layout="fill"
                objectFit="cover"
                quality={80}
                priority
            />
            <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Find Your Perfect Space
                </h1>
                <p className="mt-4 text-lg text-gray-200 max-w-3xl mx-auto">
                    Explore thousands of listings to find the property thats right for you. Use our advanced filters to narrow down your options.
                </p>
            </div>
            {children}
        </div>
    </section>
);

const SearchResults = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [properties, setProperties] = useState<PropertyPublic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    const currentPage = Number(searchParams.get('page')) || 1;

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
            listingType: searchParams.get('listingType') || undefined,
            propertyType: searchParams.get('propertyType') || undefined,
            beds: searchParams.get('beds') || undefined,
            page: currentPage,
            minPrice: searchParams.get('minPrice') || undefined,
            maxPrice: searchParams.get('maxPrice') || undefined,
            amenities: searchParams.get('amenities')?.split(',') || undefined,
            furnishing: searchParams.get('furnishing')?.split(',') || undefined,
        };
        fetchProperties(currentFilters);
    }, [searchParams, fetchProperties, currentPage]);
    
    const handleFilterChange = (filters: Partial<PropertyFilters>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(filters).forEach(([key, value]) => {
            if (value && (Array.isArray(value) ? value.length > 0 : value !== 'ALL' && value !== '')) {
                params.set(key, Array.isArray(value) ? value.join(',') : String(value));
            } else {
                params.delete(key);
            }
        });
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    }

    const initialFilters = {
        propertyType: searchParams.get('propertyType') || 'ALL',
        beds: searchParams.get('beds') || 'ALL',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        amenities: searchParams.get('amenities')?.split(',') || [],
        furnishing: searchParams.get('furnishing')?.split(',') || [],
    };

    return (
        <>
            <PropertiesHero>
                <PropertySearchFilters 
                    onFilterChange={handleFilterChange} 
                    initialFilters={initialFilters} 
                />
            </PropertiesHero>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                       {isLoading ? 'Searching...' : `Showing ${properties.length} Results`}
                    </h2>
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
        </>
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