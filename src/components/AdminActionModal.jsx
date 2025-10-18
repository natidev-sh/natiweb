import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

export default function AdminActionModal({ isOpen, onClose, onConfirm, config, isLoading }) {
  if (!config) return null;
  const { title, body, actionLabel, color = 'primary' } = config;

  const colorClasses = {
    primary: 'bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]',
    amber: 'bg-amber-500 hover:bg-amber-600 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">{body}</p>

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                Cancel
              </button>
              <button 
                onClick={onConfirm} 
                disabled={isLoading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-60 ${colorClasses[color]}`}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Processing...' : actionLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}