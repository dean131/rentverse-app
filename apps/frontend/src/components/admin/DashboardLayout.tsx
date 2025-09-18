// File Path: apps/frontend/src/components/admin/AdminLayout.tsx
import { ReactNode } from 'react';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

