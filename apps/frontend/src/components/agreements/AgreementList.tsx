// File Path: apps/frontend/src/components/agreements/AgreementList.tsx
'use client';

import { useState } from 'react';
import { AgreementDetails } from '@/lib/definitions';
import { useAuth } from '@/hooks/useAuth';
import { approveAgreement } from '@/services/agreementService';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import axios from 'axios';

interface AgreementListProps {
  agreements: AgreementDetails[];
  onUpdate: () => void; // Function to refetch agreements after an action
}

const AgreementCard = ({ agreement, onUpdate }: { agreement: AgreementDetails; onUpdate: () => void; }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isOwner = user?.userId === agreement.owner.id;

    const handleApprove = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await approveAgreement(agreement.id);
            alert("Agreement approved! A signing request has been sent via DocuSign.");
            onUpdate(); // Refresh the list
        } catch (err) {
            console.error("Failed to approve agreement:", err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.message || "Failed to approve.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStatusBadge = (status: string) => {
        const statusStyles: Record<string, string> = {
            PENDING_OWNER_APPROVAL: 'bg-yellow-100 text-yellow-800',
            PENDING_SIGNATURES: 'bg-blue-100 text-blue-800',
            ACTIVE: 'bg-green-100 text-green-800',
            OWNER_REJECTED: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.replace(/_/g, ' ').toLowerCase()}
            </span>
        );
    };

    return (
        <div className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={agreement.property.images[0]?.imageUrl || 'https://placehold.co/100x100'} alt={agreement.property.title} layout="fill" objectFit="cover" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{agreement.property.title}</p>
                    <p className="text-sm text-gray-500">
                        {isOwner ? `Tenant: ${agreement.tenant.fullName}` : `Owner: ${agreement.owner.fullName}`}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
                {renderStatusBadge(agreement.status)}
                {isOwner && agreement.status === 'PENDING_OWNER_APPROVAL' && (
                    <Button onClick={handleApprove} disabled={isLoading} size="sm" className="w-full sm:w-auto">
                        {isLoading ? 'Approving...' : 'Approve'}
                    </Button>
                )}
                 {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        </div>
    );
};


export const AgreementList = ({ agreements, onUpdate }: AgreementListProps) => {
    if (agreements.length === 0) {
        return <p className="text-gray-500 text-center py-10">You have no agreements yet.</p>
    }
    return (
        <div className="space-y-4">
            {agreements.map(agreement => (
                <AgreementCard key={agreement.id} agreement={agreement} onUpdate={onUpdate} />
            ))}
        </div>
    );
};

