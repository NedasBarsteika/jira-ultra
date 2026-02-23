'use client';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signInAction } from '@/server/auth/auth-actions';

interface SigninFormData {
  email: string;
  password: string;
}

export default function SigninClient() {
  const router = useRouter();
  const [formData, setFormData] = useState<SigninFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    setIsLoading(true);
    try {
      await signInAction(formData.email, formData.password);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      router.push('/');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2f2b47] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1f1b36] p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">{'SIGN IN'}</h1>
        </div>

        {/* Form */}
        <form
          className="space-y-5"
          onSubmit={e => {
            void handleSubmit(e);
          }}
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-300">
              {'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#2a2545] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>{' '}
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">{'Password'}</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#2a2545] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg bg-red-600 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          {'Do not have an account? '}
          <a href="/signup" className="text-red-500 hover:underline">
            {'Sign up'}
          </a>
        </p>
      </div>
    </div>
  );
}
