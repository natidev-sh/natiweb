import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import PageMeta from './components/PageMeta.jsx';

export default function PaymentCancel() {
  return (
    <>
      <PageMeta
        title="Payment Canceled | Nati.dev"
        description="Your payment process was canceled. You can return to pricing to try again."
      />
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="mb-6 inline-flex items-center justify-center rounded-full bg-rose-500/10 p-4 text-rose-500">
          <XCircle className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Canceled</h1>
        <p className="max-w-md opacity-80 mb-8">
          Your payment process was canceled. You can try again whenever you're ready. Your card was not charged.
        </p>
        <Link to="/download#pro-pricing" className="px-6 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
          Back to Pricing
        </Link>
      </div>
    </>
  );
}