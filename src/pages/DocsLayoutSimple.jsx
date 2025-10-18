import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Sparkles, Menu, Search, X, Command } from 'lucide-react';

export default function DocsLayoutSimple() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();

  // Search data (simple implementation)
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

  // Keyboard shortcut for search
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
    <div className="min-h-screen bg-background">
      {/* Header - Shadcn style */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </button>

          {/* Logo */}
          <Link to="/docs" className="mr-6 flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="hidden font-bold sm:inline-block">Nati.dev</span>
          </Link>

          {/* Main nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm mr-4">
            <Link
              to="/docs"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Documentation
            </Link>
            <Link
              to="/blog"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Blog
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search documentation...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>

            {/* External links */}
            <nav className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-3"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-3"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-0 shadow-lg sm:rounded-lg">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="ml-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent h-8 w-8"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              {searchQuery.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Type to search documentation...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                <div className="p-2">
                  {searchResults.map((result, idx) => (
                    <Link
                      key={idx}
                      to={result.url}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        setSidebarOpen(false);
                      }}
                      className="flex flex-col items-start gap-2 rounded-md p-3 text-sm hover:bg-accent"
                    >
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">{result.content}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside
          className={`fixed top-14 z-30 -ml-2 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block ${
            sidebarOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="py-6 pr-6 lg:py-8">
            {/* Navigation - Shadcn style */}
            <nav className="grid items-start gap-2">
              {/* Getting Started Section */}
              <div className="pb-4">
                <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Getting Started</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link
                    to="/docs"
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                      location.pathname === '/docs' ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Introduction
                  </Link>
                  <Link
                    to="/docs/installation"
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                      location.pathname === '/docs/installation' ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Installation
                  </Link>
                  <Link
                    to="/docs/getting-started"
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                      location.pathname === '/docs/getting-started' ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Quick Start
                  </Link>
                </div>
              </div>

              {/* Features Section */}
              <div className="pb-4">
                <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Features</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link
                    to="/docs/teams"
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                      location.pathname === '/docs/teams' ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Teams
                  </Link>
                  <Link
                    to="/docs/api-reference"
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline ${
                      location.pathname === '/docs/api-reference' ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    API Reference
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
