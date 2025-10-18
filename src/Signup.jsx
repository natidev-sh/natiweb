import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginForm2 from './components/mvpblocks/login-form-2'
import { supabase } from '@/integrations/supabase/client'
import PageMeta from './components/PageMeta.jsx'
import FooterGlow from './components/FooterGlow.jsx'

export default function Signup() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(email, password, confirmPassword) {
    setLoading(true); setError('')

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      nav(`/confirm-email?email=${encodeURIComponent(email)}`, { replace: true })
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

  return (
    <>
      <PageMeta
        title="Sign Up | Nati.dev"
        description="Create a free account with Nati.dev to get started with the future of local-first AI app development."
      />
      <LoginForm2
        isSignup={true}
        title="Create an account"
        subtitle="Get started with nati.dev"
        cta="Sign up"
        loading={loading}
        error={error}
        onSubmit={handleSignup}
        onGoogleSignIn={handleGoogleLogin}
        footerCta={
          <>
            Already have an account? <Link to="/login" className="font-semibold text-[var(--primary)] hover:underline">Login</Link>
          </>
        }
      />
      <FooterGlow />
    </>
  )
}