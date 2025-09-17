import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export const Card = ({ children, title, className }: CardProps) => {
  return (
    <div className={`w-full max-w-md bg-white p-8 shadow-md rounded-lg ${className}`}>
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">{title}</h2>
      {children}
    </div>
  );
};