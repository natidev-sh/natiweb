import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/theme/ThemeProvider';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Table of Contents Component
function TableOfContents({ headings }) {
  if (!headings || headings.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-2">
      <h4 className="text-sm font-semibold mb-4">On This Page</h4>
      <div className="space-y-2">
        {headings.map((heading, idx) => (
          <a
            key={idx}
            href={`#${heading.id}`}
            className={cn(
              "block text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors",
              heading.level === 2 && "pl-0",
              heading.level === 3 && "pl-3",
              heading.level === 4 && "pl-6"
            )}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  );
}

// Code Block with Copy Button
function CodeBlock({ children, className, ...props }) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!language) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-[var(--muted)] text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? vscDarkPlus : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function DocsPage() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const docSlug = slug || 'index';

  useEffect(() => {
    async function loadDoc() {
      setLoading(true);
      try {
        const response = await fetch(`/content/docs/${docSlug}.mdx`);
        if (!response.ok) throw new Error('Doc not found');
        
        const text = await response.text();
        
        // Extract frontmatter
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = text.match(frontmatterRegex);
        
        if (match) {
          const frontmatter = match[1];
          const markdown = match[2];
          
          // Parse frontmatter
          const meta = {};
          frontmatter.split('\n').forEach(line => {
            const [key, ...values] = line.split(':');
            if (key && values.length) {
              meta[key.trim()] = values.join(':').trim();
            }
          });
          
          setMetadata(meta);
          setContent(markdown);
          
          // Extract headings for TOC
          const headingMatches = [...markdown.matchAll(/^(#{1,4})\s+(.+)$/gm)];
          const toc = headingMatches.map(match => ({
            level: match[1].length,
            text: match[2],
            id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          }));
          setHeadings(toc);
        } else {
          setContent(text);
        }
      } catch (error) {
        console.error('Failed to load doc:', error);
        setContent('# Page Not Found\n\nThe requested documentation page could not be found.');
      } finally {
        setLoading(false);
      }
    }

    loadDoc();
  }, [docSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading...</div>
      </div>
    );
  }

  const components = {
    code: CodeBlock,
    h1: ({ children, ...props }) => (
      <h1 className="text-4xl font-bold mb-4 mt-8" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return (
        <h2 id={id} className="text-3xl font-bold mb-3 mt-8 scroll-mt-24" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return (
        <h3 id={id} className="text-2xl font-bold mb-2 mt-6 scroll-mt-24" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return (
        <h4 id={id} className="text-xl font-semibold mb-2 mt-4 scroll-mt-24" {...props}>
          {children}
        </h4>
      );
    },
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-7 text-[var(--foreground)]/80" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-[var(--foreground)]/80" {...props}>{children}</li>
    ),
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-[var(--primary)] hover:underline inline-flex items-center gap-1"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
        {href?.startsWith('http') && <ExternalLink className="h-3 w-3" />}
      </a>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-[var(--primary)] pl-4 italic my-4 text-[var(--foreground)]/70" {...props}>
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-[var(--border)]" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="px-4 py-2 text-left font-semibold bg-[var(--muted)]" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-2 border-t border-[var(--border)]" {...props}>
        {children}
      </td>
    ),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-[1fr_250px] gap-8">
        {/* Main Content */}
        <article className="max-w-3xl">
          {metadata.title && (
            <div className="mb-8 pb-6 border-b border-[var(--border)]">
              <h1 className="text-4xl font-bold mb-2">{metadata.title}</h1>
              {metadata.description && (
                <p className="text-lg text-[var(--muted-foreground)]">
                  {metadata.description}
                </p>
              )}
            </div>
          )}
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown
              components={components}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }]
              ]}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Table of Contents */}
        <aside className="hidden lg:block">
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </div>
  );
}
