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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The AuthProvider wraps the entire application, making user data
            and auth functions globally available to all components. */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

