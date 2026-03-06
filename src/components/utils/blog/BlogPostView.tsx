'use client';

// import { useEffect } from 'react';
// import { useAnalytics } from '@/lib/useAnalytics';

interface BlogPostViewProps {
  title: string;
  slug: string;
  date: string;
}

export function BlogPostView({ title: _title, slug: _slug, date: _date }: BlogPostViewProps) {
  // const analytics = useAnalytics();

  // useEffect(() => {
  //   // Track blog post view when component mounts
  //   analytics.trackBlogPostView(title, slug, date);
  // }, [title, slug, date, analytics]);

  return null; // This component doesn't render anything
}
