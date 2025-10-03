'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePropertyStatus } from '@/features/admin/adminService';
import { Button } from '@/ui/ui/Button';
import toast from 'react-hot-toast';

interface AdminActionButtonsProps {
  propertyId: number;
  documentUrl?: string;
  onActionComplete?: () => void; // Add optional callback
}

export const AdminActionButtons = ({ propertyId, documentUrl, onActionComplete }: AdminActionButtonsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState< 'approve' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (status: 'APPROVED' | 'REJECTED') => {
    setIsLoading(status === 'APPROVED' ? 'approve' : 'reject');
    setError(null);
    try {
      await updatePropertyStatus(propertyId, status);
      toast.success(`Property has been ${status.toLowerCase()}.`); 
      
      // If the callback exists (we're in a modal), call it. Otherwise, use the router.
      if (onActionComplete) {
        onActionComplete();
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to update property status', err);
      setError('Could not update the property status. Please try again.');
      setIsLoading(null);
    }
  };
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="font-bold text-yellow-800">Admin Review</p>
          <p className="text-sm text-yellow-700">This property is pending your approval.</p>
        </div>
        <div className="flex items-center space-x-2">
          {documentUrl && (
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="!px-4 !py-2">
                View Document
              </Button>
            </a>
          )}
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate('REJECTED')}
            disabled={!!isLoading}
            className="!px-4 !py-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          >
            {isLoading === 'reject' ? 'Rejecting...' : 'Reject'}
          </Button>
          <Button
            onClick={() => handleStatusUpdate('APPROVED')}
            disabled={!!isLoading}
            className="!px-4 !py-2"
          >
            {isLoading === 'approve' ? 'Approving...' : 'Approve'}
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
    </div>
  );
};