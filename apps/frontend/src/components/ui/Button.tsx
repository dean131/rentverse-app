// File Path: apps/frontend/src/components/ui/Button.tsx
import { ReactNode, ButtonHTMLAttributes } from 'react';

// Extend the props to include all standard button attributes
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline'; // Add a variant prop
}

export const Button = ({ children, className, variant = 'default', ...props }: ButtonProps) => {
  // Define base styles that apply to all variants
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  // Define styles specific to each variant
  const variantStyles = {
    default: 'bg-orange-600 text-white hover:bg-orange-700',
    outline: 'border border-orange-600 bg-transparent text-orange-600 hover:bg-orange-50',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className} py-2 px-4`;
  
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

