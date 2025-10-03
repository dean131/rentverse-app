// Create a new file at: frontend/src/features/admin/components/UserList.tsx
'use client';

import { AdminUserEntry } from "@/lib/definitions";
import Image from "next/image";

const RoleBadge = ({ role }: { role: 'PROPERTY_OWNER' | 'TENANT' }) => {
    const roleStyles = {
        PROPERTY_OWNER: 'bg-blue-100 text-blue-800',
        TENANT: 'bg-indigo-100 text-indigo-800',
    };
    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${roleStyles[role]}`}>
            {role.replace('_', ' ').toLowerCase()}
        </span>
    );
};

export const UserList = ({ users }: { users: AdminUserEntry[] }) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Joined</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <Image className="h-10 w-10 rounded-full object-cover" src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${user.fullName}`} alt="" width={40} height={40} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap"><RoleBadge role={user.role} /></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};