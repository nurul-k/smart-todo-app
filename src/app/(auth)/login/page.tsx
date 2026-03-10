'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError(result?.error || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="rounded-3xl border border-white/30 bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          <div className="mb-8 text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="text-sm text-gray-600">
              Welcome back. Sign in to access your dashboard and manage your tasks.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>

          <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-5 text-xs sm:text-sm text-gray-700 border border-blue-100/50">
            <p className="mb-1 font-semibold">Demo Credentials:</p>
            <p>Email: user@example.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}