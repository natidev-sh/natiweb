import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Laptop, Apple, Terminal, Save, Loader2, CheckCircle, XCircle } from 'lucide-react';

const platformIcons = {
  windows: Laptop,
  macos: Apple,
  linux: Terminal,
};

const platformNames = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
};

export default function AdminDownloadLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchDownloadLinks();
  }, []);

  async function fetchDownloadLinks() {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .order('platform');

      if (error) throw error;

      setLinks(data || []);
      
      // Initialize edit data
      const initialEditData = {};
      data?.forEach(link => {
        initialEditData[link.platform] = {
          version: link.version,
          download_url: link.download_url,
          is_available: link.is_available,
        };
      });
      setEditData(initialEditData);
    } catch (error) {
      console.error('Error fetching download links:', error);
      alert('Failed to load download links: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(platform) {
    setSaving(true);
    try {
      const data = editData[platform];
      
      const { error } = await supabase
        .from('download_links')
        .update({
          version: data.version,
          download_url: data.download_url,
          is_available: data.is_available,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('platform', platform);

      if (error) throw error;

      alert(`${platformNames[platform]} download link updated successfully`);
      await fetchDownloadLinks();
    } catch (error) {
      console.error('Error saving download link:', error);
      alert('Failed to save download link: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(platform, field, value) {
    setEditData(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Download Links</h1>
        <p className="text-[var(--muted-foreground)] mt-2">
          Manage download links for all platforms. These links appear on the /download page.
        </p>
      </div>

      <div className="grid gap-6">
        {links.map(link => {
          const Icon = platformIcons[link.platform];
          const data = editData[link.platform] || {};
          
          return (
            <div
              key={link.platform}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                  <Icon className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{platformNames[link.platform]}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Last updated: {new Date(link.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Version */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={data.version || ''}
                    onChange={(e) => handleInputChange(link.platform, 'version', e.target.value)}
                    placeholder="e.g., 0.2.2 or 'Coming Soon'"
                    className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* Download URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Download URL
                  </label>
                  <input
                    type="url"
                    value={data.download_url || ''}
                    onChange={(e) => handleInputChange(link.platform, 'download_url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono text-sm"
                  />
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between p-4 rounded-md border border-[var(--border)] bg-[var(--background-darkest)]">
                  <div className="flex items-center gap-3">
                    {data.is_available ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-amber-500" />
                    )}
                    <div>
                      <div className="font-medium">
                        {data.is_available ? 'Available' : 'Coming Soon'}
                      </div>
                      <div className="text-sm text-[var(--muted-foreground)]">
                        {data.is_available 
                          ? 'Download button will be shown' 
                          : 'Will show "Coming Soon" badge'}
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.is_available || false}
                      onChange={(e) => handleInputChange(link.platform, 'is_available', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[var(--muted)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                  </label>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => handleSave(link.platform)}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-md border border-blue-500/20 bg-blue-500/5">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>Note:</strong> Changes will be immediately visible on the /download page. Make sure to test the download links before making them available to users.
        </p>
      </div>
    </div>
  );
}
