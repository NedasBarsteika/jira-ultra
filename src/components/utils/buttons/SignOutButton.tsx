'use client';

import { useRouter } from 'next/navigation';

import CustomButton from '@/components/utils/buttons/CustomButton';
import { signOutAction } from '@/server/auth/auth-actions';

export default function SignOutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOutAction();
    router.push('/signin');
  }

  return <CustomButton onClick={() => void handleLogout()}>Sign Out</CustomButton>;
}
