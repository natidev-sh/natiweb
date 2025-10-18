import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type DELETE MY ACCOUNT to confirm.');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const { error: functionError } = await supabase.functions.invoke('delete-user');
      if (functionError) throw functionError;
      
      await logout();
      handleClose();

    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
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
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-rose-500/10 text-rose-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-rose-400">Delete Account</h2>
            </div>

            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              This is a permanent action and cannot be undone. All your data, including API keys and subscription information, will be permanently deleted.
            </p>

            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium">
                To confirm, please type "<strong>DELETE MY ACCOUNT</strong>" below:
              </label>
              <input
                id="confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full rounded-md bg-[var(--background)] border border-[var(--border)] px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500/30"
              />
            </div>

            {error && <p className="text-sm text-rose-400 mt-2">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={confirmText !== 'DELETE MY ACCOUNT' || deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm disabled:opacity-60 hover:bg-rose-700"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {deleting ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}