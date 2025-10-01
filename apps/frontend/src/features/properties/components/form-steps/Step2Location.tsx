// File Path: apps/frontend/src/components/properties/form-steps/Step2Location.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { PropertySubmission, Project } from '@/lib/definitions';
import { getProjects } from '@/features/properties/propertyService';
import { FormSelect } from '@/ui/ui/FormSelect';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';

const LocationMap = dynamic(() => import('./LocationMap').then(mod => mod.LocationMap), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-200 rounded-lg animate-pulse" />
});

interface Step2Props {
    register: UseFormRegister<PropertySubmission>;
    errors: FieldErrors<PropertySubmission>;
    watch: UseFormWatch<PropertySubmission>;
    setValue: UseFormSetValue<PropertySubmission>;
}

interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export const Step2Location = ({ register, errors, watch, setValue }: Step2Props) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const selectedProjectId = watch('projectId');

    // State for address search
    const [address, setAddress] = useState(watch('address') || "");
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const lat = watch('latitude');
    const lng = watch('longitude');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectData = await getProjects();
                setProjects(projectData);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleLocationSelectOnMap = (lat: number, lng: number) => {
        setValue('latitude', lat, { shouldValidate: true, shouldDirty: true });
        setValue('longitude', lng, { shouldValidate: true, shouldDirty: true });
    };

    // Debounced search function
    const searchAddress = useCallback(
        debounce(async (query: string) => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                // Fetch from OpenStreetMap's Nominatim API, biased towards Indonesia
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5`);
                const data: NominatimResult[] = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Failed to fetch address suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 500),
        []
    );

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddress = e.target.value;
        setAddress(newAddress);
        setValue('address', newAddress, { shouldValidate: true, shouldDirty: true });
        searchAddress(newAddress);
    };

    const handleSuggestionClick = (suggestion: NominatimResult) => {
        const lat = parseFloat(suggestion.lat);
        const lon = parseFloat(suggestion.lon);

        setAddress(suggestion.display_name);
        setValue('address', suggestion.display_name, { shouldValidate: true, shouldDirty: true });
        setValue('latitude', lat, { shouldValidate: true, shouldDirty: true });
        setValue('longitude', lon, { shouldValidate: true, shouldDirty: true });
        setSuggestions([]);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Property Location</h3>
                <p className="text-gray-500 mt-1">
                    Link to an existing project or enter a new address and pin it on the map.
                </p>
            </div>

            <FormSelect
                label="Select Project (Optional)"
                name="projectId"
                register={register}
                error={errors.projectId}
                disabled={isLoading}
            >
                <option value="">{isLoading ? "Loading projects..." : "Select an existing project"}</option>
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.projectName}
                    </option>
                ))}
            </FormSelect>

            {!selectedProjectId && (
                <div className="space-y-6 py-8 border-t border-gray-200">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Full Property Address</label>
                        <div className="relative">
                            <input
                                id="address"
                                value={address}
                                onChange={handleAddressChange}
                                placeholder="Start typing an address..."
                                className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-orange-500 sm:text-sm"
                                autoComplete="off"
                            />
                            { (isSearching || suggestions.length > 0) &&
                                <div className="absolute z-10 w-full bg-white rounded-md shadow-lg mt-1 border">
                                    {isSearching && <div className="p-2 text-gray-500">Searching...</div>}
                                    {suggestions.map(suggestion => (
                                        <div
                                            key={suggestion.place_id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <span>{suggestion.display_name}</span>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pin Location on Map</label>
                         <p className="text-sm text-gray-500 mb-2">
                            Click on the map to set the exact coordinates. The map will update when you select a suggested address.
                        </p>
                        <LocationMap
                            onLocationSelect={handleLocationSelectOnMap}
                            initialPosition={lat && lng ? [lat, lng] : undefined}
                        />
                        <input type="hidden" {...register('latitude')} />
                        <input type="hidden" {...register('longitude')} />
                         {errors.latitude && <p className="mt-1 text-sm text-red-600">Please select a location on the map.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

