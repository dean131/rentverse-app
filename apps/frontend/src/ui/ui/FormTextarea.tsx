// File Path: frontend/src/ui/ui/FormTextarea.tsx

import { UseFormRegister, Path, FieldError } from 'react-hook-form';
import { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps<TFormValues extends Record<string, unknown>> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    name: Path<TFormValues>;
    register: UseFormRegister<TFormValues>;
    error?: FieldError;
}

export const FormTextarea = <TFormValues extends Record<string, unknown>>({ 
    label, 
    name, 
    register, 
    error, 
    ...props 
}: FormTextareaProps<TFormValues>) => (
    <div>
        {/* The label is now hidden if an empty string is passed */}
        {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <textarea
            id={name}
            {...register(name)}
            {...props}
            className={`block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-orange-500 sm:text-sm ${error ? 'border-red-500' : ''}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
);