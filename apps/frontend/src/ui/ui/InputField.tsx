// File Path: apps/frontend/src/components/ui/InputField.tsx
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const InputField = ({ label, id, registration, error, ...rest }: InputFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          {...registration}
          {...rest}
          className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

