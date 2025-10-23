import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginForm2 from './components/mvpblocks/login-form-2'
import { supabase } from '@/integrations/supabase/client'
import PageMeta from './components/PageMeta.jsx'
import FooterGlow from './components/FooterGlow.jsx'

export default function Login() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(email, password) {
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.code === 'mfa_challenge_required') {
          // MFA is required, redirect to the verification page
          nav('/verify-2fa', { replace: true });
        } else if (error.message === 'User is banned') {
          setError('This account has been suspended or banned. Please contact support.');
        } else {
          throw error;
        }
      } else {
        nav('/dashboard', { replace: true })
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
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleGithubLogin() {
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <PageMeta
        title="Login | Nati.dev"
        description="Sign in to your Nati.dev account to manage your API keys, check usage, and access pro features."
      />
      <LoginForm2
        title="Login"
        subtitle="Welcome back. Enter your credentials to continue."
        cta="Continue"
        loading={loading}
        error={error}
        onSubmit={handleLogin}
        onGoogleSignIn={handleGoogleLogin}
        onGithubSignIn={handleGithubLogin}
        footerCta={
          <>
            No account? <Link to="/signup" className="font-semibold text-[var(--primary)] hover:underline">Sign up</Link>
          </>
        }
      />
      <FooterGlow />
    </>
  )
}