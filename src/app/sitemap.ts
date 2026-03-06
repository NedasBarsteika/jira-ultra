import { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/blogs/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://iterova.com';

  // Get all blog posts
  const posts = getAllPosts();

  // Create sitemap entries for blog posts
  const blogPosts: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-03-06'),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  return [...staticPages, ...blogPosts];
}
