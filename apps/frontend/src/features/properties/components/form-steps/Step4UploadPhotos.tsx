// File Path: apps/frontend/src/components/properties/form-steps/Step4UploadPhotos.tsx
'use client';

import { UseFormSetValue, FieldErrors } from 'react-hook-form';
import { PropertySubmission } from '@/lib/definitions';
import { FileUpload } from '@/ui/ui/FileUpload';

interface Step4Props {
  setValue: UseFormSetValue<PropertySubmission>;
  errors: FieldErrors<PropertySubmission>;
}

export const Step4UploadPhotos = ({ setValue, errors }: Step4Props) => {
  const handleUploadComplete = (keys: string[]) => {
    const bucketName = 'rentverse';
    const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || process.env.NEXT_PUBLIC_STORAGE_SERVICE_URL || '';
    const imageUrls = keys.map(key => `${baseUrl}/${bucketName}/${key}`);

    setValue('images', imageUrls, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800">Upload Photos</h3>
        <p className="text-gray-500 mt-1">
            High-quality photos are crucial. Upload at least one photo. (Max 5MB per image)
        </p>
      </div>
      <div className="py-8 border-t border-gray-200">
        <FileUpload onUploadComplete={handleUploadComplete} />
        {errors.images && typeof errors.images.message === 'string' && (
            <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
        )}
      </div>
    </div>
  );
};

