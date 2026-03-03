'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';

import CustomButton from '@/components/utils/buttons/CustomButton';

export default function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = pathname === '/about' || pathname === '/privacy';

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <CustomButton variant={isActive ? 'solid' : 'outline'}>Info</CustomButton>

      {isOpen && (
        <div className="absolute right-0 top-full pt-1">
          <div className="w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="py-1">
              <Link
                href="/about"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
