import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import PageMeta from '@/components/PageMeta';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function OnboardingProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
      setError('Username must be 3-15 characters long and can only contain letters, numbers, and underscores.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      if (updateError.message.includes('duplicate key value violates unique constraint')) {
        setError('This username is already taken. Please choose another one.');
      } else {
        setError(updateError.message);
      }
    } else {
      navigate('/onboarding/pricing');
    }

    setLoading(false);
  };

  return (
    <>
      <PageMeta title="Complete Your Profile | Nati.dev" />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <div className="w-full max-w-md p-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] shadow-xl shadow-[var(--primary)]/10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome to Nati.dev!</h1>
            <p className="text-[var(--muted-foreground)]">Let's set up your profile. Choose a unique username.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full input-style"
                placeholder="your_username"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full input-style"
                  placeholder="Ada"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full input-style"
                  placeholder="Lovelace"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] transition-all duration-200 hover:bg-[var(--primary)]/90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue'}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </div>
      <style>{`.input-style { background-color: var(--background); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.5rem 0.75rem; width: 100%; font-size: 0.875rem; } .input-style:focus { border-color: var(--primary); outline: 2px solid transparent; box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--primary); }`}</style>
    </>
  );
}