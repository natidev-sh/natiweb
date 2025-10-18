import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import PageMeta from '@/components/PageMeta';
import { Calendar, User, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import UpgradeProBanner from '@/components/UpgradeProBanner';
import FooterGlow from '@/components/FooterGlow';
import TableOfContents from '@/components/TableOfContents';
import DownloadNatiBanner from '@/components/DownloadNatiBanner';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';

const extractHeadings = (markdown) => {
  if (!markdown) return [];
  const headings = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    // Match headings from h1 to h4
    const match = line.match(/^(#{1,4})\s+(.*)/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
      });
    }
  }
  return headings;
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navPosts, setNavPosts] = useState({ prev: null, next: null });
  const [headings, setHeadings] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchPostData() {
      if (!slug) return;
      setLoading(true);
      setPost(null);
      setNavPosts({ prev: null, next: null });
      setHeadings([]);

      const { data: currentPost, error } = await supabase
        .from('posts')
        .select(`
          title,
          content,
          published_at,
          meta_description,
          featured_image_url,
          profiles ( first_name, last_name, avatar_url ),
          categories ( name, slug )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
        return;
      }
      
      setPost(currentPost);
      setHeadings(extractHeadings(currentPost.content));

      // Fetch previous and next posts
      const [prevPostRes, nextPostRes] = await Promise.all([
        supabase
          .from('posts')
          .select('title, slug')
          .eq('published', true)
          .lt('published_at', currentPost.published_at)
          .order('published_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('posts')
          .select('title, slug')
          .eq('published', true)
          .gt('published_at', currentPost.published_at)
          .order('published_at', { ascending: true })
          .limit(1)
          .single()
      ]);

      setNavPosts({ prev: prevPostRes.data, next: nextPostRes.data });
      setLoading(false);
    }
    fetchPostData();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="opacity-70 mb-6">The post you're looking for doesn't exist or hasn't been published yet.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)]">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  const authorName = post.profiles ? `${post.profiles.first_name} ${post.profiles.last_name}`.trim() : 'The Nati Team';
  const words = post.content?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(words / 200);

  return (
    <>
      <PageMeta
        title={`${post.title} | Nati.dev Blog`}
        description={post.meta_description}
      />
      <div className="py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3 lg:order-first"> {/* Changed order to first */}
            <aside className="lg:sticky top-24 self-start hidden lg:block lg:pr-8"> {/* Added right padding */}
              <TableOfContents headings={headings} />
            </aside>
          </div>

          <div className="lg:col-span-9"> {/* Adjusted span for main content */}
            <div className="max-w-3xl">
              <div className="text-sm opacity-70 mb-4">
                <Link to="/blog" className="hover:text-[var(--primary)]">Blog</Link>
                <span className="mx-2">/</span>
                <span className="text-[var(--foreground)]">{post.title}</span>
              </div>
            </div>
            <article className="max-w-3xl">
              <header className="mb-8">
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map(cat => (
                      <Link key={cat.slug} to={`/blog?category=${cat.slug}`} className="text-xs px-2 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">{post.title}</h1>
                <div className="flex items-center gap-6 text-sm opacity-80">
                  <div className="flex items-center gap-2">
                    {post.profiles?.avatar_url ? (
                      <img src={post.profiles.avatar_url} alt={authorName} className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[var(--muted)] flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span>{authorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </header>
              
              {post.featured_image_url && (
                <div className="mb-8 rounded-xl overflow-hidden aspect-video shadow-lg shadow-[var(--primary)]/10">
                  <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className={cn(
                "prose prose-lg max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)]/80 prose-a:text-[var(--primary)] prose-strong:text-[var(--foreground)] prose-blockquote:border-l-[var(--primary)]",
                theme === 'dark' && "prose-invert"
              )}>
                <ReactMarkdown rehypePlugins={[rehypeSlug]} remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
              </div>

              <DownloadNatiBanner />
              <UpgradeProBanner />

              <nav className="mt-16 flex justify-between items-center border-t border-[var(--border)] pt-8">
                {navPosts.prev ? (
                  <Link to={`/blog/${navPosts.prev.slug}`} className="text-left group">
                    <p className="text-sm opacity-70 mb-1">Previous Post</p>
                    <p className="flex items-center gap-2 text-[var(--primary)] group-hover:underline">
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      {navPosts.prev.title}
                    </p>
                  </Link>
                ) : <div />}
                {navPosts.next ? (
                  <Link to={`/blog/${navPosts.next.slug}`} className="text-right group">
                    <p className="text-sm opacity-70 mb-1">Next Post</p>
                    <p className="flex items-center gap-2 text-[var(--primary)] group-hover:underline">
                      {navPosts.next.title}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </p>
                  </Link>
                ) : <div />}
              </nav>
            </article>
          </div>
        </div>
      </div>
      <FooterGlow />
    </>
  );
}