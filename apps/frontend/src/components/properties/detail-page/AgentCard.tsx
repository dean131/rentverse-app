// File Path: apps/frontend/src/components/properties/detail-page/AgentCard.tsx
import { PropertyDetailed } from '@/lib/definitions';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface AgentCardProps {
  agent: PropertyDetailed['listedBy'];
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Listed By</h3>
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden">
          <Image 
            src={agent.profilePictureUrl || '/default-avatar.png'} // Fallback to a default avatar
            alt={`Profile picture of ${agent.fullName}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <p className="font-bold text-gray-900">{agent.fullName}</p>
          <p className="text-sm text-gray-500">Property Owner</p>
        </div>
      </div>
      <Button className="w-full mt-6">Contact Agent</Button>
    </div>
  );
};
