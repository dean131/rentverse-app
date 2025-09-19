// File Path: apps/frontend/src/components/properties/form-steps/Step3Features.tsx
'use client';

import { useEffect, useState, InputHTMLAttributes } from 'react';
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import { PropertySubmission, View, Amenity } from '@/lib/definitions';
import { getViews, getAmenities } from '@/services/propertyService';

interface Step3Props {
    register: UseFormRegister<PropertySubmission>;
    errors: FieldErrors<PropertySubmission>;
}

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    name: Path<PropertySubmission>;
    label: string;
    register: UseFormRegister<PropertySubmission>;
}

const FormCheckbox = ({ name, value, label, register }: FormCheckboxProps) => (
    <label className="flex items-center space-x-3">
        <input
            type="checkbox"
            {...register(name)}
            value={value}
            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);

export const Step3Features = ({ register, errors }: Step3Props) => {
    const [views, setViews] = useState<View[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both views and amenities concurrently
                const [viewsData, amenitiesData] = await Promise.all([
                    getViews(),
                    getAmenities()
                ]);
                setViews(viewsData);
                setAmenities(amenitiesData);
            } catch (error) {
                console.error("Failed to fetch features data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading features...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold">Views</h3>
                <p className="text-sm text-gray-500 mb-4">Select the views available from the property.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {views.map(view => (
                        <FormCheckbox 
                            key={view.id}
                            name="viewIds"
                            value={view.id}
                            label={view.name}
                            register={register}
                        />
                    ))}
                </div>
                 {errors.viewIds && <p className="mt-2 text-sm text-red-600">{errors.viewIds.message}</p>}
            </div>

            <div>
                <h3 className="text-lg font-semibold">Amenities</h3>
                 <p className="text-sm text-gray-500 mb-4">Select the amenities included with the property.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map(amenity => (
                         <FormCheckbox 
                            key={amenity.id}
                            name="amenityIds"
                            value={amenity.id}
                            label={amenity.name}
                            register={register}
                        />
                    ))}
                </div>
                {errors.amenityIds && <p className="mt-2 text-sm text-red-600">{errors.amenityIds.message}</p>}
            </div>
        </div>
    );
};

