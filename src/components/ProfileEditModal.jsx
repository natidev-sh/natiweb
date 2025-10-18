import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';

export default function ProfileEditModal({ isOpen, onClose, onSaveSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', username: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      supabase
        .from('profiles')
        .select('first_name, last_name, username')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching profile:', error);
            setError('Could not load profile data.');
          } else if (data) {
            setProfile({
              firstName: data.first_name || '',
              lastName: data.last_name || '',
              username: data.username || '',
            });
          }
          setLoading(false);
        });
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: profile.firstName,
        last_name: profile.lastName,
        username: profile.username,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      onSaveSuccess();
      onClose();
    }
    setSaving(false);
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
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            {loading ? (
              <div className="text-center p-8">Loading profile...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                    <input id="firstName" name="firstName" type="text" value={profile.firstName} onChange={handleChange} className="w-full rounded-md bg-[var(--background)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                    <input id="lastName" name="lastName" type="text" value={profile.lastName} onChange={handleChange} className="w-full rounded-md bg-[var(--background)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30" />
                  </div>
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                  <input id="username" name="username" type="text" value={profile.username} onChange={handleChange} className="w-full rounded-md bg-[var(--background)] border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30" />
                </div>
                
                {error && <p className="text-sm text-rose-400">{error}</p>}

                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}