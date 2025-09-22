// File Path: apps/frontend/src/components/admin/layout/Header.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export const Header = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white flex items-center justify-end px-8">
            <div className="flex items-center space-x-4">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    <Image 
                        src={'https://placehold.co/100x100/CCCCCC/FFFFFF/png?text=User'}
                        alt="User Profile"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">{user?.email}</p>
                    <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</p>
                </div>
            </div>
        </header>
    );
};

