// File Path: apps/frontend/src/components/properties/PropertySubmissionForm.tsx
'use client';

import { useState } from 'react';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySubmissionSchema, PropertySubmission } from '@/lib/definitions';
import { Step1Details } from './form-steps/Step1Details';
import { FormStepper } from './form-steps/FormStepper';
import { Button } from '@/components/ui/Button';

// We will add imports for other steps here as we build them.

export const PropertySubmissionForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4; // This will increase as we add more steps

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        trigger,
        watch,
        setValue
    } = useForm<PropertySubmission>({
        resolver: zodResolver(propertySubmissionSchema),
        mode: 'onChange',
    });
    
    // Define which fields belong to each step for validation
    const fieldsByStep: Record<number, Path<PropertySubmission>[]> = {
        1: ["title", "description", "listingType", "propertyType", "bedrooms", "bathrooms", "sizeSqft", "furnishingStatus", "rentalPrice", "paymentPeriod", "ownershipDocumentUrl"],
        // We will add fields for other steps here
    };

    const onSubmit = (data: PropertySubmission) => {
        console.log("Final Form Data:", data);
        alert("Property submitted! Check the console for the data.");
        // Later, we will call our API service here.
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
                    {/* Render the current step's component */}
                    {currentStep === 1 && <Step1Details register={register} errors={errors} watch={watch} setValue={setValue} />}
                    {/* We will add other steps here, e.g., {currentStep === 2 && <Step2Location />} */}

                    {/* Navigation Buttons */}
                    <div className="mt-8 pt-6 border-t flex justify-between">
                        {currentStep > 1 ? (
                            <Button type="button" variant="outline" onClick={handlePrevStep}>
                                Previous Step
                            </Button>
                        ) : (
                            <div /> // Placeholder to keep "Next" on the right
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

