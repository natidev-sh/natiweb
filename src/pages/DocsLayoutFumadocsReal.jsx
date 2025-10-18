import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Menu, X, Command, ChevronDown, Moon, Sun, Sparkles, Zap } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';

export default function DocsLayoutFumadocsReal() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('desktop');
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Search functionality
  const searchablePages = [
    { title: 'Introduction', url: '/docs', content: 'Getting started with Nati.dev' },
    { title: 'Installation', url: '/docs/installation', content: 'Install Nati.dev on macOS or Windows' },
    { title: 'Quick Start', url: '/docs/getting-started', content: 'Create your first AI application' },
    { title: 'Teams', url: '/docs/teams', content: 'Team collaboration and sharing' },
    { title: 'API Reference', url: '/docs/api-reference', content: 'Complete API documentation' },
  ];

  const searchResults = searchQuery.length > 0
    ? searchablePages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Keyboard shortcut
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar - Fumadocs Notebook style */}
      <nav className="sticky top-0 z-50 w-full border-b bg-fd-background/95 backdrop-blur supports-[backdrop-filter]:bg-fd-background/60">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4">
          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-fd-accent hover:text-fd-accent-foreground md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link to="/docs" className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-fd-primary text-fd-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline-block">Nati.dev</span>
          </Link>

          {/* Search */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-9 w-full items-center justify-start gap-2 rounded-md border border-fd-input bg-fd-background px-3 text-sm text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground sm:w-64"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-fd-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Links */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/"
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-fd-background/80 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2 border bg-fd-background shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border-b px-4">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-fd-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="rounded p-2 hover:bg-fd-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2">
              {searchQuery.length === 0 ? (
                <div className="py-8 text-center text-sm text-fd-muted-foreground">
                  Type to search documentation...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-sm text-fd-muted-foreground">
                  No results found.
                </div>
              ) : (
                searchResults.map((result, idx) => (
                  <Link
                    key={idx}
                    to={result.url}
                    onClick={() => { setSearchOpen(false); setSidebarOpen(false); }}
                    className="flex flex-col gap-1 rounded-md p-3 hover:bg-fd-accent"
                  >
                    <div className="font-medium">{result.title}</div>
                    <div className="text-xs text-fd-muted-foreground">{result.content}</div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Container */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1">
        {/* Sidebar */}
        <aside className={`w-64 shrink-0 border-r ${sidebarOpen ? 'fixed inset-y-0 left-0 z-40 bg-fd-background' : 'hidden'} md:sticky md:top-14 md:block md:h-[calc(100vh-3.5rem)] md:overflow-y-auto`}>
          <div className="p-4">
            {/* Close button (mobile) */}
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="mb-4 md:hidden">
                <X className="h-5 w-5" />
              </button>
            )}

            {/* Pro Banner */}
            <div className="mb-4 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4 dark:border-blue-900 dark:from-blue-950/50 dark:to-purple-950/50">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Nati Pro</div>
                  <div className="text-xs text-fd-muted-foreground">Team collaboration</div>
                </div>
              </div>
              <p className="mb-3 text-xs text-fd-muted-foreground">
                Unlock advanced features, team workspaces, and priority support.
              </p>
              <Link
                to="/onboarding/pricing"
                className="inline-flex h-8 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-3 text-xs font-medium text-white hover:from-blue-700 hover:to-purple-700"
              >
                Upgrade now →
              </Link>
            </div>

            {/* Sidebar Tabs */}
            <div className="mb-4 flex gap-1 rounded-lg border bg-fd-muted p-1">
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'desktop'
                    ? 'bg-fd-background shadow-sm'
                    : 'text-fd-muted-foreground hover:text-fd-foreground'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'web'
                    ? 'bg-fd-background shadow-sm'
                    : 'text-fd-muted-foreground hover:text-fd-foreground'
                }`}
              >
                Web
              </button>
            </div>

            {/* Navigation - Desktop Tab */}
            {activeTab === 'desktop' && (
              <nav className="space-y-6">
                {/* Getting Started */}
                <div>
                  <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
                    Getting Started
                  </h4>
                  <div className="space-y-0.5">
                    <Link
                      to="/docs"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Introduction
                    </Link>
                    <Link
                      to="/docs/installation"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/installation'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Installation
                    </Link>
                    <Link
                      to="/docs/getting-started"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/getting-started'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Quick Start
                    </Link>
                  </div>
                </div>

                {/* Core Concepts */}
                <div>
                  <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
                    Core Concepts
                  </h4>
                  <div className="space-y-0.5">
                    <Link
                      to="/docs/apps"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/apps'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Apps
                    </Link>
                    <Link
                      to="/docs/workflows"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/workflows'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Workflows
                    </Link>
                    <Link
                      to="/docs/integrations"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/integrations'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Integrations
                    </Link>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
                    Features
                  </h4>
                  <div className="space-y-0.5">
                    <Link
                      to="/docs/teams"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/teams'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Teams
                    </Link>
                    <Link
                      to="/docs/deployment"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/deployment'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Deployment
                    </Link>
                  </div>
                </div>
              </nav>
            )}

            {/* Navigation - Web Tab */}
            {activeTab === 'web' && (
              <nav className="space-y-6">
                {/* Web Dashboard */}
                <div>
                  <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
                    Dashboard
                  </h4>
                  <div className="space-y-0.5">
                    <Link
                      to="/docs/web-dashboard"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/web-dashboard'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Web Dashboard
                    </Link>
                    <Link
                      to="/docs/web-apps"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/web-apps'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Managing Apps
                    </Link>
                    <Link
                      to="/docs/web-workflows"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/web-workflows'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Building Workflows
                    </Link>
                  </div>
                </div>

                {/* API & Integration */}
                <div>
                  <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
                    API & Integration
                  </h4>
                  <div className="space-y-0.5">
                    <Link
                      to="/docs/api-reference"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/api-reference'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      API Reference
                    </Link>
                    <Link
                      to="/docs/webhooks"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/webhooks'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Webhooks
                    </Link>
                    <Link
                      to="/docs/authentication"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/authentication'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Authentication
                    </Link>
                  </div>
                </div>

                {/* SDKs */}
                <div>
                  <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
                    SDKs
                  </h4>
                  <div className="space-y-0.5">
                    <Link
                      to="/docs/sdk-javascript"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/sdk-javascript'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      JavaScript SDK
                    </Link>
                    <Link
                      to="/docs/sdk-python"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/sdk-python'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      Python SDK
                    </Link>
                    <Link
                      to="/docs/sdk-rest"
                      onClick={() => setSidebarOpen(false)}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        location.pathname === '/docs/sdk-rest'
                          ? 'bg-fd-accent font-medium text-fd-accent-foreground'
                          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
                      }`}
                    >
                      REST API
                    </Link>
                  </div>
                </div>
              </nav>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
