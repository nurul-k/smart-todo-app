'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { registerUser } from '@/actions/auth.actions';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser(name, email, password);

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
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
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-600">Join us and manage your tasks efficiently.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-300 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-300 bg-green-50/80 px-4 py-3 text-sm text-green-700 backdrop-blur-sm">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
