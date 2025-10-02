'use client';

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export const FilterDropdown = ({ label, options, selectedValue, onValueChange }: FilterDropdownProps) => {
  return (
    <div>
      <label htmlFor={`filter-${label}`} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={`filter-${label}`}
          value={selectedValue}
          onChange={(e) => onValueChange(e.target.value)}
          className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};