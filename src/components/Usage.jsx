import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

export default function Usage() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchKeyUsage = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    const { data: dbKeys, error: dbError } = await supabase
      .from('api_keys')
      .select('api_key, key_info, created_at')
      .order('created_at', { ascending: true })

    if (dbError) {
      console.error('Error fetching keys:', dbError)
      setError(dbError.message)
      setLoading(false)
      return
    }

    if (dbKeys.length === 0) {
      setKeys([])
      setLoading(false)
      return
    }

    const apiKeyStrings = dbKeys.map(k => k.api_key)
    const { data: liveUsageData, error: functionError } = await supabase.functions.invoke('get-key-usage', {
      body: { keys: apiKeyStrings },
    })

    if (functionError) {
      console.error('Error fetching live usage:', functionError)
      setError('Could not fetch live usage data. Displaying cached info.')
      setKeys(dbKeys)
    } else {
      const mergedKeys = dbKeys.map(dbKey => {
        const liveInfo = liveUsageData.find(liveKey => liveKey.key === dbKey.api_key);
        return liveInfo ? { ...dbKey, key_info: liveInfo } : dbKey;
      });
      setKeys(mergedKeys);
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchKeyUsage()
  }, [fetchKeyUsage])

  const chartData = keys.map((key) => ({
    name: `...${key.api_key.slice(-4)}`,
    spend: key.key_info?.spend || 0,
    budget: key.key_info?.max_budget === 0 ? Infinity : key.key_info?.max_budget,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Usage Statistics</h2>
          <p className="text-sm opacity-70">Monitor the spend and limits for your API keys.</p>
        </div>
        <button 
          onClick={fetchKeyUsage} 
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--muted)] disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && keys.length === 0 ? (
        <div>Loading usage data...</div>
      ) : error && keys.length === 0 ? (
        <div className="text-rose-400">Error loading data: {error}</div>
      ) : keys.length === 0 ? (
        <div className="p-4 text-center rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
          <p className="opacity-70">You haven't generated any keys yet. No usage to display.</p>
        </div>
      ) : (
        <>
          {error && <div className="text-sm text-amber-400">{error}</div>}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)'
                  }}
                />
                <Legend iconSize={10} />
                <Bar dataKey="spend" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  <th className="p-3 font-medium">Key</th>
                  <th className="p-3 font-medium">Spend</th>
                  <th className="p-3 font-medium">Budget</th>
                  <th className="p-3 font-medium">TPM</th>
                  <th className="p-3 font-medium">RPM</th>
                </tr>
              </thead>
              <tbody>
                {keys.map(key => (
                  <tr key={key.api_key} className="border-b border-[var(--border)]">
                    <td className="p-3 font-mono">nati-••••{key.api_key.slice(-4)}</td>
                    <td className="p-3">${key.key_info?.spend?.toFixed(4) || '0.00'}</td>
                    <td className="p-3">{key.key_info?.max_budget > 0 ? `$${key.key_info.max_budget}` : 'Unlimited'}</td>
                    <td className="p-3">{key.key_info?.tpm_limit || 'N/A'}</td>
                    <td className="p-3">{key.key_info?.rpm_limit || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}