// File Path: apps/frontend/src/components/properties/PropertySubmissionForm.tsx
'use client';

import { useState } from 'react';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySubmissionSchema, PropertySubmission } from '@/lib/definitions';
import { Step1Details } from './form-steps/Step1Details';
import { Step2Location } from './form-steps/Step2Location';
import { Step3Features } from './form-steps/Step3Features';
import { Step4UploadPhotos } from './form-steps/Step4UploadPhotos';
import { FormStepper } from './form-steps/FormStepper';
import { Button } from '@/components/ui/Button';
import { submitProperty } from '@/services/propertyService'; // Import the service
import { useRouter } from 'next/navigation';

export const PropertySubmissionForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    const totalSteps = 4;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        trigger,
        setValue,
    } = useForm<PropertySubmission>({
        resolver: zodResolver(propertySubmissionSchema),
        mode: 'onChange',
    });
    
    const fieldsByStep: Record<number, Path<PropertySubmission>[]> = {
        1: ["title", "description", "rentalPrice", "paymentPeriod", "bedrooms", "bathrooms", "sizeSqft", "listingType", "propertyType", "furnishingStatus", "ownershipDocumentUrl"],
        2: ["projectId"],
        3: ["viewIds", "amenityIds"],
        4: ["images"],
    };

    const onSubmit = async (data: PropertySubmission) => {
        setServerError(null);
        try {
            await submitProperty(data);
            alert("Property submitted successfully! It is now pending admin approval.");
            router.push('/dashboard'); // Redirect to dashboard on success
        } catch (error) {
            console.error("Failed to submit property:", error);
            setServerError("Failed to submit property. Please try again later.");
        }
    };
    
    const handleNextStep = async () => {
        const fieldsToValidate = fieldsByStep[currentStep];
        const isValid = await trigger(fieldsToValidate);
        
        if (isValid && currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };
    
    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl md:flex">
            <FormStepper currentStep={currentStep} totalSteps={totalSteps} />
            
            <div className="p-8 flex-grow">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {currentStep === 1 && <Step1Details register={register} errors={errors} />}
                    {currentStep === 2 && <Step2Location register={register} errors={errors} />}
                    {currentStep === 3 && <Step3Features register={register} errors={errors} />}
                    {currentStep === 4 && <Step4UploadPhotos setValue={setValue} errors={errors} />}

                    {serverError && <p className="text-sm text-red-600 mt-4 text-center">{serverError}</p>}

                    <div className="mt-8 pt-6 border-t flex justify-between">
                        {currentStep > 1 ? (
                            <Button type="button" variant="outline" onClick={handlePrevStep}>
                                Previous Step
                            </Button>
                        ) : (
                            <div />
                        )}

                        {currentStep < totalSteps ? (
                             <Button type="button" onClick={handleNextStep}>
                                Next Step
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Property'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

