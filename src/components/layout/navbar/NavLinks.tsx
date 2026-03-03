'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CustomButton from '@/components/utils/buttons/CustomButton';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <Link href="/about">
      <CustomButton variant={pathname === '/about' ? 'solid' : 'outline'}>About</CustomButton>
    </Link>
  );
}
