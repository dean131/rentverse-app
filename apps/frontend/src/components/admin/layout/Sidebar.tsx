// File Path: apps/frontend/src/components/admin/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Icon } from './Icon';

export const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', iconD: 'M4 6h16M4 12h16M4 18h16' },
    { href: '/admin/pending', label: 'Pending', iconD: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/admin/approved', label: 'Approved', iconD: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/admin/rejected', label: 'Reject', iconD: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r hidden md:block">
      <div className="flex flex-col h-full">
        <div className="h-20 flex items-center justify-center border-b">
          <span className="text-2xl font-bold text-gray-800">RENTVERSE</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 
                ${pathname === item.href
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Icon d={item.iconD} />
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-6 border-t">
          {/* UPDATED: Added text-red-600 and hover states for the logout button */}
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
        <div className="px-4 py-2 text-center text-xs text-gray-400">
          © 2025 Rentverse
        </div>
      </div>
    </aside>
  );
};

