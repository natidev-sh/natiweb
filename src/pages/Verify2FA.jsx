import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function Verify2FA() {
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [factorId, setFactorId] = useState(null);

  useEffect(() => {
    const checkAal = async () => {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) {
        console.error("Error getting AAL:", error);
        nav('/login', { replace: true });
        return;
      }
      
      if (data.currentLevel !== 'aal1') {
        nav('/dashboard', { replace: true });
        return;
      }

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) {
        setError("Could not retrieve your MFA settings. Please try logging in again.");
        return;
      }
      const totpFactor = factorsData.all.find(f => f.factor_type === 'totp');
      if (totpFactor) {
        setFactorId(totpFactor.id);
      } else {
        setError("No 2FA method found for your account. Please try logging in again.");
      }
    };
    checkAal();
  }, [nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!factorId) {
      setError("MFA setup is incomplete. Please try logging in again.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });
      if (verifyError) throw verifyError;

      nav('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Verify 2FA | Nati.dev" />
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-[var(--border)]/80 bg-[color:color-mix(in_oklab,_var(--background)_70%,_transparent)] p-8 shadow-xl shadow-[var(--primary)]/10 backdrop-blur-xl"
        >
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Enter the 6-digit code from your authenticator app to complete your login.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label htmlFor="mfa-code" className="sr-only">Verification Code</label>
                <input
                  id="mfa-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength="6"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="glass-input w-full rounded-lg border bg-white/20 border-gray-300/50 px-3 py-2 text-center text-2xl tracking-[0.5em] text-gray-900 placeholder:text-gray-500 caret-[var(--primary)] outline-none transition dark:bg-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/60 dark:caret-white focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/30"
                  required
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-rose-400 text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !factorId}
                className="w-full rounded-lg bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)] shadow-[0_10px_40px_-20px_var(--primary)] transition hover:shadow-[0_20px_60px_-20px_var(--primary)] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Verify & Sign In'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}