// File Path: apps/frontend/src/components/properties/PropertySubmissionForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { propertySubmissionSchema, PropertySubmission } from '@/lib/definitions';
import { Button } from '@/components/ui/Button';

// Dummy data for dropdowns - in a real app, this would come from an API
const propertyTypes = ['APARTMENT', 'HOUSE', 'PENTHOUSE', 'STUDIO', 'COMMERCIAL'];
const listingTypes = ['RENT', 'SALE', 'BOTH'];
const furnishingStatusOptions = ['UNFURNISHED', 'PARTIALLY_FURNISHED', 'FULLY_FURNISHED'];
const paymentPeriods = ['MONTHLY', 'QUARTERLY', 'BI_ANNUALLY', 'YEARLY'];


export const PropertySubmissionForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertySubmission>({
    resolver: zodResolver(propertySubmissionSchema),
    // TODO: Add defaultValues if needed for editing a property
  });

  const onSubmit = async (data: PropertySubmission) => {
    setError(null);
    try {
      // TODO: Implement the API call to submit the property data
      console.log('Form data submitted:', data);
      alert('Property submitted successfully! (See console for data)');
      // On success, redirect to the dashboard or the new property's page
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  // Helper function for consistent input styling
  const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700";


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section 1: Basic Information */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Basic Information</legend>
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" type="text" {...register('title')} className={inputClass} />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea id="description" {...register('description')} className={inputClass} rows={4}></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
      </fieldset>

      {/* Section 2: Listing Details */}
       <fieldset className="space-y-4">
        <legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Listing Details</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="listingType" className={labelClass}>Listing Type</label>
            <select id="listingType" {...register('listingType')} className={inputClass}>
              {listingTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.listingType && <p className="mt-1 text-sm text-red-600">{errors.listingType.message}</p>}
          </div>
          <div>
            <label htmlFor="propertyType" className={labelClass}>Property Type</label>
            <select id="propertyType" {...register('propertyType')} className={inputClass}>
              {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>}
          </div>
          <div>
            <label htmlFor="rentalPrice" className={labelClass}>Rental Price (Optional)</label>
            <input id="rentalPrice" type="number" {...register('rentalPrice')} className={inputClass} />
            {errors.rentalPrice && <p className="mt-1 text-sm text-red-600">{errors.rentalPrice.message}</p>}
          </div>
           <div>
            <label htmlFor="paymentPeriod" className={labelClass}>Payment Period</label>
            <select id="paymentPeriod" {...register('paymentPeriod')} className={inputClass}>
              {paymentPeriods.map(period => <option key={period} value={period}>{period}</option>)}
            </select>
            {errors.paymentPeriod && <p className="mt-1 text-sm text-red-600">{errors.paymentPeriod.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Section 3: Property Specifications */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Specifications</legend>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="sizeSqft" className={labelClass}>Size (sqft)</label>
              <input id="sizeSqft" type="number" {...register('sizeSqft')} className={inputClass} />
              {errors.sizeSqft && <p className="mt-1 text-sm text-red-600">{errors.sizeSqft.message}</p>}
            </div>
            <div>
              <label htmlFor="bedrooms" className={labelClass}>Bedrooms</label>
              <input id="bedrooms" type="number" {...register('bedrooms')} className={inputClass} />
              {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>}
            </div>
            <div>
              <label htmlFor="bathrooms" className={labelClass}>Bathrooms</label>
              <input id="bathrooms" type="number" {...register('bathrooms')} className={inputClass} />
              {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>}
            </div>
        </div>
         <div>
            <label htmlFor="furnishingStatus" className={labelClass}>Furnishing Status</label>
            <select id="furnishingStatus" {...register('furnishingStatus')} className={inputClass}>
              {furnishingStatusOptions.map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
            </select>
            {errors.furnishingStatus && <p className="mt-1 text-sm text-red-600">{errors.furnishingStatus.message}</p>}
          </div>
      </fieldset>
      
      {/* TODO: Add sections for Location, Documents, Views, and Amenities */}

      {/* Submit Button & Messages */}
      <div className="pt-4">
        {error && <div className="text-red-600 text-sm text-center p-2 mb-4 rounded-md bg-red-50">{error}</div>}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Property'}
        </Button>
      </div>
    </form>
  );
};

