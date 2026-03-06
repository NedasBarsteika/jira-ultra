import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JSX } from 'react';

import { BlogPostView } from '@/components/utils/blog/BlogPostView';
import { getAllPosts, getPostBySlug } from '@/lib/blogs/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog not found - Iterova',
    };
  }

  return {
    title: `${post.title} - Iterova Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const safeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

  // Helper function to sanitize URLs and prevent javascript: XSS
  const sanitizeUrl = (url: string): string => {
    const trimmedUrl = url.trim();

    // Allow only safe protocols: http, https, mailto
    const safeProtocols = ['http://', 'https://', 'mailto:'];
    const isAbsoluteUrl = trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#');

    // Check if URL starts with a safe protocol or is a relative/anchor URL
    const hasSafeProtocol = safeProtocols.some(protocol =>
      trimmedUrl.toLowerCase().startsWith(protocol)
    );

    if (hasSafeProtocol || isAbsoluteUrl) {
      return trimmedUrl;
    }

    // Block all other schemes (javascript:, data:, etc.) - use safe fallback
    return '#';
  };

  // Helper function to parse inline markdown links
  const parseLinks = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    const linkRegex = /\[([^\]]+)\]\(((?:[^()]+|\([^)]*\))+)\)/g;
    let match;
    let linkIndex = 0;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Sanitize the URL before using it in href
      const safeUrl = sanitizeUrl(match[2]);

      // Add the link
      parts.push(
        <a
          key={`link-${linkIndex++}`}
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-chart-3 hover:text-primary underline transition-colors duration-200"
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Convert markdown-style content to HTML-like format
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];
    let listType: 'ul' | 'ol' | null = null;
    let elementIndex = 0;

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListTag = listType;
        const listClass = listType === 'ul' ? 'list-disc' : 'list-decimal';
        elements.push(
          <ListTag key={`list-${elementIndex++}`} className={`mb-4 ${listClass} list-inside`}>
            {listItems}
          </ListTag>
        );
        listItems = [];
        listType = null;
      }
    };

    lines.forEach(line => {
      // Headings
      if (line.startsWith('### ')) {
        flushList();
        const text = line.replace('### ', '');
        elements.push(
          <h3
            key={`h3-${elementIndex++}`}
            className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4"
          >
            {parseLinks(text)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        const text = line.replace('## ', '');
        elements.push(
          <h2
            key={`h2-${elementIndex++}`}
            className="text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4"
          >
            {parseLinks(text)}
          </h2>
        );
      }
      // Bullet points
      else if (line.startsWith('- ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        const text = line.replace('- ', '');
        listItems.push(
          <li key={`li-${elementIndex++}`} className="text-muted-foreground leading-relaxed ml-6">
            {parseLinks(text)}
          </li>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        const text = line.replace(/^\d+\.\s/, '');
        listItems.push(
          <li key={`li-${elementIndex++}`} className="text-muted-foreground leading-relaxed ml-6">
            {parseLinks(text)}
          </li>
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        flushList();
        elements.push(<div key={`space-${elementIndex++}`} className="h-4"></div>);
      }
      // Regular paragraphs
      else {
        flushList();
        elements.push(
          <p key={`p-${elementIndex++}`} className="text-muted-foreground leading-relaxed mb-4">
            {parseLinks(line)}
          </p>
        );
      }
    });

    flushList(); // Don't forget the last list
    return elements;
  };

  // Article structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'Iterova',
      url: 'https://iterova.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />
      <main className="pt-24 md:pt-32 pb-16 md:pb-24 bg-background min-h-screen">
        <BlogPostView title={post.title} slug={post.slug} date={post.date} />
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-chart-3 hover:text-primary transition-colors duration-200 mb-8"
          >
            <ArrowLeft size={18} />
            Back to Blog Page
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <div
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                style={{ fontSize: 10 }}
              >
                {getInitials(post.author)}
              </div>
              <span>{post.author}</span>
              <span className="text-muted-foreground/30">·</span>
              <Calendar size={16} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground italic">{post.excerpt}</p>
          </header>

          {/* Divider */}
          <div className="h-px bg-border mb-8"></div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">{formatContent(post.content)}</div>

          {/* Author */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                NB
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mt-8 mb-8"></div>

          {/* Footer */}
          <footer>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-chart-3 hover:text-primary transition-colors duration-200"
            >
              <ArrowLeft size={18} />
              Back to Blog Page
            </Link>
          </footer>
        </article>
      </main>
    </>
  );
}
