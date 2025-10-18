import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import PasswordInput from './PasswordInput';

export default function PasswordConfirmationModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Re-authenticate to get AAL2. The signInWithPassword function
    // will automatically update the session for subsequent requests.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    setLoading(false);

    if (reauthError) {
      setError(reauthError.message);
    } else {
      onSuccess();
      handleClose();
    }
  };

  const handleClose = () => {
    setPassword('');
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
            className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold mt-4">Confirm Your Identity</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                For your security, please enter your password to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Password</label>
                <PasswordInput
                  id="confirm-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}