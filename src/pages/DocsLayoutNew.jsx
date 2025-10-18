import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DocsLayout } from 'fumadocs-ui/components/layout/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { BookOpen, Home, Sparkles } from 'lucide-react';

// Sidebar navigation structure
const pageTree = [
  {
    type: 'folder',
    name: 'Getting Started',
    index: {
      type: 'page',
      name: 'Introduction',
      url: '/docs',
      icon: <Home className="h-4 w-4" />,
    },
    children: [
      {
        type: 'page',
        name: 'Installation',
        url: '/docs/installation',
        description: 'Install Nati.dev on your machine',
      },
      {
        type: 'page',
        name: 'Quick Start',
        url: '/docs/getting-started',
        description: 'Create your first AI application',
      },
    ],
  },
  {
    type: 'separator',
    name: 'Features',
  },
  {
    type: 'folder',
    name: 'Core Features',
    defaultOpen: true,
    children: [
      {
        type: 'page',
        name: 'Teams',
        url: '/docs/teams',
        description: 'Collaborate with your team',
      },
      {
        type: 'page',
        name: 'API Reference',
        url: '/docs/api-reference',
        description: 'Complete API documentation',
      },
    ],
  },
];

export default function DocsLayoutNew() {
  return (
    <RootProvider
      search={{
        enabled: true,
        options: {
          type: 'static',
        },
      }}
    >
      <DocsLayout
        tree={pageTree}
        nav={{
          title: (
            <Link to="/docs" className="flex items-center gap-2 font-semibold">
              <BookOpen className="h-5 w-5" />
              <span>Nati.dev</span>
            </Link>
          ),
          url: '/docs',
          transparentMode: 'top',
        }}
        sidebar={{
          banner: (
            <div className="rounded-lg border bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Nati Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Team collaboration features
              </p>
              <Link
                to="/onboarding/pricing"
                className="text-xs font-medium text-primary hover:underline"
              >
                Upgrade now →
              </Link>
            </div>
          ),
          defaultOpenLevel: 0,
          collapsible: true,
        }}
        links={[
          {
            text: 'Home',
            url: '/',
            active: false,
          },
          {
            text: 'Dashboard',
            url: '/dashboard',
            active: false,
          },
          {
            text: 'Blog',
            url: '/blog',
            active: false,
          },
        ]}
      >
        <Outlet />
      </DocsLayout>
    </RootProvider>
  );
}
