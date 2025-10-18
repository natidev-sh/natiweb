import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import PageMeta from '@/components/PageMeta';

const docNavItems = [
  { 
    title: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/docs' },
      { name: 'Installation', href: '/docs/installation' },
      { name: 'Getting Started', href: '/docs/getting-started' },
    ]
  },
  {
    title: 'Features',
    items: [
      { name: 'Teams', href: '/docs/teams' },
      { name: 'API Reference', href: '/docs/api-reference' },
    ]
  }
];

export default function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <PageMeta
        title="Documentation | Nati.dev"
        description="Complete documentation for building AI applications with Nati.dev"
      />
      
      <div className="min-h-screen bg-[var(--background)]">
        {/* Mobile header */}
        <div className="sticky top-0 z-50 lg:hidden border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--primary)]" />
              <span className="font-semibold">Documentation</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="max-w-8xl mx-auto">
          <div className="flex">
            {/* Sidebar */}
            <aside className={`
              fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0
              border-r border-[var(--border)] bg-[var(--background)]
              transition-transform duration-200 ease-in-out
              lg:translate-x-0
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="hidden lg:flex items-center gap-2 px-6 py-5 border-b border-[var(--border)]">
                  <BookOpen className="h-6 w-6 text-[var(--primary)]" />
                  <span className="font-bold text-lg">Docs</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
                  {docNavItems.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                        {section.title}
                      </h4>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <NavLink
                            key={item.href}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isActive
                                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                  : 'text-[var(--foreground)]/70 hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                              }`
                            }
                          >
                            <ChevronRight className="h-4 w-4" />
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-[var(--border)] px-6 py-4">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Built with Fumadocs
                  </p>
                </div>
              </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main content */}
            <main className="flex-1 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
