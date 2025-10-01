// File Path: apps/frontend/src/components/properties/form-steps/Step1Details.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { PropertySubmission } from '@/lib/definitions';
import { getPricePrediction } from '@/features/prediction/predictionService';
import { debounce } from 'lodash';

import { FormInput } from '@/ui/ui/FormInput';
import { FormSelect } from '@/ui/ui/FormSelect';
import { FormTextarea } from '@/ui/ui/FormTextarea';

interface Step1Props {
    register: UseFormRegister<PropertySubmission>;
    errors: FieldErrors<PropertySubmission>;
    watch: UseFormWatch<PropertySubmission>;
    setValue: UseFormSetValue<PropertySubmission>;
}

export const Step1Details = ({ register, errors, watch, setValue }: Step1Props) => {
    const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
    const [isPredictionLoading, setIsPredictionLoading] = useState(false);

    const bedrooms = watch('bedrooms');
    const bathrooms = watch('bathrooms');
    const sizeSqft = watch('sizeSqft');
    const listingType = watch('listingType');
    const propertyType = watch('propertyType');

    const debouncedFetchPrediction = useCallback(
        debounce(async (features) => {
            setIsPredictionLoading(true);
            try {
                const prediction = await getPricePrediction(features);
                setSuggestedPrice(prediction);
            } catch (error) {
                console.error("Prediction failed:", error);
                setSuggestedPrice(null);
            } finally {
                setIsPredictionLoading(false);
            }
        }, 1000),
    []);

    useEffect(() => {
        if (bedrooms > 0 && bathrooms > 0 && sizeSqft > 0 && listingType && propertyType) {
            debouncedFetchPrediction({
                bedrooms,
                bathrooms,
                area_sqft: sizeSqft,
                listing_type: listingType.toLowerCase(),
                property_type: propertyType,
                location: 'Kuala Lumpur', // This could be made dynamic in a future version
            });
        }
        return () => debouncedFetchPrediction.cancel();
    }, [bedrooms, bathrooms, sizeSqft, listingType, propertyType, debouncedFetchPrediction]);

    const applySuggestion = () => {
        if (suggestedPrice) {
            setValue('rentalPrice', Math.round(suggestedPrice), { shouldValidate: true, shouldDirty: true });
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Property Details</h3>
                <p className="text-gray-500 mt-1">Start with the basic information about your property.</p>
            </div>

            <div className="space-y-6">
                <FormInput
                    label="Property Title"
                    name="title"
                    register={register}
                    error={errors.title}
                    placeholder="e.g., Modern Apartment in Central Jakarta"
                />

                <FormTextarea
                    label="Description"
                    name="description"
                    register={register}
                    error={errors.description}
                    rows={5}
                    placeholder="Describe what makes your property special..."
                />
            </div>

            <div className="py-8 border-t border-gray-200">
                 <h4 className="text-lg font-semibold text-gray-700 mb-4">Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect label="Listing Type" name="listingType" register={register} error={errors.listingType}>
                        <option value="">Select Listing Type</option><option value="RENT">For Rent</option><option value="SALE">For Sale</option>
                    </FormSelect>
                    <FormSelect label="Property Type" name="propertyType" register={register} error={errors.propertyType}>
                        <option value="">Select Property Type</option><option value="APARTMENT">Apartment</option><option value="HOUSE">House</option><option value="PENTHOUSE">Penthouse</option><option value="STUDIO">Studio</option><option value="COMMERCIAL">Commercial</option>
                    </FormSelect>
                    <FormSelect label="Furnishing Status" name="furnishingStatus" register={register} error={errors.furnishingStatus}>
                        <option value="">Select Status</option><option value="UNFURNISHED">Unfurnished</option><option value="PARTIALLY_FURNISHED">Partially Furnished</option><option value="FULLY_FURNISHED">Fully Furnished</option>
                    </FormSelect>
                    <FormInput label="Bedrooms" name="bedrooms" register={register} error={errors.bedrooms} type="number" placeholder="e.g., 3" />
                    <FormInput label="Bathrooms" name="bathrooms" register={register} error={errors.bathrooms} type="number" placeholder="e.g., 2" />
                    <FormInput label="Area (Sqft)" name="sizeSqft" register={register} error={errors.sizeSqft} type="number" placeholder="e.g., 1200" />
                </div>
            </div>

            <div className="py-8 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormInput
                        label="Price (IDR)"
                        name="rentalPrice"
                        register={register}
                        error={errors.rentalPrice}
                        type="number"
                        placeholder="e.g., 25000000"
                    />
                    <FormSelect
                        label="Payment Period"
                        name="paymentPeriod"
                        register={register}
                        error={errors.paymentPeriod}
                    >
                        <option value="">Select Period</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="YEARLY">Yearly</option>
                    </FormSelect>
                </div>
                {isPredictionLoading && <div className="mt-4 text-sm text-gray-500 p-3 bg-gray-50 rounded-md animate-pulse"><p>✨ Generating AI price suggestion...</p></div>}
                {suggestedPrice !== null && !isPredictionLoading && (
                    <div className="mt-4 p-3 bg-green-50 rounded-md flex items-center justify-between">
                        <p className="text-sm text-green-800">
                            <strong>AI Suggestion:</strong> A competitive price is around <strong>Rp {Math.round(suggestedPrice).toLocaleString('id-ID')}</strong>.
                        </p>
                        <button
                            type="button"
                            onClick={applySuggestion}
                            className="text-sm font-semibold text-orange-400 hover:text-orange-800 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

             <div className="py-8 border-t border-gray-200">
                 <h4 className="text-lg font-semibold text-gray-700 mb-4">Documentation</h4>
                <FormInput
                    label="Ownership Document URL"
                    name="ownershipDocumentUrl"
                    register={register}
                    error={errors.ownershipDocumentUrl}
                    placeholder="https://example.com/document.pdf"
                />
            </div>
        </div>
    );
};

