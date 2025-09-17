// File Path: apps/frontend/src/components/properties/PropertySubmissionForm.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { propertySubmissionSchema, PropertySubmission, Project, View } from '@/lib/definitions';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { getProjects, getViews, submitProperty } from '@/services/propertyService'; // <-- Import submitProperty

// Dummy data for dropdowns
const propertyTypes = ['APARTMENT', 'HOUSE', 'PENTHOUSE', 'STUDIO', 'COMMERCIAL'];
const listingTypes = ['RENT', 'SALE', 'BOTH'];
const furnishingStatusOptions = ['UNFURNISHED', 'PARTIALLY_FURNISHED', 'FULLY_FURNISHED'];
const paymentPeriods = ['MONTHLY', 'QUARTERLY', 'BI_ANNUALLY', 'YEARLY'];


export const PropertySubmissionForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PropertySubmission>({
    resolver: zodResolver(propertySubmissionSchema),
    defaultValues: {
        viewIds: []
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [projectsData, viewsData] = await Promise.all([
          getProjects(),
          getViews()
        ]);
        setProjects(projectsData);
        setViews(viewsData);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setApiError("Could not load necessary data. Please refresh the page.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);


  const onSubmit = async (data: PropertySubmission) => {
    setApiError(null);
    try {
      // Call the new service function to submit the data
      await submitProperty(data);
      alert('Property submitted successfully!');
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  const inputClass = "w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";


  if (isLoadingData) {
      return <p>Loading form...</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section 1: Basic Information */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Basic Information</legend>
        <InputField label="Title" id="title" type="text" registration={register('title')} error={errors.title} />
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
          <InputField label="Rental Price (Optional)" id="rentalPrice" type="number" registration={register('rentalPrice')} error={errors.rentalPrice} />
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
            <InputField label="Size (sqft)" id="sizeSqft" type="number" registration={register('sizeSqft')} error={errors.sizeSqft} />
            <InputField label="Bedrooms" id="bedrooms" type="number" registration={register('bedrooms')} error={errors.bedrooms} />
            <InputField label="Bathrooms" id="bathrooms" type="number" registration={register('bathrooms')} error={errors.bathrooms} />
        </div>
         <div>
            <label htmlFor="furnishingStatus" className={labelClass}>Furnishing Status</label>
            <select id="furnishingStatus" {...register('furnishingStatus')} className={inputClass}>
              {furnishingStatusOptions.map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
            </select>
            {errors.furnishingStatus && <p className="mt-1 text-sm text-red-600">{errors.furnishingStatus.message}</p>}
          </div>
      </fieldset>
      
      {/* Section 4: Project and Views */}
      <fieldset className="space-y-4">
          <legend className="text-lg font-semibold border-b pb-2 mb-4 w-full">Project & Views</legend>
            <div>
              <label htmlFor="projectId" className={labelClass}>Project (Optional)</label>
              <select id="projectId" {...register('projectId')} className={inputClass}>
                <option value="">None</option>
                {projects.map(project => <option key={project.id} value={project.id}>{project.projectName}</option>)}
              </select>
              {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>}
            </div>
            <div>
                <label className={labelClass}>Property Views</label>
                 <Controller
                    name="viewIds"
                    control={control}
                    render={({ field }) => (
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {views.map(view => (
                          <div key={view.id} className="flex items-center">
                            <input
                              id={`view-${view.id}`}
                              type="checkbox"
                              className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                              checked={field.value?.includes(view.id)}
                              onChange={(e) => {
                                const newValues = e.target.checked
                                  ? [...(field.value || []), view.id]
                                  : (field.value || []).filter(id => id !== view.id);
                                field.onChange(newValues);
                              }}
                            />
                            <label htmlFor={`view-${view.id}`} className="ml-3 text-sm text-gray-700">{view.name}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                {errors.viewIds && <p className="mt-1 text-sm text-red-600">{errors.viewIds.message}</p>}
            </div>
      </fieldset>
      
      {/* TODO: Add sections for Location and Documents */}

      <div className="pt-4">
        {apiError && <div className="text-sm text-red-600 text-center mb-4">{apiError}</div>}
        <Button
          type="submit"
          disabled={isSubmitting || isLoadingData}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Property'}
        </Button>
      </div>
    </form>
  );
};

