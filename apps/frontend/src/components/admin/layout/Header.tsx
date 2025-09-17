// File Path: apps/frontend/src/components/admin/layout/Header.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
    const { user } = useAuth();

    return (
        // CORRECTED: Changed from justify-between to justify-end to align the profile to the right
        <header className="h-20 bg-white border-b flex items-center justify-end px-8">
            {/* REMOVED: The search bar div has been removed from here */}
            
            {/* User Profile */}
            <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    {user?.email?.[0].toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">{user?.email}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
            </div>
        </header>
    );
};

