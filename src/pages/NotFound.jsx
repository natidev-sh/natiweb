import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import PageMeta from '@/components/PageMeta';

export default function NotFound() {
  return (
    <>
      <PageMeta title="404 - Page Not Found | Nati.dev" />
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="mb-6 inline-flex items-center justify-center rounded-full bg-[var(--primary)]/10 p-4 text-[var(--primary)]">
          <SearchX className="h-12 w-12" />
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="max-w-md opacity-80 mb-8">
          Sorry, we couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        <Link to="/" className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 transition-colors">
          Go back to Homepage
        </Link>
      </div>
    </>
  );
}