import React, { useState, useEffect } from 'react';
import PageMeta from '@/components/PageMeta';
import FooterGlow from '@/components/FooterGlow';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import TableOfContents from '@/components/TableOfContents';
import { useParams, NavLink, Navigate } from 'react-router-dom';

const docNavItems = [
  { name: 'Introduction', slug: 'introduction' },
  { name: 'Deployment', slug: 'deployment' },
  // Add more documentation pages here
];

const extractHeadings = (markdown) => {
  if (!markdown) return [];
  const headings = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.*)/); // Match h1 to h4
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
      });
    }
  }
  return headings;
};

export default function Docs() {
  const { docSlug } = useParams();
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchDocsContent() {
      if (!docSlug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/src/docs/${docSlug}.md`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setMarkdownContent(text);
        setHeadings(extractHeadings(text));
      } catch (error) {
        console.error("Failed to fetch documentation content:", error);
        setMarkdownContent("Error loading documentation. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchDocsContent();
  }, [docSlug]);

  if (!docSlug) {
    return <Navigate to="/docs/introduction" replace />;
  }

  if (loading) {
    return (
      <>
        <PageMeta
          title="Documentation | Nati.dev"
          description="Explore the documentation for Nati.dev to learn how to build powerful AI applications locally."
        />
        <div className="flex flex-col items-center justify-center text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-[var(--primary)]/10 p-4 text-[var(--primary)]">
              <BookOpen className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Loading Documentation...</h1>
            <p className="max-w-md opacity-80 mb-8">
              Please wait while we load the documentation.
            </p>
          </motion.div>
        </div>
        <FooterGlow />
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${docSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Nati.dev Docs`}
        description="Explore the documentation for Nati.dev to learn how to build powerful AI applications locally."
      />
      <div className="py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3">
            <aside className="lg:sticky top-24 self-start lg:pr-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">Documentation</h3>
              <nav className="flex flex-col space-y-1">
                {docNavItems.map(item => (
                  <NavLink
                    key={item.slug}
                    to={`/docs/${item.slug}`}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                          : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </aside>
          </div>

          <div className="lg:col-span-6">
            <article className="max-w-none">
              <div className={cn(
                "prose prose-lg max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)]/80 prose-a:text-[var(--primary)] prose-strong:text-[var(--foreground)] prose-blockquote:border-l-[var(--primary)]",
                theme === 'dark' && "prose-invert"
              )}>
                <ReactMarkdown rehypePlugins={[rehypeSlug]} remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </article>
          </div>

          <div className="lg:col-span-3 lg:order-last">
            <aside className="lg:sticky top-24 self-start lg:pl-8">
              <TableOfContents headings={headings} />
            </aside>
          </div>
        </div>
      </div>
      <FooterGlow />
    </>
  );
}