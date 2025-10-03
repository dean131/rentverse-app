// File Path: apps/frontend/src/components/properties/detail-page/BookingModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/ui/ui/Button';
import { createAgreement } from '@/features/agreements/agreementService';
import axios from 'axios';
import toast from 'react-hot-toast'; 

interface BookingModalProps {
  propertyId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const DateInput = ({ label, id, value, onChange }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={id}
            type="date"
            value={value}
            onChange={onChange}
            className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-orange-500 sm:text-sm"
        />
    </div>
);


export const BookingModal = ({ propertyId, onClose, onSuccess }: BookingModalProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startDate || !endDate) {
      setError('Please select both a start and end date.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
        setError('End date must be after the start date.');
        return;
    }
    
    setIsSubmitting(true);
    try {
      await createAgreement({
        propertyId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      toast.success("Success! Your booking request has been sent for approval.");
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative transform transition-all animate-slide-up-fast">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-100 p-2 rounded-full">
                <svg className="h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Request to Book</h2>
                <p className="text-sm text-gray-500">Select your desired rental period.</p>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DateInput label="Start Date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <DateInput label="End Date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            {error && (
                <div className="bg-red-50 p-3 rounded-md text-center">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
            </div>
        </form>

      </div>
      {/* Add a little helper CSS for the animations */}
      <style jsx>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in-fast {
            animation: fadeIn 0.2s ease-out;
        }
        .animate-slide-up-fast {
            animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

