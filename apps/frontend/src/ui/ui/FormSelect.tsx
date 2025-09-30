// File Path: apps/frontend/src/components/ui/FormSelect.tsx
import { UseFormRegister, Path, FieldError } from 'react-hook-form';
import { PropertySubmission } from '@/lib/definitions';
import { SelectHTMLAttributes, ReactNode } from 'react';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: Path<PropertySubmission>;
    register: UseFormRegister<PropertySubmission>;
    error?: FieldError;
    children: ReactNode;
}

export const FormSelect = ({ label, name, register, error, children, ...props }: FormSelectProps) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            id={name}
            {...register(name)}
            {...props}
            // CORRECTED: Applied the consistent styling from the login form
            className={`block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-orange-500 sm:text-sm ${error ? 'border-red-500' : ''}`}
        >
            {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
);

