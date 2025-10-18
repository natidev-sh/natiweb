import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  BookOpen, Search, Menu, X, ChevronRight, ChevronDown,
  Home, Download, Zap, Users, Code, FileText
} from 'lucide-react';
import PageMeta from '@/components/PageMeta';

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/index', icon: Home },
      { title: 'Installation', href: '/docs/installation', icon: Download },
      { title: 'Quick Start', href: '/docs/getting-started', icon: Zap },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Teams', href: '/docs/teams', icon: Users },
      { title: 'API Reference', href: '/docs/api-reference', icon: Code },
    ],
  },
];

export default function DocsFumadocs() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const docSlug = slug || 'index';

  useEffect(() => {
    // Expand all sections by default
    const expanded = {};
    navigation.forEach((section, idx) => {
      expanded[idx] = true;
    });
    setExpandedSections(expanded);
  }, []);

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

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <>
      <PageMeta
        title={`${metadata.title || 'Documentation'} | Nati.dev`}
        description={metadata.description || 'Nati.dev Documentation'}
      />

      <div className="min-h-screen bg-white dark:bg-zinc-950">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
          <div className="container flex h-14 items-center px-4">
            <div className="mr-4 flex lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 h-9 w-9"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
            <div className="mr-4 hidden lg:flex">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <span className="font-bold">Nati.dev</span>
              </Link>
            </div>
            <div className="flex flex-1 items-center space-x-2 justify-between">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="search"
                    placeholder="Search documentation..."
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-8 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-300 dark:focus:border-zinc-700 lg:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <nav className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          {/* Sidebar */}
          <aside className={`fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block overflow-y-auto border-r border-zinc-200 dark:border-zinc-800 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="py-6 pr-6 lg:py-8">
              <nav className="space-y-6">
                {navigation.map((section, sectionIdx) => (
                  <div key={sectionIdx}>
                    <button
                      onClick={() => toggleSection(sectionIdx)}
                      className="flex items-center justify-between w-full mb-2 px-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      {section.title}
                      {expandedSections[sectionIdx] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections[sectionIdx] && (
                      <div className="space-y-1">
                        {section.items.map((item, itemIdx) => {
                          const Icon = item.icon;
                          const isActive = `/docs/${docSlug}` === item.href || (docSlug === 'index' && item.href === '/docs/index');
                          return (
                            <Link
                              key={itemIdx}
                              to={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                                isActive
                                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                                  : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {item.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_250px]">
            <div className="mx-auto w-full min-w-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-zinc-500">Loading...</div>
                </div>
              ) : (
                <article className="prose prose-zinc dark:prose-invert max-w-none">
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
                </article>
              )}
            </div>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="hidden text-sm xl:block">
                <div className="sticky top-16 -mt-10 pt-10">
                  <div className="space-y-2">
                    <p className="font-medium">On This Page</p>
                    <ul className="space-y-2">
                      {headings.map((heading, idx) => (
                        <li
                          key={idx}
                          className={`${
                            heading.level === 2 ? 'pl-0' :
                            heading.level === 3 ? 'pl-3' : 'pl-6'
                          }`}
                        >
                          <a
                            href={`#${heading.id}`}
                            className="inline-block text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 no-underline"
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
