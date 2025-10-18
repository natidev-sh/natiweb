import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import PageMeta from '@/components/PageMeta';

export default function DocsPageFumadocsReal() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);

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
            depth: match[1].length,
            title: match[2],
            url: `#${match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
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

  // Code block with copy button
  function CodeBlock({ children, className, ...props }) {
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
        <code className="rounded bg-fd-muted px-1 py-0.5 text-sm font-mono font-medium" {...props}>
          {children}
        </code>
      );
    }

    return (
      <div className="group relative my-6">
        <button
          onClick={handleCopy}
          className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-fd-border bg-fd-background text-sm font-medium transition-opacity opacity-0 group-hover:opacity-100 hover:bg-fd-accent"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
        <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-muted">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.7',
              background: 'transparent',
            }}
            showLineNumbers={false}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  const components = {
    code: CodeBlock,
    h1: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return (
        <h1 id={id} className="scroll-mt-20 text-3xl font-bold tracking-tight" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return (
        <h2 id={id} className="mt-10 scroll-mt-20 border-b pb-2 text-2xl font-semibold tracking-tight" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return (
        <h3 id={id} className="mt-8 scroll-mt-20 text-xl font-semibold tracking-tight" {...props}>
          {children}
        </h3>
      );
    },
    p: ({ children, ...props }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props}>{children}</ol>
    ),
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="font-medium text-fd-primary underline underline-offset-4 hover:text-fd-primary/80"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => {
      const text = children?.toString() || '';
      
      // Custom callouts - Fumadocs style
      if (text.includes('[!NOTE]') || text.includes('[!INFO]')) {
        return (
          <div className="my-6 flex gap-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4 leading-7 dark:border-blue-900/50 dark:bg-blue-950/50">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="flex-1 [&>p]:m-0">{children}</div>
          </div>
        );
      }
      if (text.includes('[!WARNING]')) {
        return (
          <div className="my-6 flex gap-3 rounded-lg border border-yellow-200 bg-yellow-50/50 p-4 leading-7 dark:border-yellow-900/50 dark:bg-yellow-950/50">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1 [&>p]:m-0">{children}</div>
          </div>
        );
      }
      if (text.includes('[!SUCCESS]')) {
        return (
          <div className="my-6 flex gap-3 rounded-lg border border-green-200 bg-green-50/50 p-4 leading-7 dark:border-green-900/50 dark:bg-green-950/50">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
            <div className="flex-1 [&>p]:m-0">{children}</div>
          </div>
        );
      }
      if (text.includes('[!ERROR]') || text.includes('[!DANGER]')) {
        return (
          <div className="my-6 flex gap-3 rounded-lg border border-red-200 bg-red-50/50 p-4 leading-7 dark:border-red-900/50 dark:bg-red-950/50">
            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <div className="flex-1 [&>p]:m-0">{children}</div>
          </div>
        );
      }
      
      return <blockquote className="mt-6 border-l-2 pl-6 italic text-fd-muted-foreground">{children}</blockquote>;
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-fd-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${metadata.title || 'Documentation'} | Nati.dev`}
        description={metadata.description || 'Nati.dev Documentation'}
      />

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-fd-muted-foreground">
            <Link to="/docs" className="hover:text-fd-foreground">
              Documentation
            </Link>
            <span>/</span>
            <span className="text-fd-foreground">{metadata.title || 'Page'}</span>
          </nav>

          {/* Header */}
          {metadata.title && (
            <div className="space-y-2 pb-8">
              <h1 className="text-3xl font-bold tracking-tight">{metadata.title}</h1>
              {metadata.description && (
                <p className="text-lg text-fd-muted-foreground">
                  {metadata.description}
                </p>
              )}
            </div>
          )}

          {/* Content with Fumadocs prose styling */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
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
        </div>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-20 space-y-2">
              <p className="font-semibold text-sm mb-4">On This Page</p>
              <nav className="space-y-2">
                {headings.map((heading, idx) => (
                  <a
                    key={idx}
                    href={heading.url}
                    className={`block text-sm transition-colors hover:text-fd-foreground ${
                      heading.depth === 1 ? 'font-medium text-fd-foreground' :
                      heading.depth === 2 ? 'pl-0 text-fd-muted-foreground' :
                      heading.depth === 3 ? 'pl-4 text-fd-muted-foreground' : 
                      'pl-8 text-fd-muted-foreground'
                    }`}
                  >
                    {heading.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
