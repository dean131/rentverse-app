// File Path: apps/frontend/src/app/(main)/layout.tsx
'use client'; 

import { Navbar } from "@/components/layout/Navbar";
import { ReactNode } from "react";

export default function MainAppLayout({ children }: { children: ReactNode }) {

  return (
    <div>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}

