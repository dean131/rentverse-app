// File Path: apps/frontend/src/components/ui/FileUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Image from 'next/image';
import { getPresignedUrl, uploadFileToBucket } from '@/features/upload/uploadService';

interface FileUploadProps {
  onUploadComplete: (keys: string[]) => void;
}

export const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setIsUploading(true);
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    const uploadedFileKeys: string[] = [];

    for (const file of acceptedFiles) {
      try {
        const { uploadUrl, key } = await getPresignedUrl(file.type);
        await uploadFileToBucket(uploadUrl, file);
        uploadedFileKeys.push(key);
      } catch (error) {
        console.error("Failed to upload file:", file.name, error);
        alert(`Failed to upload ${file.name}. Please try again.`);
        setPreviews(currentPreviews => currentPreviews.filter(p => p !== URL.createObjectURL(file)));
      }
    }

    setIsUploading(false);
    onUploadComplete(uploadedFileKeys);

    if (fileRejections.length > 0) {
        alert("Some files were rejected. Please ensure they are valid image files under 5MB.");
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    disabled: isUploading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isUploading ? 'cursor-not-allowed bg-gray-200' : 'cursor-pointer'}
          ${isDragActive ? 'border-orange-600 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:border-orange-500'}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
            <p className="text-gray-500">Uploading files, please wait...</p>
        ) : (
            <>
                <p className="text-gray-500">Drag & drop photos here, or click to select files</p>
                <em className="text-xs text-gray-400">(Max 5MB per image)</em>
            </>
        )}
      </div>
      
      {previews.length > 0 && (
        <div className="mt-6">
            <h4 className="font-semibold text-sm mb-2">Image Previews:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
                <div key={index} className="relative w-full h-32 rounded-md overflow-hidden">
                    <Image src={preview} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" />
                </div>
            ))}
            </div>
        </div>
      )}
    </div>
  );
};