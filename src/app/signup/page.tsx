'use client';
import { User, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signUpAction } from '@/server/auth/auth-actions';

interface SignUpFormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export default function SignupClient() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await signUpAction(formData.email, formData.password, formData.name);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
    try {
      await signUpAction(formData.email, formData.password, formData.name);
      router.push('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2f2b47] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1f1b36] p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">{'Create Account'}</h1>
        </div>

        {/* Form */}
        <form
          className="space-y-5"
          onSubmit={e => {
            void handleSubmit(e);
          }}
        >
          <div>
            <label className="mb-1 block text-sm text-gray-300">{'Email'}</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#2a2545] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">{'Username'}</label>
            <div className="relative">
              <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="name"
                type="text"
                placeholder="yourusername"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#2a2545] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
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

          <div>
            <label className="mb-1 block text-sm text-gray-300">{'Confirm Password'}</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
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
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          {'Already have an account? '}
          <a href="/signin" className="text-red-500 hover:underline">
            {'Sign in'}
          </a>
        </p>
      </div>
    </div>
  );
}
