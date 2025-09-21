// File Path: apps/frontend/src/components/admin/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Icon } from './Icon';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Define links for each role
  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', iconD: 'M4 6h16M4 12h16M4 18h16' },
  ];
  
  const ownerLinks = [
      { href: '/dashboard', label: 'Dashboard', iconD: 'M4 6h16M4 12h16M4 18h16' },
      { href: '/agreements', label: 'My Agreements', iconD: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];
  
  const tenantLinks = [
       { href: '/dashboard', label: 'Dashboard', iconD: 'M4 6h16M4 12h16M4 18h16' },
       { href: '/agreements', label: 'My Agreements', iconD: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  // Determine which set of links to show based on the user's role
  const navItems = user?.role === 'ADMIN' ? adminLinks 
                 : user?.role === 'PROPERTY_OWNER' ? ownerLinks 
                 : tenantLinks;

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r hidden md:block">
      <div className="flex flex-col h-full">
        <div className="h-20 flex items-center justify-center border-b">
          <Link href="/">
            <span className="text-2xl font-bold text-gray-800">RENTVERSE</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 
                ${(pathname.startsWith(item.href) && item.href !== '/') || pathname === item.href
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon d={item.iconD} />
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-6 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

