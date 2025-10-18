import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import PageMeta from '../components/PageMeta.jsx'
import FooterGlow from '../components/FooterGlow.jsx'
import LoginForm2 from '../components/mvpblocks/login-form-2'
import { Link } from 'react-router-dom'
import { Monitor, CheckCircle, Download, X, Loader2 } from 'lucide-react'

export default function DesktopAppAuth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showAppNotInstalled, setShowAppNotInstalled] = useState(false)

  const redirectUrl = searchParams.get('redirect') || 'dyad://nati-auth-return'

  // Check if user is already logged in
  useEffect(() => {
    checkExistingSession()
  }, [])

  async function checkExistingSession() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      // User is already logged in, redirect to desktop app
      await handleSuccessfulAuth(session)
    }
  }

  async function handleSuccessfulAuth(session) {
    setIsAuthenticating(true);
    
    try {
      const user = session.user
      
      // Fetch user profile to get role and subscription status
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, subscription_status')
        .eq('id', user.id)
        .single()
      
      const isPro = profile?.subscription_status === 'active'
      const isAdmin = profile?.role === 'admin'
      
      // Create session record for desktop app
      try {
        await supabase.from('user_sessions').insert({
          user_id: user.id,
          device_type: 'desktop_app',
          device_name: 'Nati Desktop',
          device_os: navigator.platform || 'Unknown',
          is_active: true,
          last_active_at: new Date().toISOString(),
        })
      } catch (sessionError) {
        console.error('Failed to create session record:', sessionError)
        // Non-fatal error, continue with auth
      }
      
      // Build the deep link URL with user data including Pro/Admin status
      const params = new URLSearchParams({
        userId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        avatar: user.user_metadata?.avatar_url || '',
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in?.toString() || '3600',
        isPro: isPro.toString(),
        isAdmin: isAdmin.toString(),
      })
      
      const deepLinkUrl = `${redirectUrl}?${params.toString()}`
      
      // Better app detection logic
      let appOpened = false
      
      // Listen for page visibility - if page becomes hidden, app likely opened
      const handleVisibilityChange = () => {
        if (document.hidden) {
          appOpened = true
        }
      }
      
      // Listen for blur - app opening will blur the page
      const handleBlur = () => {
        appOpened = true
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('blur', handleBlur)
      
      // Attempt to redirect to the desktop app
      window.location.href = deepLinkUrl
      
      // Check after 5 seconds if app opened
      setTimeout(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('blur', handleBlur)
        
        // Only show "not installed" if page is still focused
        if (!appOpened && !document.hidden) {
          setShowAppNotInstalled(true)
        }
      }, 5000)
    } catch (e) {
      console.error('Auth error:', e)
      setError('Failed to authenticate with desktop app')
      setIsAuthenticating(false)
    }
  }

  async function handleLogin(email, password) {
    setLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (error) {
        if (error.code === 'mfa_challenge_required') {
          setError('MFA is not supported for desktop app login. Please use a different account.')
        } else if (error.message === 'User is banned') {
          setError('This account has been suspended or banned. Please contact support.')
        } else {
          throw error
        }
      } else if (data.session) {
        await handleSuccessfulAuth(data.session)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/desktop-auth?redirect=${encodeURIComponent(redirectUrl)}`,
        },
      })
      if (error) throw error
    } catch (e) {
      setError(e.message)
    }
  }

  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-full max-w-md p-8">
          <div className="space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                  {showAppNotInstalled ? (
                    <X className="h-12 w-12 text-white" />
                  ) : (
                    <CheckCircle className="h-12 w-12 text-white animate-bounce" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {showAppNotInstalled ? 'App Not Detected' : 'Authentication Successful!'}
              </h2>
              <p className="text-[var(--muted-foreground)]">
                {showAppNotInstalled 
                  ? 'The Nati Desktop App doesn\'t appear to be running' 
                  : 'Opening Nati Desktop App...'}
              </p>
            </div>

            {showAppNotInstalled ? (
              <div className="space-y-4">
                {/* Warning Card */}
                <div className="p-6 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <div className="flex gap-3">
                    <Monitor className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Desktop App Required</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Make sure the Nati Desktop App is installed and running on your computer.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href="/download"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Download className="h-4 w-4" />
                    Download App
                  </a>
                  <button
                    onClick={() => window.close()}
                    className="px-4 py-3 text-sm font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Loading Card */}
                <div className="p-6 rounded-lg border border-blue-500/20 bg-blue-500/5">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Launching desktop app...</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        This window will close automatically
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.close()}
                  className="w-full px-4 py-3 text-sm font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                >
                  Close this tab
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageMeta
        title="Desktop App Login | Nati.dev"
        description="Sign in to connect your Nati.dev account with the desktop application."
      />
      <LoginForm2
        title="Connect Desktop App"
        subtitle="Sign in to link your Nati.dev account with the desktop application."
        cta="Connect"
        loading={loading}
        error={error}
        onSubmit={handleLogin}
        onGoogleSignIn={handleGoogleLogin}
        footerCta={
          <>
            No account? <Link to={`/signup?redirect=${encodeURIComponent(redirectUrl)}`} className="font-semibold text-[var(--primary)] hover:underline">Sign up</Link>
          </>
        }
      />
      <FooterGlow />
    </>
  )
}
