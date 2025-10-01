// File Path: apps/frontend/src/components/properties/form-steps/FormStepper.tsx
interface StepperProps {
    currentStep: number;
    totalSteps: number;
}

const Step = ({ stepNumber, title, isActive, isCompleted }: { stepNumber: number; title: string; isActive: boolean; isCompleted: boolean; }) => {
    const getIcon = () => {
        if (isCompleted) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            );
        }
        return stepNumber;
    };
    
    return (
        <div className="flex items-start">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-lg transition-colors flex-shrink-0 ${isActive ? 'bg-orange-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {getIcon()}
            </div>
            <div className="ml-4">
                <h4 className={`font-semibold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-800'}`}>
                    Step {stepNumber}
                </h4>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
    );
};

export const FormStepper = ({ currentStep, totalSteps }: StepperProps) => {
    const steps = [
        { number: 1, title: "Property Details" },
        { number: 2, title: "Location" },
        { number: 3, title: "Features & Amenities" },
        { number: 4, title: "Upload Photos" },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md sticky top-24">
            <h2 className="font-bold text-lg mb-6 text-gray-800">Property Information</h2>
            <div className="space-y-8">
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
