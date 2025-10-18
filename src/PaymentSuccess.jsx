import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import PageMeta from './components/PageMeta.jsx';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentSuccess() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Automatically generate the first API key for the user
    const generateFirstKey = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: existingKeys, error: fetchError } = await supabase
        .from('api_keys')
        .select('id', { count: 'exact', head: true });

      if (fetchError) {
        console.error("Error checking for existing keys:", fetchError);
        return;
      }

      if (existingKeys && existingKeys.length === 0) {
        console.log("No existing keys found, generating a new one...");
        const { error: generateError } = await supabase.functions.invoke('generate-key', {
          body: { metadata: { purpose: 'pro-subscription' } },
        });

        if (generateError) {
          console.error('Error auto-generating key on payment success:', generateError);
        }
      } else {
        console.log("User already has API keys. Skipping auto-generation.");
      }
    };

    generateFirstKey();
  }, []);

  return (
    <>
      <PageMeta
        title="Payment Successful | Nati.dev"
        description="Thank you for subscribing to Nati Pro! Your account has been upgraded."
      />
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="mb-6 inline-flex items-center justify-center rounded-full bg-green-500/10 p-4 text-green-500">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="max-w-md opacity-80 mb-8">
          Thank you for subscribing to Nati Pro! Your account has been upgraded. You can now access all pro features.
        </p>
        <Link to="/dashboard" className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 transition-colors">
          Go to Dashboard
        </Link>
      </div>
    </>
  );
}