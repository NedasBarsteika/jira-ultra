'use client';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import InputAdornment from '@mui/material/InputAdornment';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';
import { treeifyError } from 'zod';

import CustomButton from '@/components/utils/buttons/CustomButton';
import { Checkbox } from '@/components/utils/CheckBox';
import { Input } from '@/components/utils/inputs/input';
import { Label } from '@/components/utils/Label';
import { signInSchema } from '@/lib/validation/auth';
import { signInAction } from '@/server/auth/auth-actions';

interface FieldErrors {
  email?:
    | {
        errors: string[];
      }
    | undefined;
  password?:
    | {
        errors: string[];
      }
    | undefined;
}

export default function SignIn() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setFieldErrors({});
    setServerError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const values = {
      email: formData.get('email'),
      password: formData.get('password'),
      rememberMe: formData.get('remember') === 'on',
    };

    const result = signInSchema.safeParse(values);

    if (!result.success) {
      setFieldErrors(treeifyError(result.error).properties ?? {});
      setIsLoading(false);
      return;
    }

    const response = await signInAction(formData);

    if (!response.success) {
      if (response.fieldErrors) {
        setFieldErrors(response.fieldErrors);
      }

      if (response.serverError) {
        setServerError(response.serverError);
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    redirect('/');
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs for visual interest */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#8b7cf7]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#60a5fa]/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            {/* Subtle glow behind logo */}
            <div className="absolute inset-0 bg-linear-to-br from-[#8b7cf7]/15 to-[#60a5fa]/15 blur-3xl rounded-full scale-150" />
            {/* <img src={logoImg} alt="Iterova" className="relative h-16 w-16 object-contain" /> */}
          </div>
          <div className="text-center">
            <h1 className="text-2xl">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your account to continue
            </p>
          </div>
        </div>

        {/* Sign in form */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-xl">
          <form
            className="space-y-5"
            onSubmit={e => {
              void handleSubmit(e);
            }}
          >
            {/* Email */}
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                name="email"
                placeholder="you@example.com"
                startAdornment={
                  <InputAdornment position="start" sx={{ color: 'var(--muted-foreground)' }}>
                    <Mail size={16} />
                  </InputAdornment>
                }
              />
              {fieldErrors.email && (
                <>
                  <div className="flex items-center gap-1 pt-1">
                    <RiErrorWarningFill className="h-5 w-5 text-red-500" />

                    <p className="text-sm text-red-500">{fieldErrors.email.errors[0]}</p>
                  </div>
                </>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <button
                  type="button"
                  className="text-xs text-[#8b7cf7] hover:text-[#a78bfa] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  startAdornment={
                    <InputAdornment position="start" sx={{ color: 'var(--muted-foreground)' }}>
                      <Lock size={16} />
                    </InputAdornment>
                  }
                />
              </div>
              {fieldErrors.password && (
                <>
                  <div className="flex items-center gap-1 pt-1">
                    <RiErrorWarningFill className="h-5 w-5 text-red-500" />

                    <p className="text-sm text-red-500">{fieldErrors.password.errors[0]}</p>
                  </div>
                </>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Label className="text-sm text-muted-foreground cursor-pointer">
                {'Remember me'}
              </Label>
              <Checkbox id="remember" name="remember" />
            </div>

            {serverError && (
              <>
                <div className="flex items-center gap-1">
                  <RiErrorWarningFill className="h-5 w-5 text-red-500" />

                  <p className="text-sm text-red-500">{serverError}</p>
                </div>
              </>
            )}

            {/* Submit button */}
            <CustomButton
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="size-4 ml-2" />
            </CustomButton>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <CustomButton color="transparent" type="button" className="w-full">
              <GoogleIcon />
              Google
            </CustomButton>
            <CustomButton color="transparent" type="button" className="w-full">
              <GitHubIcon />
              GitHub
            </CustomButton>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <a href="/signup" className="text-[#8b7cf7] hover:text-[#a78bfa] transition-colors">
            Sign up for free
          </a>
        </p>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/60">
          By signing in, you agree to our{' '}
          <button className="hover:text-muted-foreground transition-colors">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="hover:text-muted-foreground transition-colors">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}
