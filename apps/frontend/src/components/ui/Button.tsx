// File Path: apps/frontend/src/components/ui/Button.tsx
'use client';

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  const combinedClassName = `
    w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm 
    text-base font-medium text-white bg-orange-500 hover:bg-orange-600 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
    ${className}
  `;
  
  return (
    <button
      {...props}
      className={combinedClassName}
    >
      {children}
    </button>
  );
};

