import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Key, Plus, Trash2, Copy, Check, Info } from 'lucide-react'
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus'
import { Link } from 'react-router-dom'

export default function ApiKeys() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newKey, setNewKey] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)
  const { status, loading: statusLoading } = useSubscriptionStatus();

  useEffect(() => {
    if (status !== 'Free') {
      fetchKeys()
    } else {
      setLoading(false);
    }
  }, [status])

  async function fetchKeys() {
    setLoading(true)
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching keys:', error)
    } else {
      setKeys(data)
    }
    setLoading(false)
  }

  async function generateKey() {
    setGenerating(true)
    setNewKey(null)
    const { data, error } = await supabase.functions.invoke('generate-key', {
      body: { metadata: { purpose: 'dev-pro' } },
    })

    if (error) {
      console.error('Error generating key:', error)
    } else {
      setNewKey(data)
      fetchKeys()
    }
    setGenerating(false)
  }

  async function deleteKey(keyId) {
    const { error } = await supabase.functions.invoke('delete-key', {
      body: { key_id: keyId },
    })

    if (error) {
      console.error('Error deleting key:', error)
    } else {
      setKeys(keys.filter(k => k.id !== keyId))
    }
  }

  function handleCopy(key) {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (statusLoading) {
    return <div>Loading status...</div>;
  }

  if (status === 'Free') {
    return (
      <div className="p-6 text-center rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
        <h3 className="text-lg font-semibold">Upgrade to Generate API Keys</h3>
        <p className="opacity-70 mt-2 mb-4">
          API keys are a Pro feature. Upgrade your account to generate keys and access pro features.
        </p>
        <Link to="/download#pro-pricing" className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)]">
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  const canGenerateKey = status === 'Admin' || keys.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">API Keys</h2>
        <p className="text-sm opacity-70">Manage your API keys for nati.dev.</p>
      </div>

      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Generate a new key</h3>
            <p className="text-sm opacity-70">
              {status === 'Admin' 
                ? 'Admins can generate multiple keys.' 
                : 'Pro users are limited to one API key at a time.'}
            </p>
          </div>
          <button
            onClick={generateKey}
            disabled={generating || !canGenerateKey}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] transition-colors duration-200 hover:bg-[var(--primary)]/90 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {generating ? 'Generating...' : 'Generate Key'}
          </button>
        </div>
        
        {!canGenerateKey && status !== 'Admin' && (
          <div className="mt-4 p-3 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
            <Info className="h-5 w-5 flex-shrink-0" />
            <span>You have reached your key limit. Please delete your existing key to generate a new one.</span>
          </div>
        )}

        {newKey && (
          <div className="mt-4 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg space-y-2">
            <p className="text-sm font-medium text-green-400">New key generated successfully! Please copy it now, you won't be able to see it again.</p>
            <div className="flex items-center gap-2 p-2 rounded-md bg-[var(--background-darkest)] font-mono text-sm">
              <span className="truncate flex-1">{newKey.key}</span>
              <button onClick={() => handleCopy(newKey.key)} className="p-1.5 rounded-md hover:bg-[var(--muted)]">
                {copiedKey === newKey.key ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300">
        <h3 className="font-medium flex items-center gap-2"><Info className="h-5 w-5" /> How to use your key</h3>
        <ol className="list-decimal list-inside text-sm opacity-90 mt-2 space-y-1">
          <li>Open the Nati desktop app.</li>
          <li>Go to <strong>Settings</strong> from the left sidebar.</li>
          <li>Navigate to the <strong>AI Providers</strong> tab.</li>
          <li>Select <strong>Nati</strong> from the list.</li>
          <li>Paste your generated API key into the input field.</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium">Your Keys</h3>
        {loading ? (
          <p>Loading keys...</p>
        ) : keys.length === 0 ? (
          <p className="text-sm opacity-70">You don't have any API keys yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
            {keys.map(key => (
              <li key={key.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-[var(--primary)]" />
                  <div>
                    <p className="font-mono text-sm">nati-••••••••{key.api_key.slice(-4)}</p>
                    <p className="text-xs opacity-70">Created on {new Date(key.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => deleteKey(key.id)} className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-rose-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {(status === 'Pro' || status === 'Admin') && keys.length > 0 && (
        <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10 text-green-300">
          <h3 className="font-medium">You have Pro Status!</h3>
          <p className="text-sm opacity-80">Your active API key grants you access to all pro features.</p>
        </div>
      )}
    </div>
  )
}