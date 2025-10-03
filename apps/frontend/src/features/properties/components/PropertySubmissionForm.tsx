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
import { Button } from '@/ui/ui/Button';
import { submitProperty } from '@/features/properties/propertyService';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card } from '@/ui/ui/Card';
import toast from 'react-hot-toast'; 

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
        watch,
    } = useForm<PropertySubmission>({
        resolver: zodResolver(propertySubmissionSchema),
        mode: 'onBlur',
    });
    
    const fieldsByStep: Record<number, Path<PropertySubmission>[]> = {
        1: ["title", "description", "listingType", "propertyType", "bedrooms", "bathrooms", "sizeSqft", "furnishingStatus", "rentalPrice", "paymentPeriod", "ownershipDocumentUrl"],
        2: ["projectId", "address", "latitude", "longitude"],
        3: ["viewIds", "amenityIds"],
        4: ["images"],
    };

    const onSubmit = async (data: PropertySubmission) => {
        setServerError(null);
        try {
            await submitProperty(data);
            toast.success("Property submitted successfully! It is now pending admin approval.");
            router.push('/admin/dashboard');
        } catch (error) {
            console.error("Failed to submit property:", error);
            if (axios.isAxiosError(error) && error.response) {
                const message = error.response.data?.message || "An error occurred on the server.";
                setServerError(`Failed to submit property: ${message}`);
            } else {
                setServerError(`Failed to submit property: An unexpected error occurred.`);
            }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <FormStepper currentStep={currentStep} totalSteps={totalSteps} />
            </div>
            
            <div className="md:col-span-3">
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {currentStep === 1 && <Step1Details register={register} errors={errors} watch={watch} setValue={setValue} />}
                        {currentStep === 2 && <Step2Location register={register} errors={errors} watch={watch} setValue={setValue} />}
                        {currentStep === 3 && <Step3Features register={register} errors={errors} />}
                        {currentStep === 4 && <Step4UploadPhotos setValue={setValue} errors={errors} />}

                        {serverError && <p className="text-sm text-red-600 mt-4 text-center">{serverError}</p>}

                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
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
                </Card>
            </div>
        </div>
    );
};
