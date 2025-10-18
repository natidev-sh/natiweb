import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ShieldOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function UnenrollMfaModal({ isOpen, onClose, onSuccess, factorId }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnenroll = async (e) => {
    e.preventDefault();
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

      const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
      if (unenrollError) throw unenrollError;

      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to disable 2FA. The code may be incorrect.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-[var(--background-darkest)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-rose-500/10 p-3 text-rose-400">
                <ShieldOff className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold mt-4">Disable Two-Factor Authentication</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                To confirm, please enter the 6-digit code from your authenticator app.
              </p>
            </div>

            <form onSubmit={handleUnenroll} className="mt-6 space-y-4">
              <div>
                <label htmlFor="unenroll-code" className="sr-only">Verification Code</label>
                <input
                  id="unenroll-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength="6"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="glass-input w-full rounded-lg border bg-white/20 border-gray-300/50 px-3 py-2 text-center text-2xl tracking-[0.5em] text-gray-900 placeholder:text-gray-500 caret-[var(--primary)] outline-none transition dark:bg-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/60 dark:caret-white focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>
              {error && <p className="text-sm text-rose-400 text-center">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm disabled:opacity-60 hover:bg-rose-700"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? 'Disabling...' : 'Confirm & Disable'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}