// File Path: apps/frontend/src/features/properties/components/PropertySearchFilters.tsx
'use client';

import { useState } from 'react';
import { PropertyFilters } from '@/lib/definitions';
import { FilterDropdown } from './FilterDropdown';
import { Button } from '@/ui/ui/Button';

interface PropertySearchFiltersProps {
    onFilterChange: (filters: Omit<PropertyFilters, 'search' | 'page'>) => void;
    initialFilters: Omit<PropertyFilters, 'search' | 'page'>;
}

export const PropertySearchFilters = ({ onFilterChange, initialFilters }: PropertySearchFiltersProps) => {
    const [propertyType, setPropertyType] = useState(initialFilters.type || 'ALL');
    const [bedrooms, setBedrooms] = useState(initialFilters.beds || 'ALL');

    const propertyTypes = [
        { value: 'ALL', label: 'Any Type' },
        { value: 'APARTMENT', label: 'Apartment' },
        { value: 'HOUSE', label: 'House' },
        { value: 'PENTHOUSE', label: 'Penthouse' },
        { value: 'COMMERCIAL', label: 'Commercial' },
    ];
    
    const bedOptions = [
        { value: 'ALL', label: 'Any Beds' },
        { value: '1', label: '1+ Beds' },
        { value: '2', label: '2+ Beds' },
        { value: '3', label: '3+ Beds' },
        { value: '4', label: '4+ Beds' },
    ];

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFilterChange({ type: propertyType, beds: bedrooms });
    };
    
    const handleReset = () => {
        setPropertyType('ALL');
        setBedrooms('ALL');
        onFilterChange({ type: 'ALL', beds: 'ALL'});
    };

    return (
        <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-end md:gap-4 space-y-4 md:space-y-0">
                <div className="flex-grow">
                    <FilterDropdown 
                        label="Property Type" 
                        options={propertyTypes} 
                        selectedValue={propertyType}
                        onValueChange={setPropertyType}
                    />
                </div>
                <div className="flex-grow">
                     <FilterDropdown 
                        label="Bedrooms" 
                        options={bedOptions} 
                        selectedValue={bedrooms}
                        onValueChange={setBedrooms}
                    />
                </div>
                
                <div className="flex-shrink-0 flex gap-2">
                     <Button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Apply Filters
                     </Button>
                     <Button type="button" variant="outline" onClick={handleReset} className="w-full md:w-auto">
                        Reset
                     </Button>
                </div>
            </div>
        </form>
    );
};