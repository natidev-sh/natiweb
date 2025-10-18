import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PageMeta from '@/components/PageMeta';

export default function DocsPageFumadocs() {
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
            text: match[2],
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
        <code className="fd-code" {...props}>
          {children}
        </code>
      );
    },
  };

  if (loading) {
    return (
      <DocsPage toc={[]}>
        <DocsBody>
          <div className="flex items-center justify-center py-12">
            <div className="text-fd-muted-foreground">Loading...</div>
          </div>
        </DocsBody>
      </DocsPage>
    );
  }

  return (
    <>
      <PageMeta
        title={`${metadata.title || 'Documentation'} | Nati.dev`}
        description={metadata.description || 'Nati.dev Documentation'}
      />
      
      <DocsPage 
        toc={headings}
        tableOfContent={{
          enabled: true,
          style: 'clerk',
        }}
      >
        {metadata.title && <DocsTitle>{metadata.title}</DocsTitle>}
        {metadata.description && <DocsDescription>{metadata.description}</DocsDescription>}
        <DocsBody>
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
        </DocsBody>
      </DocsPage>
    </>
  );
}
