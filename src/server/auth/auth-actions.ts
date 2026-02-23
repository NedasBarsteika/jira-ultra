'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/better-auth/auth';

export async function signUpAction(email: string, password: string, name: string) {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      name,
      password,
      callbackURL: '/',
    },
    headers: await headers(),
  });

  return result;
}

export async function signInAction(email: string, password: string) {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: '/',
    },
    headers: await headers(),
  });

  return result;
}

export async function signOutAction() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  return result;
}
