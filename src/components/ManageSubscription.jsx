import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageSubscription() {
  const { status, profile, loading: statusLoading } = useSubscriptionStatus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      setError('Error redirecting to subscription portal. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const planName = () => {
    if (status === 'Admin') return 'Admin Plan';
    if (status === 'Pro') {
        // This is a simplification. In a real app, you'd map plan_id to a name.
        if (profile?.plan_id?.includes('year')) return 'Pro (Yearly)';
        return 'Pro (Monthly)';
    }
    return 'Free Plan';
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Subscription</h2>
        <p className="text-sm opacity-70">Manage your billing and subscription details.</p>
      </div>

      <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
        <h3 className="text-lg font-semibold mb-4">Your Current Plan</h3>
        {statusLoading ? (
          <div className="h-8 w-32 bg-[var(--muted)] rounded animate-pulse" />
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{planName()}</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {status === 'Pro' ? 'You have access to all Pro features.' : 'Upgrade to unlock Pro features.'}
              </p>
            </div>
            {status === 'Pro' && (
              <span className="px-3 py-1 text-sm rounded-full bg-green-500/10 text-green-400">
                Active
              </span>
            )}
          </div>
        )}
      </div>

      {status === 'Pro' ? (
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
          <h3 className="text-lg font-semibold mb-2">Manage Billing</h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Click the button below to manage your subscription, view invoices, and update your payment method via Stripe's secure portal. This includes canceling your subscription.
          </p>
          <button
            onClick={redirectToCustomerPortal}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
            {loading ? 'Redirecting...' : 'Open Customer Portal'}
          </button>
          {error && <p className="text-sm text-rose-400 mt-3">{error}</p>}
        </div>
      ) : (
        status !== 'Admin' && (
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] text-center">
            <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Unlock exclusive AI modes, get more credits, and receive direct support.
            </p>
            <Link to="/download#pro-pricing" className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)]">
              View Pro Plans
            </Link>
          </div>
        )
      )}
    </div>
  );
}