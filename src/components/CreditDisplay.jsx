import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Zap, TrendingUp, Calendar, AlertCircle, Loader2 } from 'lucide-react'
import { useTheme } from '../theme/ThemeProvider'

export default function CreditDisplay({ compact = false }) {
  const [credits, setCredits] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    fetchCredits()
  }, [])

  async function fetchCredits() {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: fetchError } = await supabase.functions.invoke('get-user-credits')

      if (fetchError) {
        console.error('Error fetching credits:', fetchError)
        setError(fetchError.message || 'Failed to fetch credits')
      } else if (data?.error) {
        console.error('Credits API error:', data)
        setError(data.error)
      } else if (data) {
        setCredits(data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Failed to load credit information')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 rounded-lg ${
        isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
      }`}>
        <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />
      </div>
    )
  }

  if (error || !credits?.hasKey) {
    return (
      <div className={`p-4 rounded-lg border ${
        isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-yellow-600">No API Key Found</p>
            <p className={isDark ? 'text-yellow-300' : 'text-yellow-700'}>
              Generate an API key to start using credits.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const usagePercentage = (credits.usedCredits / credits.totalCredits) * 100
  const isLowCredits = credits.remainingCredits < 50

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
      }`}>
        <Zap className={`h-4 w-4 ${isLowCredits ? 'text-red-500' : 'text-[var(--primary)]'}`} />
        <span className={`text-sm font-medium ${isLowCredits ? 'text-red-500' : ''}`}>
          {credits.remainingCredits} credits
        </span>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-xl border ${
      isDark 
        ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700' 
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
    } shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--primary)] to-purple-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Credits</h3>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Monthly allocation
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-2xl font-bold ${isLowCredits ? 'text-red-500' : ''}`}>
            {credits.remainingCredits}
          </span>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            / {credits.totalCredits} credits
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${
          isDark ? 'bg-zinc-700' : 'bg-gray-200'
        }`}>
          <div
            className={`h-full transition-all duration-300 ${
              isLowCredits 
                ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                : 'bg-gradient-to-r from-[var(--primary)] to-purple-600'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg ${
          isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Used
            </span>
          </div>
          <p className="text-lg font-bold">{credits.usedCredits}</p>
        </div>

        <div className={`p-3 rounded-lg ${
          isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-green-500" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Resets
            </span>
          </div>
          <p className="text-sm font-semibold">
            {new Date(credits.budgetResetDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Warning for low credits */}
      {isLowCredits && (
        <div className={`mt-4 p-3 rounded-lg ${
          isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-500">
              Running low on credits! Your budget resets on{' '}
              {new Date(credits.budgetResetDate).toLocaleDateString()}.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
