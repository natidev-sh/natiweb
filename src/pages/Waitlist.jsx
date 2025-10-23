import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Code, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticlesComponent as Particles } from '@/components/ui/particles';
import { Spotlight } from '@/components/ui/Spotlight';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';

const users = [
  { imgUrl: 'https://avatars.githubusercontent.com/u/111780029' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/123104247' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/115650165' },
  { imgUrl: 'https://avatars.githubusercontent.com/u/71373838' },
];

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/natidev-sh',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    url: 'https://discord.com/invite/d9jajsdrWn',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/r/natidevs/',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    ),
  },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    setColor(theme === 'dark' ? '#ffffff' : '#e60a64');
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.from('waitlist').insert({ email });
      if (error) {
        if (error.code === '23505') { // unique constraint violation
          setError('This email is already on the waitlist.');
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta 
        title="Join the Waitlist | Nati - AI-Powered IDE" 
        description="Nati is an AI-powered IDE that helps you build beautiful web applications in minutes. Chat with AI, generate components, and ship faster." 
      />
      <main className="relative flex min-h-[calc(100vh-150px)] w-full items-center justify-center overflow-hidden">
        <Spotlight fill={theme === 'dark' ? 'white' : 'var(--primary)'} />
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          color={color}
        />
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:py-16 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-[var(--primary)]/10 from-[var(--primary)]/15 to-[var(--primary)]/5 mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm"
          >
            <img
              src="/assets/logos/logo.png"
              alt="logo"
              className="spin h-5 w-5 sm:h-6 sm:w-6"
            />
            <span className="text-xs sm:text-sm font-medium">Nati.dev</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className='from-[var(--foreground)] via-[var(--foreground)]/80 to-[var(--foreground)]/40 mb-3 sm:mb-4 cursor-crosshair bg-gradient-to-b bg-clip-text text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent leading-tight'
          >
            Build Apps with{' '}
            <span className="bg-[var(--primary)] from-[var(--foreground)] to-[var(--primary)] via-rose-300 bg-clip-text text-transparent dark:bg-gradient-to-b">
              AI Power
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[var(--muted-foreground)] mt-2 mb-8 sm:mb-12 text-sm sm:text-base md:text-lg px-2"
          >
            <strong className="text-[var(--foreground)]">Nati</strong> is an AI-powered IDE that helps you build beautiful web applications in minutes.
            <br className="hidden sm:block" /> 
            Chat with AI, generate components, and ship faster than ever before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-8 sm:mb-12 grid grid-cols-3 gap-3 sm:gap-6"
          >
            <div className="border-[var(--primary)]/10 flex flex-col items-center justify-center rounded-lg sm:rounded-xl border bg-white/5 p-3 sm:p-4 backdrop-blur-md glass-surface">
              <Sparkles className="text-[var(--primary)] mb-1 sm:mb-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-xl font-bold">AI-Powered</span>
              <span className="text-[var(--muted-foreground)] text-[10px] sm:text-xs">Chat to Code</span>
            </div>
            <div className="border-[var(--primary)]/10 flex flex-col items-center justify-center rounded-lg sm:rounded-xl border bg-white/5 p-3 sm:p-4 backdrop-blur-md glass-surface">
              <Code className="text-[var(--primary)] mb-1 sm:mb-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-xl font-bold">Live Preview</span>
              <span className="text-[var(--muted-foreground)] text-[10px] sm:text-xs">Instant Results</span>
            </div>
            <div className="border-[var(--primary)]/10 flex flex-col items-center justify-center rounded-lg sm:rounded-xl border bg-white/5 p-3 sm:p-4 backdrop-blur-md glass-surface">
              <Star className="text-[var(--primary)] mb-1 sm:mb-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-xl font-bold">Ship Fast</span>
              <span className="text-[var(--muted-foreground)] text-[10px] sm:text-xs">MVP in Minutes</span>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="mx-auto flex flex-col gap-3 sm:gap-4 sm:flex-row px-2"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <>
                  <div className="relative flex-1">
                    <motion.input
                      key="email-input"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-[var(--primary)]/20 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/70 focus:border-[var(--primary)]/50 focus:ring-[var(--primary)]/30 w-full rounded-lg sm:rounded-xl border bg-white/5 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base backdrop-blur-md transition-all focus:ring-2 focus:outline-none"
                    />
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-rose-500/40 bg-rose-500/10 text-rose-400 mt-2 rounded-lg sm:rounded-xl border px-3 sm:px-4 py-1 text-xs sm:text-sm"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitted}
                    className="group text-[var(--primary-foreground)] focus:ring-[var(--primary)]/50 relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-b from-rose-500 to-rose-700 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] focus:ring-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 group-hover:rotate-12" />
                    </span>
                    <span className="to-[var(--primary)] absolute inset-0 z-0 bg-gradient-to-r from-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  </button>
                </>
              ) : (
                <motion.div
                  key="thank-you-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                  className="border-[var(--primary)]/20 from-[var(--primary)]/10 to-[var(--primary)]/10 text-[var(--primary)] flex-1 cursor-pointer rounded-lg sm:rounded-xl border bg-gradient-to-r via-transparent px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] active:brightness-125 glass-surface"
                >
                  <span className="flex items-center justify-center gap-2">
                    Thanks for joining!{' '}
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Social Links - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2"
          >
            <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">Join our community:</span>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
                  className="border-[var(--primary)]/20 hover:border-[var(--primary)]/50 text-[var(--muted-foreground)] hover:text-[var(--primary)] flex items-center justify-center rounded-lg border bg-white/5 p-2.5 sm:p-2 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                  title={social.name}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-1 px-2"
          >
            <div className="flex -space-x-2 sm:-space-x-3">
              {users.map((user, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 + i * 0.2 }}
                  className="border-[var(--background)] from-[var(--primary)] size-8 sm:size-10 rounded-full border-2 bg-gradient-to-r to-rose-500 p-[2px]"
                >
                  <div className="overflow-hidden rounded-full">
                    <img
                      src={user.imgUrl}
                      alt="Avatar"
                      className="rounded-full transition-all duration-300 hover:scale-110 hover:rotate-6"
                      width={40}
                      height={40}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="text-[var(--muted-foreground)] text-xs sm:text-base sm:ml-2"
            >
              <span className="text-[var(--primary)] font-semibold">100+</span> already joined ✨
            </motion.span>
          </motion.div>
        </div>
      </main>
    </>
  );
}