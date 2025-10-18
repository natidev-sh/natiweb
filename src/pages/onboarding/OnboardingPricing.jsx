import React from 'react';
import { Link } from 'react-router-dom';
import CongestedPricing from '@/components/mvpblocks/congusted-pricing';
import PageMeta from '@/components/PageMeta';

export default function OnboardingPricing() {
  return (
    <>
      <PageMeta title="Choose Your Plan | Nati.dev" />
      <div className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">One Last Step: Go Pro!</h1>
          <p className="mt-4 text-lg opacity-80 max-w-2xl mx-auto">
            Upgrade to a Pro plan to unlock exclusive AI modes, get more credits, and receive direct support.
          </p>
        </div>
        <CongestedPricing />
        <div className="text-center mt-8">
          <Link to="/dashboard" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Skip for now and go to my dashboard &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}