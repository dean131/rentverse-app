// File Path: apps/frontend/src/components/properties/PropertySearchFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PropertyFilters } from '@/lib/definitions';
import { FilterButton } from './FilterButton'; // Import the new component

interface PropertySearchFiltersProps {
    onSearch: (filters: PropertyFilters) => void;
    initialFilters: PropertyFilters;
}

export const PropertySearchFilters = ({ onSearch, initialFilters }: PropertySearchFiltersProps) => {
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
    const [propertyType, setPropertyType] = useState(initialFilters.type || '');
    const [bedrooms, setBedrooms] = useState(initialFilters.beds || '');
    
    const router = useRouter();
    const pathname = usePathname();

    const propertyTypes = [
        { value: 'ALL', label: 'Any Type' },
        { value: 'APARTMENT', label: 'Apartment' },
        { value: 'HOUSE', label: 'House' },
        { value: 'PENTHOUSE', label: 'Penthouse' },
    ];
    
    const bedOptions = [
        { value: 'ALL', label: 'Any Beds' },
        { value: '1', label: '1+' },
        { value: '2', label: '2+' },
        { value: '3', label: '3+' },
        { value: '4', label: '4+' },
    ];

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const filters: PropertyFilters = {
            search: searchTerm,
            type: propertyType,
            beds: bedrooms,
        };

        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.type && filters.type !== 'ALL') params.set('type', filters.type);
        if (filters.beds && filters.beds !== 'ALL') params.set('beds', filters.beds);
        
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        onSearch(filters);
    };
    
    const handleReset = () => {
        setSearchTerm('');
        setPropertyType('');
        setBedrooms('');
        router.push(pathname, { scroll: false });
        onSearch({});
    };

    return (
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow">
            {/* Main Search Input */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                 <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by location, project, or title..."
                    className="flex-grow p-3 focus:outline-none text-gray-700"
                />
                <button type="submit" className="bg-orange-400 text-white p-3 hover:bg-orange-700 transition-colors">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
            
            {/* Filter Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
                <FilterButton 
                    label="Property Type" 
                    options={propertyTypes} 
                    selectedValue={propertyType}
                    onValueChange={setPropertyType}
                />
                 <FilterButton 
                    label="Beds" 
                    options={bedOptions} 
                    selectedValue={bedrooms}
                    onValueChange={setBedrooms}
                />
                {/* Add more FilterButton components here */}
                
                <div className="flex-grow flex items-center justify-end space-x-4">
                     <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Save Search
                     </button>
                     <button type="button" onClick={handleReset} className="text-sm text-gray-600 hover:text-orange-400 font-medium">
                        Reset Search
                     </button>
                </div>
            </div>
        </form>
    );
};

