// File Path: apps/frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rentverse App",
  description: "An integrated property listing platform",
};

// This RootLayout is the top-level component for your entire application.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The AuthProvider wraps the entire application. This is what makes
            the useAuth() hook available to all child components and layouts.
            By placing it here at the root, we ensure that every page,
            including error pages, is within the context. */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

