import { Navbar } from "@/components/layout/Navbar";
import { ReactNode } from "react";

// No need to import globals.css here, it's inherited from the root layout.

export default function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      {/* You could add a shared footer for the main app here */}
    </div>
  );
}

