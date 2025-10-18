import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Loader2, Save } from 'lucide-react';

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching site settings:', error);
      setError('Failed to load settings. Please ensure the settings table is created.');
    } else {
      setSettings(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const { error: updateError } = await supabase
      .from('site_settings')
      .update({
        maintenance_mode: settings.maintenance_mode,
        waitlist_mode: settings.waitlist_mode,
        allow_registration: settings.allow_registration,
        default_role: settings.default_role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (updateError) {
      setError('Failed to save settings: ' + updateError.message);
    } else {
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (error && !settings) {
    return <div className="text-rose-400">{error}</div>;
  }

  return (
    <>
      <PageMeta title="Site Settings | Admin" />
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-[var(--muted-foreground)]">Manage global application settings.</p>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <h3 className="text-lg font-semibold">General</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="maintenance_mode" className="font-medium">Maintenance Mode</label>
                  <p className="text-sm text-[var(--muted-foreground)]">Temporarily disable access for non-admins.</p>
                </div>
                <button type="button" role="switch" aria-checked={settings.maintenance_mode} onClick={() => handleToggle('maintenance_mode')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenance_mode ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="waitlist_mode" className="font-medium">Waitlist Mode</label>
                  <p className="text-sm text-[var(--muted-foreground)]">Redirect all non-admin users to the waitlist page.</p>
                </div>
                <button type="button" role="switch" aria-checked={settings.waitlist_mode} onClick={() => handleToggle('waitlist_mode')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.waitlist_mode ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.waitlist_mode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <h3 className="text-lg font-semibold">User Management</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="allow_registration" className="font-medium">Allow New User Registrations</label>
                  <p className="text-sm text-[var(--muted-foreground)]">Enable or disable the signup page.</p>
                </div>
                <button type="button" role="switch" aria-checked={settings.allow_registration} onClick={() => handleToggle('allow_registration')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.allow_registration ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allow_registration ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="default_role" className="font-medium">Default Role for New Users</label>
                  <p className="text-sm text-[var(--muted-foreground)]">The role assigned to users upon registration.</p>
                </div>
                <select
                  id="default_role"
                  name="default_role"
                  value={settings.default_role}
                  onChange={handleSelectChange}
                  className="bg-[var(--background)] border border-[var(--border)] rounded-md px-2 py-1 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
                >
                  <option value="user">User</option>
                  {/* Add other potential roles here in the future */}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-60">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
          {success && <p className="text-sm text-green-400">{success}</p>}
          {error && <p className="text-sm text-rose-400">{error}</p>}
        </div>
      </form>
    </>
  );
}