import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Loader2, Save, UploadCloud } from 'lucide-react';

export default function AdminAppearance() {
  const [primaryColor, setPrimaryColor] = useState('#ed3279');
  const [logoUrl, setLogoUrl] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('primary_color, logo_url')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load appearance settings.');
    } else if (data) {
      setPrimaryColor(data.primary_color || '#ed3279');
      setLogoUrl(data.logo_url || '');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const fileExt = file.name.split('.').pop();
    const fileName = `public/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('site_assets')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setError(`Logo upload failed: ${uploadError.message}`);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('site_assets')
        .getPublicUrl(fileName);
      setLogoUrl(publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const updates = {
      primary_color: primaryColor,
      logo_url: logoUrl,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('site_settings')
      .update(updates)
      .eq('id', 1);

    setSaving(false);
    if (updateError) {
      setError('Failed to save settings: ' + updateError.message);
    } else {
      setSuccess('Settings saved! The page will now reload to apply changes.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  if (loading) return <div>Loading appearance settings...</div>;

  return (
    <>
      <PageMeta title="Appearance | Admin" />
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Appearance</h1>
          <p className="text-[var(--muted-foreground)]">Customize your site's look and feel.</p>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <h3 className="text-lg font-semibold">Branding</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="primary_color" className="font-medium">Primary Color</label>
                <div className="relative">
                  <input
                    type="color"
                    id="primary_color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium block mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)]">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Current Logo" className="max-w-full max-h-full" />
                    ) : (
                      <span className="text-xs text-[var(--muted-foreground)]">None</span>
                    )}
                  </div>
                  <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                    <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                  </label>
                  <input id="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml" className="hidden" onChange={handleLogoUpload} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-60">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            <span>{saving ? 'Saving...' : 'Save Appearance'}</span>
          </button>
          {success && <p className="text-sm text-green-400">{success}</p>}
          {error && <p className="text-sm text-rose-400">{error}</p>}
        </div>
      </form>
    </>
  );
}