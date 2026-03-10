'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const role = (session?.user as any)?.role;

  const dashboardHref =
    role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

    const isDashboardPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin/dashboard');

    const isGoalsPage = pathname.startsWith('/goals');
    const isGoalTrackerPage = pathname.startsWith('/goal-tracker');

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className=" sticky top-0 px-6 py-6 md:px-16 md:py-10 sm:px-10 sm:py-6 z-50 bg-[linear-gradient(to_right,blue_0%,purple_20%,black_65%,blue_140%)] shadow-lg backdrop-blur-xl bg-opacity-95">
      <nav className="nav-content max-w-7xl border-2 border-white  rounded-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg hover:scale-105 transition-transform duration-300"
          >
            ✨ Smart To-Do
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {status === 'loading' ? (
              <span className="text-sm font-bold text-gray-500">Loading...</span>
            ) : isAuthenticated ? (
              <>
                {!isDashboardPage && (
                <Link href={dashboardHref}>
                    <Button
                    className="dash-btn cursor-pointer"
                    variant="secondary"
                    size="md"
                    >
                    Dashboard
                    </Button>
                </Link>
                )}

                {!isGoalsPage && (
                <Link href="/goals">
                  <Button variant="secondary" size="md">
                    Goals
                  </Button>
                </Link>
              )}

              {!isGoalTrackerPage && (
                <Link href="/goal-tracker">
                  <Button variant="secondary" size="md">
                    Goal Tracker
                  </Button>
                </Link>
              )}

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSignOut}
                  className="signout-btn hover:scale-105 transition-transform cursor-pointer"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button className='sign-btn cursor-pointer' variant="secondary" size="md">
                    Login
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    variant="primary"
                    size="md"
                    className="sign-btn cursor-pionter hover:scale-105 transition-transform"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-white/20 shadow-lg px-4 py-4 space-y-3 animate-slide-in">
          {status === 'loading' ? (
            <span className="text-sm font-bold text-gray-500">Loading...</span>
          ) : isAuthenticated ? (
            <>
              {!isDashboardPage && (
                
                <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full mb-4">
                    Dashboard
                    </Button>
                </Link>
                )}

                {!isGoalsPage && (
                  <Link href="/goals" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full mb-2">
                      Goals
                    </Button>
                  </Link>
                )}

                {!isGoalTrackerPage && (
                  <Link href="/goal-tracker" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full mb-2">
                      Goal Tracker
                    </Button>
                  </Link>
                )}

              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  Login
                </Button>
              </Link>

              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}