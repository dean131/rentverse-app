// Create a new directory: frontend/src/app/(private)/admin/users/
// Create a new file inside it: frontend/src/app/(private)/admin/users/page.tsx

'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AdminUserEntry, PaginatedUsersResponse } from '@/lib/definitions';
import { getUsers } from '@/features/admin/adminService';
import { UserList } from '@/features/admin/components/UserList';
import { Pagination } from '@/ui/ui/Pagination';

const UserManagementContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [data, setData] = useState<PaginatedUsersResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentPage = Number(searchParams.get('page')) || 1;

    const fetchUsers = useCallback(async (page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getUsers(page);
            setData(result);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Could not load users. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <p className="text-gray-600 mt-1">View and manage all registered users in the system.</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
                </div>
                {isLoading && <p className="p-6">Loading users...</p>}
                {error && <p className="p-6 text-red-500">{error}</p>}
                {data && data.items.length > 0 && (
                    <>
                        <UserList users={data.items} />
                        <Pagination 
                            currentPage={data.currentPage} 
                            totalPages={data.totalPages} 
                            onPageChange={handlePageChange} 
                        />
                    </>
                )}
                 {data && data.items.length === 0 && <p className="p-6 text-center text-gray-500">No users found.</p>}
            </div>
        </div>
    );
};


export default function UserManagementPage() {
    return (
        <Suspense fallback={<div>Loading Page...</div>}>
            <UserManagementContent />
        </Suspense>
    )
}