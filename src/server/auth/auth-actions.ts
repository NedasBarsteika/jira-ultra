'use server';

import { headers } from 'next/headers';
import { ZodError } from 'zod';

import { auth } from '@/lib/better-auth/auth';
import { signInSchema, signUpSchema } from '@/lib/validation/auth';

export async function signUpAction(formData: FormData) {
  try {
    const rawData = {
      confirmPassword: formData.get('confirmPassword'),
      email: formData.get('email'),
      name: formData.get('name'),
      password: formData.get('password'),
      rememberMe: formData.get('remember') === 'on',
    };
    const validatedData = signUpSchema.parse(rawData);

    const { email, name, password, rememberMe } = validatedData;

    await auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
        rememberMe,
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        fieldErrors: error.flatten().fieldErrors,
        success: false,
      };
    }

    return {
      serverError: error instanceof Error ? error.message : 'An unexpected error occurred',
      success: false,
    };
  }
}

export async function signInAction(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
      rememberMe: formData.get('remember') === 'on',
    };
    const validatedData = signInSchema.parse(rawData);

    const { email, password, rememberMe } = validatedData;

    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe,
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        fieldErrors: error.flatten().fieldErrors,
        success: false,
      };
    }

    return {
      serverError: 'Invalid email or password',
      success: false,
    };
  }
}

export async function signOutAction() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  return result;
}
