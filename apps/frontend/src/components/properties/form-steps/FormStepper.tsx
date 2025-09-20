// File Path: apps/frontend/src/components/properties/form-steps/FormStepper.tsx
interface StepperProps {
    currentStep: number;
    totalSteps: number;
}

const Step = ({ stepNumber, title, isActive, isCompleted }: { stepNumber: number; title: string; isActive: boolean; isCompleted: boolean; }) => (
    <div className="flex items-center">
        <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold transition-colors ${isActive ? 'bg-orange-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {isCompleted ? '✓' : stepNumber}
        </div>
        <span className={`ml-4 font-medium transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600'}`}>
            {title}
        </span>
    </div>
);

export const FormStepper = ({ currentStep, totalSteps }: StepperProps) => {
    // UPDATED: Reverted back to the 4-step process
    const steps = [
        { number: 1, title: "Property Details" },
        { number: 2, title: "Location" },
        { number: 3, title: "Features & Amenities" },
        { number: 4, title: "Upload Photos" },
    ];

    return (
        <div className="p-8 border-r md:w-1/4 flex-shrink-0 bg-gray-50/50">
            <h2 className="font-semibold mb-6 text-gray-800">Property Information</h2>
            <div className="space-y-6">
                {steps.map(step => (
                    <Step 
                        key={step.number}
                        stepNumber={step.number}
                        title={step.title}
                        isActive={currentStep === step.number}
                        isCompleted={currentStep > step.number}
                    />
                ))}
            </div>
        </div>
    );
};

