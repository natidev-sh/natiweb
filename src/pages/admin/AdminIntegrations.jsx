import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Loader2, Save, AlertTriangle } from 'lucide-react';

const IntegrationRow = ({ integration, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(integration.service_name, apiKey);
    setIsSaving(false);
    setApiKey(''); // Clear input after saving
  };

  return (
    <div className="p-4 border-b border-[var(--border)] last:border-b-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="font-semibold text-lg capitalize">{integration.service_name}</h4>
          <p className={`text-sm ${integration.api_key ? 'text-green-400' : 'text-amber-400'}`}>
            {integration.api_key ? 'Configured' : 'Not Configured'}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter new API Key"
            className="w-full md:w-64 rounded-md bg-[var(--background)] border border-[var(--border)] px-3 py-2 text-sm"
          />
          <button
            onClick={handleSave}
            disabled={isSaving || !apiKey}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('service_integrations')
      .select('service_name, api_key')
      .order('service_name');

    if (error) {
      console.error('Error fetching integrations:', error);
      setError('Failed to load integrations.');
    } else {
      setIntegrations(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const handleSaveKey = async (serviceName, apiKey) => {
    const { error } = await supabase
      .from('service_integrations')
      .update({ api_key: apiKey, updated_at: new Date().toISOString() })
      .eq('service_name', serviceName);

    if (error) {
      alert(`Error saving key for ${serviceName}: ${error.message}`);
    } else {
      fetchIntegrations(); // Refresh the list
    }
  };

  return (
    <>
      <PageMeta title="Integrations | Admin" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">API Integrations</h1>
          <p className="text-[var(--muted-foreground)]">Manage third-party API keys for your application.</p>
        </div>

        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Security Warning</h3>
            <p className="text-sm opacity-90">
              These keys are sensitive and stored directly in your database. While access is restricted to admins, please handle them with care. For production environments, using environment variables is often a more secure practice.
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading integrations...</p>
        ) : error ? (
          <p className="text-rose-400">{error}</p>
        ) : (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            {integrations.map(integ => (
              <IntegrationRow key={integ.service_name} integration={integ} onSave={handleSaveKey} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}