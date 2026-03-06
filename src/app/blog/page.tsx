import Link from 'next/link';

import { getAllPosts } from '@/lib/blogs/posts';

export const metadata = {
  title: 'Blog Posts - Iterova',
  description:
    'Insights on AI-powered project management, sprint planning automation, and engineering team productivity.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-14 text-center px-6 bg-gradient-to-b from-primary/8 to-transparent">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs bg-primary/15 text-chart-3 mb-4">
            Blog
          </span>
          <h1 className="text-4xl text-foreground mb-3">Stories from the team</h1>
          <p className="text-muted-foreground">
            Insights on AI-powered project management, sprint planning automation, and engineering
            team productivity.
          </p>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row gap-8 hover:border-primary/40 transition-colors cursor-pointer group">
                {/* <div className="md:w-56 h-40 md:h-auto rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-4xl opacity-30 text-primary">✦</span>
                </div> */}
                <div className="flex-1">
                  <h2 className="text-foreground mb-3 group-hover:text-chart-3 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                      style={{ fontSize: 10 }}
                    >
                      {post.author
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>{' '}
                    <span className="text-xs text-muted-foreground">{post.author}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              ← Back to Home Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
