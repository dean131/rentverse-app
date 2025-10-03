// File Path: frontend/src/ui/ui/FormInput.tsx

import { UseFormRegister, Path, FieldError } from 'react-hook-form';
import { InputHTMLAttributes, ReactNode } from 'react';

// I've made this component generic to improve reusability across different forms
interface FormInputProps<TFormValues extends Record<string, unknown>> extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: Path<TFormValues>;
    register: UseFormRegister<TFormValues>;
    error?: FieldError;
    icon?: ReactNode; // Optional icon prop
}

export const FormInput = <TFormValues extends Record<string, unknown>>({ 
    label, 
    name, 
    register, 
    error, 
    icon,
    type = "text", 
    ...props 
}: FormInputProps<TFormValues>) => (
    <div>
        {/* The label is now hidden if an empty string is passed, for cleaner form layouts */}
        {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {icon}
                </div>
            )}
            <input 
                id={name}
                type={type}
                {...register(name)}
                {...props}
                className={`block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 py-2 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-orange-500 sm:text-sm ${error ? 'border-red-500' : ''} ${icon ? 'pl-10 pr-3' : 'px-3'}`}
            />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
);