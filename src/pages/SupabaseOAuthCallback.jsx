import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function SupabaseOAuthCallback() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [error, setError] = useState(null)

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (errorParam) {
        setError(errorDescription || errorParam)
        setStatus('error')
        return
      }

      if (!code) {
        setError('No authorization code received')
        setStatus('error')
        return
      }

      try {
        // Exchange code for tokens via your backend (Supabase Edge Function)
        const response = await fetch('https://cvsqiyjfqvdptjnxefbk.supabase.co/functions/v1/supabase-oauth-exchange', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c3FpeWpmcXZkcHRqbnhlZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDU5NTYsImV4cCI6MjA3NTYyMTk1Nn0.uc-wEsnkKtZjscmmJUIJ64qZJXGHQpp8cYwjEhWBivo'
          },
          body: JSON.stringify({ code })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to exchange authorization code')
        }

        const data = await response.json()
        
        // Redirect back to Nati app with tokens
        const deepLink = new URL('nati://supabase-oauth-return')
        deepLink.searchParams.append('token', data.access_token)
        deepLink.searchParams.append('refreshToken', data.refresh_token)
        deepLink.searchParams.append('expiresIn', data.expires_in.toString())
        
        setStatus('success')
        
        // Redirect to app after a brief delay
        setTimeout(() => {
          window.location.href = deepLink.toString()
        }, 1500)
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError(err.message || 'An unexpected error occurred')
        setStatus('error')
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="text-center">
            {status === 'processing' && (
              <>
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Completing Connection
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Exchanging authorization code for access tokens...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Connected Successfully!
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  Redirecting you back to Nati...
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Opening Nati app</span>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Connection Failed
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.close()}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  Close Window
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
