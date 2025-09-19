// File Path: apps/frontend/src/components/properties/form-steps/Step4UploadPhotos.tsx
'use client';

import { UseFormSetValue, FieldErrors } from 'react-hook-form';
import { PropertySubmission } from '@/lib/definitions';
import { FileUpload } from '@/components/ui/FileUpload';

interface Step4Props {
  setValue: UseFormSetValue<PropertySubmission>;
  errors: FieldErrors<PropertySubmission>;
}

export const Step4UploadPhotos = ({ setValue, errors }: Step4Props) => {
  const handleFilesChange = (files: File[]) => {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    
    setValue('images', dataTransfer.files, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Upload Photos</h3>
      <p className="text-sm text-gray-500">
        High-quality photos are crucial. Upload at least one photo of the property. (Max 5MB per image)
      </p>
      <FileUpload onFilesChange={handleFilesChange} />
      {/* CORRECTED: Added a check to ensure errors.images.message is a string before rendering.
        This resolves the TypeScript error.
      */}
      {errors.images && typeof errors.images.message === 'string' && (
        <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
      )}
    </div>
  );
};

