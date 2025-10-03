// Create a new file at: frontend/src/ui/ui/DocumentUpload.tsx

'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { getPresignedUrl, uploadFileToBucket } from '@/features/upload/uploadService';

interface DocumentUploadProps {
  onUploadComplete: (key: string) => void;
  onUploadStart: () => void;
  onUploadError: (error: string) => void;
}

export const DocumentUpload = ({ onUploadComplete, onUploadStart, onUploadError }: DocumentUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      onUploadError("File rejected. Please ensure it is a valid document file under 10MB.");
      return;
    }
    
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    onUploadStart();
    setFileName(file.name);
    
    try {
      const { uploadUrl, key } = await getPresignedUrl(file.type);
      await uploadFileToBucket(uploadUrl, file);
      onUploadComplete(key);
    } catch (error) {
      console.error("Failed to upload file:", file.name, error);
      onUploadError(`Failed to upload ${file.name}. Please try again.`);
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete, onUploadStart, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isUploading ? 'cursor-not-allowed bg-gray-200' : 'cursor-pointer'}
        ${isDragActive ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:border-orange-400'}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p className="text-gray-500">Uploading document, please wait...</p>
      ) : fileName ? (
        <p className="text-green-700 font-medium">✓ {fileName} uploaded successfully!</p>
      ) : (
        <>
          <p className="text-gray-500">Drag & drop your document here, or click to select a file</p>
          <em className="text-xs text-gray-400">(PDF, JPG, or PNG, Max 10MB)</em>
        </>
      )}
    </div>
  );
};