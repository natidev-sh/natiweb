'use client';

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion';
import { Zap, Layers, Puzzle, Github, Rocket } from 'lucide-react'
import Globe1 from './globe1'
import PasswordInput from '../PasswordInput';
import PasswordStrengthMeter from '../PasswordStrengthMeter';

interface LoginForm2Props {
  title?: string;
  subtitle?: string;
  cta?: string;
  loading?: boolean;
  error?: string;
  isSignup?: boolean;
  onSubmit?: (email: string, password: string, confirmPassword?: string) => void | Promise<void>;
  onGoogleSignIn?: () => void | Promise<void>;
  onGithubSignIn?: () => void | Promise<void>;
  footerCta?: React.ReactNode;
}

export default function LoginForm2({
  title = 'Login',
  subtitle = 'Welcome back. Enter your credentials to continue.',
  cta = 'Continue',
  loading = false,
  error,
  isSignup = false,
  onSubmit,
  onGoogleSignIn,
  onGithubSignIn,
  footerCta,
}: LoginForm2Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: any) {
    e.preventDefault()
    if (onSubmit) {
      if (isSignup) {
        await onSubmit(email, password, confirmPassword);
      } else {
        await onSubmit(email, password);
      }
    }
  }

  function generatePassword() {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const all = lower + upper + numbers + symbols;
    
    let newPassword = '';
    newPassword += lower[Math.floor(Math.random() * lower.length)];
    newPassword += upper[Math.floor(Math.random() * upper.length)];
    newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    newPassword += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < 16; i++) {
      newPassword += all[Math.floor(Math.random() * all.length)];
    }
    
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');

    setPassword(newPassword);
    if (isSignup) {
      setConfirmPassword(newPassword);
    }
    return newPassword;
  }

  return (
    <div className="rose-gradient bg-background relative overflow-hidden">
      <div className="from-background absolute -top-10 left-0 h-1/2 w-full rounded-b-full bg-gradient-to-b to-transparent blur"></div>
      <div className="from-primary/80 absolute -top-64 left-0 h-1/2 w-full rounded-full bg-gradient-to-b to-transparent blur-3xl"></div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
        <motion.div
          className="hidden flex-1 items-center justify-center p-8 md:flex"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="mx-auto max-w-md text-left">
            <div className="pointer-events-none absolute -z-10 inset-0">
              <div className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-[var(--primary)]/20 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
              <div className="absolute top-40 -right-10 h-64 w-64 rounded-full bg-[var(--primary)]/15 blur-3xl animate-[float_10s_ease-in-out_infinite]" style={{animationDelay:'-2s'}} />
              <div className="absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-2xl animate-[float_14s_ease-in-out_infinite]" style={{animationDelay:'-4s'}} />
            </div>

            <div className="mb-6 flex justify-start">
              <Globe1 />
            </div>
            <motion.h2
              className="mb-3 text-3xl font-semibold tracking-tight"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Build with <span className="text-[var(--primary)]">Nati</span>
            </motion.h2>
            <motion.p
              className="mb-6 opacity-80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Free, local, open‑source AI app builder. The community‑driven alternative to Lovable, v0, Bolt and Replit.
            </motion.p>

            <motion.ul
              className="space-y-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            >
              {[
                { Icon: Rocket, text: 'Ship AI apps locally with instant feedback.' },
                { Icon: Layers, text: 'Composable React + Tailwind blocks.' },
                { Icon: Puzzle, text: 'Wire flows fast; tweak and extend easily.' },
                { Icon: Zap, text: 'Beautiful motion and pink accents out of the box.' },
                { Icon: Github, text: 'Open community at github.com/natidev-sh' },
              ].map((f, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.08 }}
                >
                  <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
                    <f.Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm opacity-90">{f.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-1 items-center justify-center p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="w-full max-w-md rounded-2xl border border-[var(--border)]/80 bg-[color:color-mix(in_oklab,_var(--background)_70%,_transparent)] p-8 shadow-xl shadow-[var(--primary)]/10 backdrop-blur-xl transition-all duration-300 focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_40%,transparent),0_25px_60px_-30px_var(--primary)] focus-within:border-[var(--primary)]/40">
              <div className="space-y-6">
                <motion.div
                  className="space-y-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-bold tracking-tight md:text-4xl">{title}</span>
                  </div>
                  <p className="text-sm opacity-80">{subtitle}</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                  >
                    <label htmlFor="email" className="text-sm">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="glass-input w-full rounded-lg border bg-white/20 border-gray-300/50 px-3 py-2 text-gray-900 placeholder:text-gray-500 caret-[var(--primary)] outline-none transition dark:bg-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/60 dark:caret-white focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/30"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
                  >
                    <label htmlFor="password" className="text-sm">Password</label>
                    <PasswordInput
                      id="password"
                      ref={passwordInputRef}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      onGenerate={isSignup ? generatePassword : undefined}
                      required
                    />
                    {isSignup && <PasswordStrengthMeter password={password} />}
                  </motion.div>

                  {isSignup && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.65, ease: 'easeOut' }}
                    >
                      <label htmlFor="confirmPassword" className="text-sm">Confirm Password</label>
                      <PasswordInput
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </motion.div>
                  )}

                  {error && <div className="text-rose-400 text-sm">{error}</div>}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button disabled={loading} className="w-full rounded-lg bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)] shadow-[0_10px_40px_-20px_var(--primary)] transition hover:shadow-[0_20px_60px_-20px_var(--primary)]">
                      {loading ? 'Please wait…' : cta}
                    </button>
                  </motion.div>
                </form>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="rounded-full bg-[var(--background)]/80 px-3 py-0.5 backdrop-blur-md">
                      OR
                    </span>
                  </div>
                </motion.div>

                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <button
                      type="button"
                      onClick={onGoogleSignIn}
                      aria-label="Sign in with Google"
                      className="group w-full items-center justify-center rounded-xl border border-[var(--border)]/70 bg-[color:color-mix(in_oklab,_var(--background)_70%,_transparent)]/60 px-4 py-2 text-sm font-medium backdrop-blur-md transition-all hover:border-[var(--primary)]/40 hover:shadow-[0_14px_40px_-20px_var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                    >
                      <span className="pointer-events-none inline-flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                          <path fill="#EA4335" d="M24 9.5c3.73 0 6.34 1.61 7.8 2.96l5.32-5.2C33.97 4.2 29.41 2 24 2 14.88 2 6.98 7.34 3.38 15.02l6.83 5.29C11.62 14.4 17.29 9.5 24 9.5z"/>
                          <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.2-.43-4.7H24v9h12.68c-.55 2.95-2.2 5.45-4.7 7.14l7.19 5.58C43.95 37.62 46.5 31.54 46.5 24.5z"/>
                          <path fill="#FBBC05" d="M10.21 20.31l-6.83-5.29C1.8 17.74 1 21.26 1 24.99c0 3.67.78 7.15 2.27 10.23l6.94-5.39C9.4 28.19 9 26.64 9 25s.4-3.19 1.21-4.69z"/>
                          <path fill="#34A853" d="M24 47c6.48 0 11.91-2.14 15.88-5.79l-7.19-5.58c-2.01 1.37-4.59 2.17-8.69 2.17-6.71 0-12.38-4.9-13.79-11.11l-6.94 5.39C6.88 40.53 14.79 47 24 47z"/>
                        </svg>
                        <span className="opacity-90 transition-colors group-hover:opacity-100">Sign in with Google</span>
                      </span>
                    </button>
                  </motion.div>

                  {onGithubSignIn && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.95, ease: 'easeOut' }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <button
                        type="button"
                        onClick={onGithubSignIn}
                        aria-label="Sign in with GitHub"
                        className="group w-full items-center justify-center rounded-xl border border-[var(--border)]/70 bg-[color:color-mix(in_oklab,_var(--background)_70%,_transparent)]/60 px-4 py-2 text-sm font-medium backdrop-blur-md transition-all hover:border-[var(--primary)]/40 hover:shadow-[0_14px_40px_-20px_var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                      >
                        <span className="pointer-events-none inline-flex items-center justify-center gap-2">
                          <Github className="h-5 w-5" />
                          <span className="opacity-90 transition-colors group-hover:opacity-100">Sign in with GitHub</span>
                        </span>
                      </button>
                    </motion.div>
                  )}
                </div>

                <motion.p
                  className="mt-2 text-center text-xs opacity-70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
                >
                  By continuing you agree to our
                  <a href="#" className="underline hover:text-[var(--primary)]"> terms</a>
                  {' '}and
                  <a href="#" className="underline hover:text-[var(--primary)]"> privacy</a>.
                </motion.p>
                {footerCta && (
                  <motion.div
                    className="mt-3 text-sm text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.1, ease: 'easeOut' }}
                  >
                    {footerCta}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}