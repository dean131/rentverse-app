// File Path: apps/frontend/src/features/admin/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';
import { Icon } from './Icon';
import { Logo } from '@/ui/ui/Logo';
import Image from 'next/image';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', iconD: 'M4 6h16M4 12h16M4 18h16' },
    { href: '/admin/users', label: 'User Management', iconD: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
  ];
  
  const ownerLinks = [
      { href: '/admin/dashboard', label: 'Dashboard', iconD: 'M4 6h16M4 12h16M4 18h16' },
      { href: '/admin/agreements', label: 'My Agreements', iconD: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];
  const tenantLinks = [
       { href: '/admin/dashboard', label: 'Dashboard', iconD: 'M4 6h16M4 12h16M4 18h16' },
       { href: '/admin/agreements', label: 'My Agreements', iconD: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  const navItems = user?.role === 'ADMIN' ? adminLinks 
                 : user?.role === 'PROPERTY_OWNER' ? ownerLinks 
                 : tenantLinks;

  return (
    <aside className="w-64 flex-shrink-0 bg-white hidden md:block border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <Logo />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 
                ${(pathname.startsWith(item.href) && item.href !== '/') || pathname === item.href
                  ? 'bg-orange-400 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon d={item.iconD} />
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    <Image 
                        src={'https://placehold.co/100x100/CCCCCC/FFFFFF/png?text=User'}
                        alt="User Profile"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{user?.email}</p>
                    <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</p>
                </div>
                <button
                    onClick={logout}
                    className="p-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
                    aria-label="Logout"
                >
                    <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>
    </aside>
  );
};