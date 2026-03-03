import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import AuthButtons from '@/components/layout/navbar/AuthButtons';
import NavLinks from '@/components/layout/navbar/NavLinks';
import SignOutButton from '@/components/utils/buttons/SignOutButton';
import { auth } from '@/lib/better-auth/auth';

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo_32x32.png"
            alt="Iterova Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Iterova</span>
        </Link>

        <div className="flex items-center gap-4">
          <NavLinks />
          {!session ? (
            <AuthButtons />
          ) : (
            <>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                User ID: {session.user.id}
              </span>
              <SignOutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
