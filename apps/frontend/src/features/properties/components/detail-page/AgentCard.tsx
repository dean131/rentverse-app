// File Path: frontend/src/features/properties/components/detail-page/AgentCard.tsx
import { useEffect, useState } from 'react';
import { PropertyDetailed } from '@/lib/definitions';
import Image from 'next/image';
import { Button } from '@/ui/ui/Button';

interface AgentCardProps {
  agent: PropertyDetailed['listedBy'];
  isHighlighted: boolean;
  propertyTitle: string; // Add propertyTitle to props
}

export const AgentCard = ({ agent, isHighlighted, propertyTitle }: AgentCardProps) => {
  const [highlightClass, setHighlightClass] = useState('');

  useEffect(() => {
    if (isHighlighted) {
      setHighlightClass('ring-2 ring-orange-400 ring-offset-2');
      const timer = setTimeout(() => {
        setHighlightClass('');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  // Construct the mailto link
  const mailtoLink = `mailto:${agent.email}?subject=Inquiry about ${encodeURIComponent(propertyTitle)}`;

  return (
    <div className={`bg-gray-50 p-6 rounded-lg sticky top-24 transition-all duration-300 ${highlightClass}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Listed By</h3>
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200">
          <Image 
            src={agent.profilePictureUrl || 'https://placehold.co/100x100/CCCCCC/FFFFFF/png?text=User'}
            alt={`Profile picture of ${agent.fullName}`}
            fill
            sizes="64px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div>
          <p className="font-bold text-gray-900">{agent.fullName}</p>
          <p className="text-sm text-gray-500">Property Owner</p>
        </div>
      </div>
      {/* Wrap the Button in an anchor tag to make it a functional link */}
      <a href={mailtoLink} className="w-full">
        <Button className="w-full mt-6">Contact Agent</Button>
      </a>
    </div>
  );
};