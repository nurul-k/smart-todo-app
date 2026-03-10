import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthSessionProvider from '@/components/providers/SessionProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Smart To-Do - Role-Based Task Management',
  description: 'A secure, role-based todo application with user and admin dashboards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 via-white to-purple-50 text-[var(--foreground)] min-h-screen`}
      >
        <AuthSessionProvider>
          <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 w-full">
              {/* Main content wrapper */}
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
                {children}
              </div>
            </main>

            <Footer />
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}