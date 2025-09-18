// File Path: apps/frontend/src/components/properties/FilterDropdown.tsx
'use client';

import { useState } from 'react';

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export const FilterDropdown = ({ label, options, selectedValue, onValueChange }: FilterDropdownProps) => {
    // This is a basic implementation. A real-world version might use a library like Headless UI for accessibility.
    return (
        <div>
            <label htmlFor={`filter-${label}`} className="sr-only">{label}</label>
            <select
                id={`filter-${label}`}
                value={selectedValue}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:ring-orange-500 focus:border-orange-500"
            >
                <option value="">{label}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
};
