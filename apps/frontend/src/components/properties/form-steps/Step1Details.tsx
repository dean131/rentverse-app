// File Path: apps/frontend/src/components/properties/form-steps/Step1Details.tsx
import { UseFormRegister, FieldErrors, Path, FieldError } from 'react-hook-form';
import { PropertySubmission } from '@/lib/definitions';
import { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

interface Step1Props {
    register: UseFormRegister<PropertySubmission>;
    errors: FieldErrors<PropertySubmission>;
}

// Reusable form component types
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: Path<PropertySubmission>;
    register: UseFormRegister<PropertySubmission>;
    error?: FieldError;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: Path<PropertySubmission>;
    register: UseFormRegister<PropertySubmission>;
    error?: FieldError;
    children: ReactNode;
}

// Reusable form components
const FormInput = ({ label, name, register, error, type = "text", ...props }: FormInputProps) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input 
            id={name}
            type={type}
            {...register(name)}
            {...props}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${error ? 'border-red-500' : ''}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
);

const FormSelect = ({ label, name, register, error, children, ...props }: FormSelectProps) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            id={name}
            {...register(name)}
            {...props}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${error ? 'border-red-500' : ''}`}
        >
            {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
);

export const Step1Details = ({ register, errors }: Step1Props) => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Property Details</h3>
            <FormInput 
                label="Property Title"
                name="title"
                register={register}
                error={errors.title}
                placeholder="e.g., Modern Apartment in Central Jakarta"
            />
            
            <div>
                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                 <textarea 
                    id="description"
                    {...register('description')}
                    rows={4}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${errors.description ? 'border-red-500' : ''}`}
                 />
                 {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ADDED: Missing select fields */}
                <FormSelect label="Listing Type" name="listingType" register={register} error={errors.listingType}>
                    <option value="">Select Listing Type</option>
                    <option value="RENT">For Rent</option>
                    <option value="SALE">For Sale</option>
                    <option value="BOTH">Both</option>
                </FormSelect>
                <FormSelect label="Property Type" name="propertyType" register={register} error={errors.propertyType}>
                    <option value="">Select Property Type</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="STUDIO">Studio</option>
                    <option value="COMMERCIAL">Commercial</option>
                </FormSelect>
                 <FormSelect label="Furnishing Status" name="furnishingStatus" register={register} error={errors.furnishingStatus}>
                    <option value="">Select Status</option>
                    <option value="UNFURNISHED">Unfurnished</option>
                    <option value="PARTIALLY_FURNISHED">Partially Furnished</option>
                    <option value="FULLY_FURNISHED">Fully Furnished</option>
                </FormSelect>
                <FormInput 
                    label="Rental Price (MYR)"
                    name="rentalPrice"
                    register={register}
                    error={errors.rentalPrice}
                    type="number"
                    placeholder="e.g., 5000000"
                />
                <FormSelect label="Payment Period" name="paymentPeriod" register={register} error={errors.paymentPeriod}>
                    <option value="">Select Period</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                </FormSelect>
                <FormInput 
                    label="Bedrooms"
                    name="bedrooms"
                    register={register}
                    error={errors.bedrooms}
                    type="number"
                    placeholder="e.g., 3"
                />
                 <FormInput 
                    label="Bathrooms"
                    name="bathrooms"
                    register={register}
                    error={errors.bathrooms}
                    type="number"
                    placeholder="e.g., 2"
                />
                 <FormInput 
                    label="Area (Sqft)"
                    name="sizeSqft"
                    register={register}
                    error={errors.sizeSqft}
                    type="number"
                    placeholder="e.g., 1200"
                />
            </div>
            {/* ADDED: Missing URL input field */}
             <FormInput 
                label="Ownership Document URL"
                name="ownershipDocumentUrl"
                register={register}
                error={errors.ownershipDocumentUrl}
                placeholder="https://example.com/document.pdf"
            />
        </div>
    );
};

