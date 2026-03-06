'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
// import { useAnalytics } from '@/lib/useAnalytics';

interface BlogPostLinkProps {
  href: string;
  title: string;
  slug: string;
  location: string;
}

export function BlogPostLink({
  href,
  title: _title,
  slug: _slug,
  location: _location,
}: BlogPostLinkProps) {
  // const analytics = useAnalytics();

  // const handleClick = async () => {
  //   try {
  //     await analytics.trackBlogPostClick(title, slug, location);
  //   } catch (error) {
  //     console.error('Analytics tracking failed:', error);
  //   }
  // };

  return (
    <Link
      href={href}
      // onClick={handleClick}
      className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors duration-200 group"
    >
      Skaityti daugiau
      <ArrowRight
        size={18}
        className="group-hover:translate-x-1 transition-transform duration-200"
      />
    </Link>
  );
}
