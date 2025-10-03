// File Path: apps/frontend/src/components/properties/form-steps/Step3Features.tsx
'use client';

import { useEffect, useState, InputHTMLAttributes } from 'react';
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import { PropertySubmission, View, Amenity } from '@/lib/definitions';
import { getViews, getAmenities } from '@/features/properties/propertyService';

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
    <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
        <input
            type="checkbox"
            {...register(name)}
            value={value}
            className="h-5 w-5 rounded border-gray-300 text-orange-400 focus:ring-orange-500"
        />
        <span className="text-sm font-medium text-gray-800">{label}</span>
    </label>
);

export const Step3Features = ({ register, errors }: Step3Props) => {
    const [views, setViews] = useState<View[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [viewsData, amenitiesData] = await Promise.all([getViews(), getAmenities()]);
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

    if (isLoading) return <p>Loading features...</p>;

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Views & Amenities</h3>
                <p className="text-gray-500 mt-1">Select all the features that apply to your property.</p>
            </div>

            <div className="py-8 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Available Views</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {views.map(view => (
                        <FormCheckbox key={view.id} name="viewIds" value={view.id} label={view.name} register={register} />
                    ))}
                </div>
                 {errors.viewIds && <p className="mt-2 text-sm text-red-600">{errors.viewIds.message}</p>}
            </div>

            <div className="py-8 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Included Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map(amenity => (
                         <FormCheckbox key={amenity.id} name="amenityIds" value={amenity.id} label={amenity.name} register={register} />
                    ))}
                </div>
                {errors.amenityIds && <p className="mt-2 text-sm text-red-600">{errors.amenityIds.message}</p>}
            </div>
        </div>
    );
};

