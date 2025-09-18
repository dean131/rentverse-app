// File Path: apps/frontend/src/components/ui/Button.tsx
import { type ComponentProps } from "react";

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'solid' | 'outline';
}

export const Button = ({ children, className, variant = 'solid', ...props }: ButtonProps) => {
  const baseClasses = "px-6 py-2 rounded-md font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // UPDATED: Reverted from brandOrange to standard orange-400 classes for better contrast
  const variantClasses = {
    solid: 'bg-orange-400 text-white hover:bg-orange-700 focus:ring-orange-400',
    outline: 'bg-transparent border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white focus:ring-orange-400',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

