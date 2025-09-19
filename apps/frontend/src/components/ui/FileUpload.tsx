// File Path: apps/frontend/src/components/ui/FileUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Button } from './Button';
import Image from 'next/image'; // Correct: Use a default import for next/image

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

export const FileUpload = ({ onFilesChange }: FileUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    onFilesChange(acceptedFiles);

    // Clean up old object URLs to prevent memory leaks
    previews.forEach(url => URL.revokeObjectURL(url));

    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    
    if (fileRejections.length > 0) {
        alert("Some files were rejected. Please ensure they are valid image files under 5MB.");
    }

  }, [onFilesChange, previews]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  });

  const removeAll = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews([]);
    onFilesChange([]);
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-orange-600 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:border-orange-500'}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">Drag & drop photos here, or click to select files</p>
        <em className="text-xs text-gray-400">(Max 5MB per image)</em>
      </div>
      
      {previews.length > 0 && (
        <div className="mt-6">
            <h4 className="font-semibold text-sm mb-2">Image Previews:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
                <div key={index} className="relative w-full h-32 rounded-md overflow-hidden">
                {/* This now correctly uses the next/image component */}
                <Image 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    layout="fill" 
                    objectFit="cover" 
                    onLoad={() => URL.revokeObjectURL(preview)} // Clean up URL after image loads to prevent memory leaks
                />
                </div>
            ))}
            </div>
             <div className="text-right mt-4">
                <Button variant="outline" type="button" onClick={removeAll} className="text-sm !px-3 !py-1">
                    Clear All
                </Button>
            </div>
        </div>
      )}
    </div>
  );
};

