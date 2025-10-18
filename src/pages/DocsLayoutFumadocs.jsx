import React from 'react';
import { Outlet } from 'react-router-dom';
import { DocsLayout } from 'fumadocs-ui/layout';
import { RootProvider } from 'fumadocs-ui/provider';
import { BookOpen } from 'lucide-react';
import 'fumadocs-ui/style.css';

const baseOptions = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        <span className="font-bold">Nati.dev</span>
      </div>
    ),
    url: '/docs',
  },
  links: [
    {
      text: 'Home',
      url: '/',
    },
    {
      text: 'Dashboard',
      url: '/dashboard',
    },
  ],
};

export default function DocsLayoutFumadocs() {
  return (
    <RootProvider>
      <DocsLayout
        tree={[
          {
            type: 'folder',
            name: 'Getting Started',
            index: {
              type: 'page',
              name: 'Introduction',
              url: '/docs',
            },
            children: [
              {
                type: 'page',
                name: 'Installation',
                url: '/docs/installation',
              },
              {
                type: 'page',
                name: 'Quick Start',
                url: '/docs/getting-started',
              },
            ],
          },
          {
            type: 'folder',
            name: 'Features',
            children: [
              {
                type: 'page',
                name: 'Teams',
                url: '/docs/teams',
              },
              {
                type: 'page',
                name: 'API Reference',
                url: '/docs/api-reference',
              },
            ],
          },
        ]}
        {...baseOptions}
      >
        <Outlet />
      </DocsLayout>
    </RootProvider>
  );
}
