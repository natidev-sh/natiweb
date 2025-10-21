import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Laptop, Apple, Terminal, Save, Loader2, CheckCircle, XCircle, Shield, FlaskConical, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const platformOrder = { windows: 0, macos: 1, linux: 2 };

export default function AdminReleases() {
  const [activeTab, setActiveTab] = useState('stable');
  const [stableLinks, setStableLinks] = useState([]);
  const [betaLinks, setBetaLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchDownloadLinks();
  }, []);

  async function fetchDownloadLinks() {
    try {
      // Fetch all download links
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .order('platform');

      if (error) throw error;

      // Define all platforms
      const allPlatforms = ['windows', 'macos', 'linux'];
      
      // Create a map of existing data
      const dataMap = {};
      data?.forEach(link => {
        const key = `${link.platform}-${link.is_beta ? 'beta' : 'stable'}`;
        dataMap[key] = link;
      });

      // Ensure all platforms exist for both stable and beta
      const stable = [];
      const beta = [];
      
      allPlatforms.forEach(platform => {
        // Stable
        const stableKey = `${platform}-stable`;
        stable.push(dataMap[stableKey] || {
          platform,
          version: 'Coming Soon',
          download_url: '#',
          is_available: false,
          is_beta: false,
          updated_at: null,
        });
        
        // Beta
        const betaKey = `${platform}-beta`;
        beta.push(dataMap[betaKey] || {
          platform,
          version: 'Coming Soon',
          download_url: '#',
          is_available: false,
          is_beta: true,
          updated_at: null,
        });
      });

      setStableLinks(stable);
      setBetaLinks(beta);
      
      // Initialize edit data for all platforms
      const initialEditData = {};
      [...stable, ...beta].forEach(link => {
        const key = `${link.platform}-${link.is_beta ? 'beta' : 'stable'}`;
        initialEditData[key] = {
          id: link.id,
          version: link.version || 'Coming Soon',
          download_url: link.download_url || '#',
          is_available: link.is_available || false,
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

  async function handleSave(platform, isBeta) {
    setSaving(true);
    try {
      const key = `${platform}-${isBeta ? 'beta' : 'stable'}`;
      const data = editData[key];
      
      // Validate required fields
      if (!data.version || data.version.trim() === '') {
        alert('Version is required. Use "Coming Soon" for unreleased platforms.');
        setSaving(false);
        return;
      }
      
      if (!data.download_url || data.download_url.trim() === '') {
        alert('Download URL is required. Use "#" for unreleased platforms.');
        setSaving(false);
        return;
      }
      
      // Warn if saving as available with placeholder values
      if (data.is_available && (data.version === 'Coming Soon' || data.download_url === '#')) {
        if (!confirm('You are marking this as available with placeholder values. Continue?')) {
          setSaving(false);
          return;
        }
      }
      
      // Check if record exists
      const { data: existing } = await supabase
        .from('download_links')
        .select('id')
        .eq('platform', platform)
        .eq('is_beta', isBeta)
        .single();

      const updateData = {
        version: data.version.trim(),
        download_url: data.download_url.trim(),
        is_available: data.is_available,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      };

      let error;
      if (existing) {
        // Update existing
        ({ error } = await supabase
          .from('download_links')
          .update(updateData)
          .eq('id', existing.id));
      } else {
        // Insert new
        ({ error } = await supabase
          .from('download_links')
          .insert({
            ...updateData,
            platform,
            is_beta: isBeta,
          }));
      }

      if (error) throw error;

      alert(`${platformNames[platform]} ${isBeta ? 'Beta' : 'Stable'} release updated successfully`);
      await fetchDownloadLinks();
    } catch (error) {
      console.error('Error saving download link:', error);
      alert('Failed to save download link: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(platform, isBeta, field, value) {
    const key = `${platform}-${isBeta ? 'beta' : 'stable'}`;
    setEditData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  }

  const currentLinks = activeTab === 'stable' ? stableLinks : betaLinks;
  const isBeta = activeTab === 'beta';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Release Management</h1>
        <p className="text-[var(--muted-foreground)] mt-2">
          Manage stable and beta releases for all platforms. These links appear on the /download page.
        </p>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-600 dark:text-blue-400">
            <p className="font-medium">Beta Release Best Practices:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Beta versions should be numbered higher than stable (e.g., 0.2.11-beta1 after 0.2.10 stable)</li>
              <li>Mark GitHub releases as "pre-release" for beta versions</li>
              <li>Windows is always shown first and marked as "RECOMMENDED"</li>
              <li>Changes are immediately visible on the /download page</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-[var(--background-darkest)] border border-[var(--border)] w-fit">
        <button
          onClick={() => setActiveTab('stable')}
          className={`relative px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'stable'
              ? 'text-white'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          {activeTab === 'stable' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Stable Releases
          </span>
        </button>
        <button
          onClick={() => setActiveTab('beta')}
          className={`relative px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'beta'
              ? 'text-white'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          {activeTab === 'beta' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Beta Releases
          </span>
        </button>
      </div>

      {/* Platform Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="grid gap-6"
        >
          {currentLinks.map((link, index) => {
              const Icon = platformIcons[link.platform];
              const key = `${link.platform}-${isBeta ? 'beta' : 'stable'}`;
              const data = editData[key] || {};
              const isWindows = link.platform === 'windows';
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg border p-6 ${
                    isWindows
                      ? 'border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/5 to-transparent'
                      : 'border-[var(--border)] bg-[var(--background)]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      isWindows ? 'bg-[var(--primary)] text-white' : 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{platformNames[link.platform]}</h3>
                        {isWindows && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--primary)] text-white">
                            <Sparkles className="h-3 w-3" />
                            FEATURED
                          </span>
                        )}
                        {isBeta && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-400">
                            <FlaskConical className="h-3 w-3" />
                            BETA
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Last updated: {link.updated_at ? new Date(link.updated_at).toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Version */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Version {isBeta && <span className="text-xs text-amber-600 dark:text-amber-400">(e.g., 0.2.11-beta1)</span>}
                      </label>
                      <input
                        type="text"
                        value={data.version || ''}
                        onChange={(e) => handleInputChange(link.platform, isBeta, 'version', e.target.value)}
                        placeholder={isBeta ? "e.g., 0.2.11-beta1" : "e.g., 0.2.10 or 'Coming Soon'"}
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>

                    {/* Download URL */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Download URL <span className="text-xs text-[var(--muted-foreground)]">(GitHub release link)</span>
                      </label>
                      <input
                        type="url"
                        value={data.download_url || ''}
                        onChange={(e) => handleInputChange(link.platform, isBeta, 'download_url', e.target.value)}
                        placeholder="https://github.com/natidev-sh/nati/releases/download/..."
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
                          onChange={(e) => handleInputChange(link.platform, isBeta, 'is_available', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--muted)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                      </label>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => handleSave(link.platform, isBeta)}
                      disabled={saving}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isBeta
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg hover:shadow-amber-500/20'
                          : 'bg-gradient-to-r from-[var(--primary)] to-purple-600 hover:shadow-lg hover:shadow-[var(--primary)]/20'
                      }`}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save {platformNames[link.platform]} {isBeta ? 'Beta' : 'Stable'}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
