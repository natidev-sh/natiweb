import React, { useEffect, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

const SUPABASE_CLIENT_ID = '39a0b2e0-9063-4838-b03d-c81a7481a621'
const REDIRECT_URI = 'https://natiweb.vercel.app/supabase-oauth/callback'

export default function SupabaseOAuth() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect to Supabase OAuth authorization page
    const authUrl = new URL('https://api.supabase.com/v1/oauth/authorize')
    authUrl.searchParams.append('client_id', SUPABASE_CLIENT_ID)
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', 'all')

    // Redirect immediately
    window.location.href = authUrl.toString()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="text-center">
            {error ? (
              <>
                <div className="mx-auto h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Connection Failed
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {error}
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Connecting to Supabase
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Redirecting you to Supabase for authorization...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
