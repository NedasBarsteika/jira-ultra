'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CustomButton from '@/components/utils/buttons/CustomButton';

export default function AuthButtons() {
  const pathname = usePathname();

  return (
    <>
      <Link href="/signin">
        <CustomButton variant={pathname === '/signin' ? 'solid' : 'outline'}>Login</CustomButton>
      </Link>
      <Link href="/signup">
        <CustomButton variant={pathname === '/signup' ? 'solid' : 'outline'}>Sign Up</CustomButton>
      </Link>
    </>
  );
}
