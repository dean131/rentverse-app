import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

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
      {/* Using a standard Tailwind background color */}
      <body className="bg-gray-50">
        <AuthProvider>
            <div>
              <Navbar />
              <main>
                {children}
              </main>
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}