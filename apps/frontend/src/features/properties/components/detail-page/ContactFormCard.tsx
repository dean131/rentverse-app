// Create a new file at: frontend/src/features/properties/components/detail-page/ContactFormCard.tsx

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/ui/ui/Button';
import { FormInput } from '@/ui/ui/FormInput';
import { FormTextarea } from '@/ui/ui/FormTextarea';
import { PropertyDetailed } from '@/lib/definitions'; // Assuming PropertyDetailed is accessible
import { submitInquiry } from '@/features/inquiries/inquiryService';

// Define the schema for the contact form
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  rentalStarting: z.string().optional(), // For rent inquiries
  rentalDuration: z.string().optional(), // For rent inquiries
  message: z.string().min(10, 'Message must be at least 10 characters'),
  acknowledgeOutsideCoverage: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge the property is outside coverage.',
  }),
  acknowledgeNoTransfer: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge the advice regarding money transfer.',
  }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

interface ContactFormCardProps {
  property: PropertyDetailed;
  isHighlighted: boolean;
}

export const ContactFormCard = ({ property, isHighlighted }: ContactFormCardProps) => {
  const [highlightClass, setHighlightClass] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    if (isHighlighted) {
      setHighlightClass('ring-2 ring-orange-400 ring-offset-2');
      const timer = setTimeout(() => {
        setHighlightClass('');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  const onSubmit = async (data: ContactFormInputs) => {
    setSubmissionStatus('loading');
    try {
      await submitInquiry({
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
        propertyId: property.id,
      });

      setSubmissionStatus('success');
      reset(); 
      alert("Your inquiry has been sent to the agent!");
    } catch (error) {
      console.error('Failed to send inquiry:', error);
      setSubmissionStatus('error');
      alert("Failed to send inquiry. Please try again.");
    }
  };

  const isForRent = property.listingType === 'RENT' || property.listingType === 'BOTH';

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md sticky top-24 transition-all duration-300 ${highlightClass}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Contact us</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput 
          label="" 
          name="name" 
          register={register} 
          error={errors.name} 
          placeholder="Name" 
          icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        />
        <div className="flex items-center space-x-2">
            <span className="inline-flex items-center p-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 text-sm">
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" /></svg>
                +62
            </span>
            <div className="flex-grow">
                <FormInput 
                    label="" 
                    name="phone" 
                    register={register} 
                    error={errors.phone} 
                    placeholder="Phone" 
                    type="tel"
                />
            </div>
        </div>
        <FormInput 
          label="" 
          name="email" 
          register={register} 
          error={errors.email} 
          placeholder="Email" 
          icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />

        {isForRent && (
          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              label="" 
              name="rentalStarting" 
              register={register} 
              error={errors.rentalStarting} 
              placeholder="Rent Starting" 
              type="date"
              icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M11 12h.01M15 12h.01M17 12h.01M7 16h.01M11 16h.01M15 16h.01M17 16h.01M3 20h18a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <FormInput 
              label="" 
              name="rentalDuration" 
              register={register} 
              error={errors.rentalDuration} 
              placeholder="Rental Duration" 
              icon={<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>
        )}

        <div className="text-sm text-gray-600">
            <label htmlFor="language" className="block mb-2 font-medium">What is your preferred Language?</label>
            <div className="relative">
                <select id="language" className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:ring-orange-400 focus:border-orange-400">
                    <option value="English">English</option>
                    <option value="Malay">Malay</option>
                    <option value="Chinese">Chinese</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.5M10 20v-5a2 2 0 00-2-2H7a2 2 0 01-2-2v-1a2 2 0 00-2-2H3m3.055 11H9a2 2 0 002-2v-1a2 2 0 012-2 2 2 0 002-2V7.055m-9 11h9" /></svg>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
        </div>

        <FormTextarea 
          label="" 
          name="message" 
          register={register} 
          error={errors.message} 
          rows={5} 
          placeholder={`I am interested in ${property.listingType === 'RENT' ? 'renting' : 'buying'} this ${property.propertyType.toLowerCase()} in ${property.address} and would like to schedule a viewing. Please let me know when this would be possible.`} 
        />

        <div className="space-y-2">
            <label className="flex items-center text-sm text-gray-700">
                <input 
                    type="checkbox" 
                    {...register('acknowledgeOutsideCoverage')} 
                    className="form-checkbox h-4 w-4 text-orange-400 rounded focus:ring-orange-400"
                />
                <span className="ml-2">I acknowledge this property is outside coverage</span>
            </label>
            {errors.acknowledgeOutsideCoverage && <p className="text-red-600 text-xs mt-1">{errors.acknowledgeOutsideCoverage.message}</p>}

            <label className="flex items-center text-sm text-gray-700">
                <input 
                    type="checkbox" 
                    {...register('acknowledgeNoTransfer')} 
                    className="form-checkbox h-4 w-4 text-orange-400 rounded focus:ring-orange-400"
                />
                <span className="ml-2">I acknowledge the advice to never transfer money before viewing the property and signing a formal contract</span>
            </label>
            {errors.acknowledgeNoTransfer && <p className="text-red-600 text-xs mt-1">{errors.acknowledgeNoTransfer.message}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full mt-6" 
          disabled={submissionStatus === 'loading'}
        >
          {submissionStatus === 'loading' ? 'Sending...' : 'SEND NOW'}
        </Button>
        {submissionStatus === 'error' && <p className="text-red-600 text-sm text-center mt-2">Error sending inquiry. Please try again.</p>}
      </form>

      <p className="text-xs text-gray-500 mt-6 leading-relaxed">
        By ticking this box, you agree that your enquiry will be sent to an external agent or the individual who posted this listing. FazWaz.my only facilitates this connection and is not responsible for the property, listing accuracy, or any subsequent interactions. We strongly advise against transferring money before personally viewing the property and signing a formal contract. Your personal data may be shared with the external agent or lister as necessary for this enquiry.
      </p>
    </div>
  );
};