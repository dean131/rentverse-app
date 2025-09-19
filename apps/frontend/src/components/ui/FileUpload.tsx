// File Path: apps/frontend/src/components/ui/FileUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

export const FileUpload = ({ onFilesChange }: FileUploadProps) => {
  const [previews, setPreviews] = useState<(string | ArrayBuffer | null)[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesChange(acceptedFiles);
    // Create previews for the accepted files
    const newPreviews = acceptedFiles.map(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => [...(prev || []), reader.result]);
      };
      reader.readAsDataURL(file);
      return URL.createObjectURL(file); // Temporary URL for preview
    });
  }, [onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-orange-600 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:border-orange-500'}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">Drag & drop some files here, or click to select files</p>
        <em className="text-xs text-gray-400">(Images only, e.g., *.jpeg, *.png)</em>
      </div>
      
      {/* Previews */}
      {previews.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative w-full h-32 rounded-md overflow-hidden">
              <img src={preview as string} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
