// File Path: apps/frontend/src/components/properties/detail-page/PropertyInfoTabs.tsx
'use client';

import { useState } from 'react';
import { PropertyDetailed } from '@/lib/definitions';

interface TabsProps {
  description: string;
  amenities: PropertyDetailed['amenities'];
}

export const PropertyInfoTabs = ({ description, amenities }: TabsProps) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'amenities', label: 'Features & Amenities' },
  ];

  return (
    <div className="mt-8">
      {/* Tab Buttons */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'description' && (
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
        )}
        {activeTab === 'amenities' && (
           <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                {amenities.map(amenity => (
                    <li key={amenity.id} className="flex items-center text-gray-700">
                        <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        {amenity.name}
                    </li>
                ))}
            </ul>
        )}
      </div>
    </div>
  );
};

