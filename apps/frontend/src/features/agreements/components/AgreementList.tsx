'use client';

import { useState, useMemo } from 'react';
import { AgreementDetails } from '@/lib/definitions';
import { useAuth } from '@/features/auth/useAuth';
import { approveAgreement, getSigningUrl, downloadAgreementPdf } from '@/features/agreements/agreementService';
import { Button } from '@/ui/ui/Button';
import Image from 'next/image';
import axios from 'axios';
import { Pagination } from '@/ui/ui/Pagination';
import toast from 'react-hot-toast';

interface AgreementListProps {
  agreements: AgreementDetails[];
  onUpdate: () => void;
}

const ITEMS_PER_PAGE = 5;

const renderStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
        PENDING_OWNER_APPROVAL: 'bg-yellow-100 text-yellow-800',
        PENDING_SIGNATURES: 'bg-blue-100 text-blue-800',
        ACTIVE: 'bg-green-100 text-green-800',
        COMPLETED: 'bg-gray-100 text-gray-800',
        OWNER_REJECTED: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace(/_/g, ' ').toLowerCase()}
        </span>
    );
};

export const AgreementList = ({ agreements, onUpdate }: AgreementListProps) => {
    const { user } = useAuth();
    const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedAgreements = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return agreements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [agreements, currentPage]);

    const totalPages = Math.ceil(agreements.length / ITEMS_PER_PAGE);

    const handleAction = async (action: 'approve' | 'sign', agreementId: number) => {
        setLoadingStates(prev => ({ ...prev, [agreementId]: true }));
        setError(null);
        try {
            if (action === 'approve') {
                await approveAgreement(agreementId);
                toast.success("Agreement approved! A signing request has been sent."); 
            } else if (action === 'sign') {
                const signingUrl = await getSigningUrl(agreementId);
                window.location.href = signingUrl;
            }
            onUpdate(); // Refresh the list after any action
        } catch (err) {
            console.error(`Failed to ${action} agreement:`, err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.message || `Failed to ${action} agreement.`);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoadingStates(prev => ({ ...prev, [agreementId]: false }));
        }
    };

    const handleDownload = async (agreementId: number) => {
        setDownloadingId(agreementId);
        setError(null);
        try {
            const pdfBlob = await downloadAgreementPdf(agreementId);
            // Create a temporary link to trigger the browser download
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tenancy-agreement-${agreementId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(`Failed to download agreement:`, err);
            setError("Could not download the document at this time.");
        } finally {
            setDownloadingId(null);
        }
    };

    if (agreements.length === 0) {
        return <div className="p-6"><p className="text-gray-500 text-center py-10">You have no agreements yet.</p></div>
    }

    return (
        <div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Other Party</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dates</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedAgreements.map((agreement) => {
                            const isOwner = user?.userId === agreement.owner.id;
                            const otherParty = isOwner ? agreement.tenant : agreement.owner;
                            const isLoading = loadingStates[agreement.id];

                            return (
                                <tr key={agreement.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <Image className="h-10 w-10 rounded-md object-cover" src={agreement.property.images[0]?.imageUrl || 'https://placehold.co/100x100'} alt="" width={40} height={40} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{agreement.property.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{otherParty.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(agreement.startDate).toLocaleDateString()} - {new Date(agreement.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(agreement.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {isOwner && agreement.status === 'PENDING_OWNER_APPROVAL' && (
                                            <Button onClick={() => handleAction('approve', agreement.id)} disabled={isLoading} size="sm">
                                                {isLoading ? '...' : 'Approve'}
                                            </Button>
                                        )}
                                        {agreement.status === 'PENDING_SIGNATURES' && (
                                            <Button onClick={() => handleAction('sign', agreement.id)} disabled={isLoading} size="sm">
                                                {isLoading ? '...' : 'Sign Document'}
                                            </Button>
                                        )}
                                        {(agreement.status === 'ACTIVE' || agreement.status === 'COMPLETED') && (
                                            <Button variant="outline" onClick={() => handleDownload(agreement.id)} disabled={downloadingId === agreement.id} size="sm">
                                                {downloadingId === agreement.id ? 'Downloading...' : 'Download PDF'}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};