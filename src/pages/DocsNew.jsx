import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DocsLayout } from 'fumadocs-ui/layout';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import PageMeta from '@/components/PageMeta';
import { useTheme } from '@/theme/ThemeProvider';

export default function Docs() {
  const { slug } = useParams();
  const { theme } = useTheme();
  
  // Get the page from the source
  const page = source.getPage(slug ? slug.split('/') : ['index']);
  
  if (!page) {
    return <Navigate to="/docs/index" replace />;
  }

  const MDX = page.data.body;

  return (
    <>
      <PageMeta
        title={`${page.data.title} | Nati.dev Docs`}
        description={page.data.description || 'Nati.dev Documentation'}
      />
      
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">Nati.dev</span>
            </div>
          ),
        }}
      >
        <DocsPage
          toc={page.data.toc}
          lastUpdate={page.data.lastModified}
          tableOfContent={{
            style: 'clerk',
          }}
        >
          <DocsTitle>{page.data.title}</DocsTitle>
          <DocsDescription>{page.data.description}</DocsDescription>
          <DocsBody>
            <MDX components={defaultMdxComponents} />
          </DocsBody>
        </DocsPage>
      </DocsLayout>
    </>
  );
}
