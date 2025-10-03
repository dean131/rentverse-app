// File Path: frontend/src/features/properties/components/PropertySearchFilters.tsx

'use client';

import { useState, useEffect } from 'react';
import { FilterDropdown } from './FilterDropdown';
import { Button } from '@/ui/ui/Button';
import { Amenity } from '@/lib/definitions';
import { getAmenities } from '../propertyService';

interface PropertySearchFiltersProps {
    onFilterChange: (filters: { 
        propertyType?: string; 
        beds?: string;
        minPrice?: string;
        maxPrice?: string;
        furnishing?: string[];
        amenities?: string[];
    }) => void;
    initialFilters: { 
        propertyType?: string; 
        beds?: string;
        minPrice?: string;
        maxPrice?: string;
        furnishing?: string[];
        amenities?: string[];
    };
}

const Checkbox = ({ label, value, checked, onChange }: { label: string, value: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <label className="flex items-center space-x-2 text-sm text-gray-700">
        <input type="checkbox" value={value} checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-orange-400 focus:ring-orange-500" />
        <span>{label}</span>
    </label>
);

export const PropertySearchFilters = ({ onFilterChange, initialFilters }: PropertySearchFiltersProps) => {
    const [propertyType, setPropertyType] = useState(initialFilters.propertyType || 'ALL');
    const [bedrooms, setBedrooms] = useState(initialFilters.beds || 'ALL');
    const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
    const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');
    const [selectedFurnishing, setSelectedFurnishing] = useState<string[]>(initialFilters.furnishing || []);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters.amenities || []);
    
    const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    useEffect(() => {
        getAmenities().then(setAllAmenities).catch(err => console.error("Failed to fetch amenities", err));
    }, []);

    const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setter(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFilterChange({ 
            propertyType, 
            beds: bedrooms,
            minPrice,
            maxPrice,
            furnishing: selectedFurnishing,
            amenities: selectedAmenities,
        });
    };
    
    const handleReset = () => {
        setPropertyType('ALL');
        setBedrooms('ALL');
        setMinPrice('');
        setMaxPrice('');
        setSelectedFurnishing([]);
        setSelectedAmenities([]);
        onFilterChange({}); // Reset all filters
    };

    const furnishingOptions = [
        { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
        { value: 'PARTIALLY_FURNISHED', label: 'Partially Furnished' },
        { value: 'UNFURNISHED', label: 'Unfurnished' },
    ];

    return (
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FilterDropdown label="Property Type" options={[{ value: 'ALL', label: 'Any Type' }, { value: 'APARTMENT', label: 'Apartment' }, { value: 'HOUSE', label: 'House' }]} selectedValue={propertyType} onValueChange={setPropertyType} />
                <FilterDropdown label="Bedrooms" options={[{ value: 'ALL', label: 'Any Beds' }, { value: '1', label: '1+' }, { value: '2', label: '2+' }]} selectedValue={bedrooms} onValueChange={setBedrooms} />
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (IDR)</label>
                    <div className="flex items-center gap-2">
                        <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full border-gray-300 rounded-md py-2 px-3 text-sm" />
                        <span>-</span>
                        <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full border-gray-300 rounded-md py-2 px-3 text-sm" />
                    </div>
                </div>
                <div className="flex items-end">
                    <Button type="button" variant="outline" onClick={() => setShowMoreFilters(!showMoreFilters)} className="w-full">
                        {showMoreFilters ? 'Less Filters' : 'More Filters'}
                    </Button>
                </div>
            </div>

            {showMoreFilters && (
                <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Furnishing Status</h4>
                        <div className="space-y-2">
                            {furnishingOptions.map(opt => <Checkbox key={opt.value} label={opt.label} value={opt.value} checked={selectedFurnishing.includes(opt.value)} onChange={handleCheckboxChange(setSelectedFurnishing)} />)}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Amenities</h4>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                            {allAmenities.map(amenity => <Checkbox key={amenity.id} label={amenity.name} value={String(amenity.id)} checked={selectedAmenities.includes(String(amenity.id))} onChange={handleCheckboxChange(setSelectedAmenities)} />)}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                 <Button type="button" variant="outline" onClick={handleReset}>Reset All</Button>
                 <Button type="submit">Apply Filters</Button>
            </div>
        </form>
    );
};