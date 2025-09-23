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
  const handleUploadComplete = (keys: string[]) => {
    const bucketName = 'rentverse'; // This should match your MinIO bucket name
    const imageUrls = keys.map(key => `https://rentverse_minio.ilhamdean.cloud/${bucketName}/${key}`);
    
    setValue('images', imageUrls, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Upload Photos</h3>
      <p className="text-sm text-gray-500">
        High-quality photos are crucial. Upload at least one photo. (Max 5MB per image)
      </p>
      <FileUpload onUploadComplete={handleUploadComplete} />
      {errors.images && typeof errors.images.message === 'string' && (
        <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
      )}
    </div>
  );
};