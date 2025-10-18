import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Code, Star, ExternalLink } from 'lucide-react';
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
      <PageMeta title="Join the Waitlist | Nati.dev" description="Be the first to access our revolutionary component library. Build your MVP faster than ever before." />
      <main className="relative flex min-h-[calc(100vh-150px)] w-full items-center justify-center overflow-hidden -m-10">
        <Spotlight fill={theme === 'dark' ? 'white' : 'var(--primary)'} />
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          color={color}
        />
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-[var(--primary)]/10 from-[var(--primary)]/15 to-[var(--primary)]/5 mb-8 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 backdrop-blur-sm"
          >
            <img
              src="/assets/logos/logo.png"
              alt="logo"
              className="spin h-6 w-6"
            />
            <span className="text-sm font-medium">Nati.dev</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className='from-[var(--foreground)] via-[var(--foreground)]/80 to-[var(--foreground)]/40 mb-4 cursor-crosshair bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-7xl'
          >
            Join the{' '}
            <span className="bg-[var(--primary)] from-[var(--foreground)] to-[var(--primary)] via-rose-300 bg-clip-text text-transparent dark:bg-gradient-to-b">
              Waitlist
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[var(--muted-foreground)] mt-2 mb-12 sm:text-lg"
          >
            Be the first to access our revolutionary component library.
            <br className="hidden sm:block" /> Build your MVP faster than ever
            before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-3"
          >
            <div className="border-[var(--primary)]/10 flex flex-col items-center justify-center rounded-xl border bg-white/5 p-4 backdrop-blur-md glass-surface">
              <Code className="text-[var(--primary)] mb-2 h-5 w-5" />
              <span className="text-xl font-bold">100+</span>
              <span className="text-[var(--muted-foreground)] text-xs">Components</span>
            </div>
            <div className="border-[var(--primary)]/10 flex flex-col items-center justify-center rounded-xl border bg-white/5 p-4 backdrop-blur-md glass-surface">
              <ExternalLink className="text-[var(--primary)] mb-2 h-5 w-5" />
              <span className="text-xl font-bold">Open Source</span>
              <span className="text-[var(--muted-foreground)] text-xs">MIT License</span>
            </div>
            <div className="border-[var(--primary)]/10 flex flex-col items-center justify-center rounded-xl border bg-white/5 p-4 backdrop-blur-md glass-surface">
              <Star className="text-[var(--primary)] mb-2 h-5 w-5" />
              <span className="text-xl font-bold">Premium</span>
              <span className="text-[var(--muted-foreground)] text-xs">Quality</span>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="mx-auto flex flex-col gap-4 sm:flex-row"
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
                      className="border-[var(--primary)]/20 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/70 focus:border-[var(--primary)]/50 focus:ring-[var(--primary)]/30 w-full rounded-xl border bg-white/5 px-6 py-4 backdrop-blur-md transition-all focus:ring-2 focus:outline-none"
                    />
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-rose-500/40 bg-rose-500/10 text-rose-400 mt-2 rounded-xl border px-4 py-1 text-sm sm:absolute"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitted}
                    className="group text-[var(--primary-foreground)] focus:ring-[var(--primary)]/50 relative overflow-hidden rounded-xl bg-gradient-to-b from-rose-500 to-rose-700 px-8 py-4 font-semibold text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] focus:ring-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                      <Sparkles className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
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
                  className="border-[var(--primary)]/20 from-[var(--primary)]/10 to-[var(--primary)]/10 text-[var(--primary)] flex-1 cursor-pointer rounded-xl border bg-gradient-to-r via-transparent px-6 py-4 font-medium backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] active:brightness-125 glass-surface"
                >
                  <span className="flex items-center justify-center gap-2">
                    Thanks for joining!{' '}
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-10 flex items-center justify-center gap-1"
          >
            <div className="flex -space-x-3">
              {users.map((user, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1 + i * 0.2 }}
                  className="border-[var(--background)] from-[var(--primary)] size-10 rounded-full border-2 bg-gradient-to-r to-rose-500 p-[2px]"
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
              transition={{ duration: 0.5, delay: 1.3 }}
              className="text-[var(--muted-foreground)] ml-2"
            >
              <span className="text-[var(--primary)] font-semibold">100+</span> already
              joined ✨
            </motion.span>
          </motion.div>
        </div>
      </main>
    </>
  );
}