// File Path: apps/frontend/src/components/ui/Card.tsx
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string; // Made the title optional
}

export const Card = ({ children, title, className }: CardProps) => {
  const combinedClassName = `
    bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10
    ${className}
  `;
  
  return (
    <div className={combinedClassName}>
      {/* Conditionally render the title only if it's provided */}
      {title && (
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      )}
      {children}
    </div>
  );
};

