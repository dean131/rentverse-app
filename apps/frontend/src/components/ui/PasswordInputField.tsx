// File Path: apps/frontend/src/components/ui/PasswordInputField.tsx
'use client';

import { useState } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface PasswordInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const PasswordInputField = ({ label, id, registration, error, ...rest }: PasswordInputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">
            {label}
        </label>
        <div className="mt-1 relative">
            <input
                id={id}
                type={showPassword ? 'text' : 'password'}
                {...registration}
                {...rest}
                className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {/* Eye icon */}
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPassword ? (
                        <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.543 7a10.06 10.06 0 01-2.063 4.175" />
                        </>
                    ) : (
                        <>
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.879 9.879l4.242 4.242" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c1.78 0 3.44.474 4.908 1.285m5.418 2.378A9.962 9.962 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7-1.78 0-3.44-.474-4.908-1.285A9.97 9.97 0 012.458 12z" />
                        </>
                    )}
                </svg>
            </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
