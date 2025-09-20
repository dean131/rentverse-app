// File Path: apps/frontend/src/components/properties/detail-page/BookingModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createAgreement } from '@/services/agreementService';
import axios from 'axios';

interface BookingModalProps {
  propertyId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal = ({ propertyId, onClose, onSuccess }: BookingModalProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!startDate || !endDate) {
      setError('Please select both a start and end date.');
      setIsSubmitting(false);
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
        setError('End date must be after the start date.');
        setIsSubmitting(false);
        return;
    }

    try {
      await createAgreement({
        propertyId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      onSuccess();
    } catch (err) {
      console.error("Booking failed:", err);
      if (axios.isAxiosError(err) && err.response) {
          const message = err.response.data?.message || "An unexpected error occurred.";
          setError(message);
      } else {
          setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Request to Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input 
              type="date" 
              id="start-date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
            <input 
              type="date" 
              id="end-date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

