import React, { useState, useEffect } from 'react';
import { Download, Laptop, Apple, Terminal, Github, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import FooterGlow from './components/FooterGlow';
import BentoGrid1 from './sections/BentoGrid1.jsx';
import CongestedPricing from './components/mvpblocks/congusted-pricing.tsx';
import PageMeta from './components/PageMeta.jsx';
import { supabase } from './integrations/supabase/client';

const PlatformCard = ({ icon, title, version, downloadLink, comingSoon = false }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
        comingSoon
          ? 'border-[var(--border)]/50 bg-[var(--background-darkest)]/50 text-[var(--muted-foreground)]'
          : 'border-[var(--border)] bg-[var(--background-darkest)] shadow-xl shadow-[var(--primary)]/10 hover:border-[var(--primary)]/40 hover:shadow-[var(--primary)]/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${comingSoon ? 'bg-[var(--muted)]/20' : 'bg-[var(--primary)]/15 text-[var(--primary)]'}`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${comingSoon ? '' : 'text-[var(--foreground)]'}`}>{title}</h3>
          {version && <p className="text-sm opacity-70">{version}</p>}
        </div>
      </div>
      <p className="mt-4 flex-grow text-sm opacity-80">
        {comingSoon
          ? 'Our team is hard at work to bring Nati to this platform. Stay tuned for updates!'
          : 'Get the full desktop experience with our native Windows application for the best performance.'}
      </p>
      <div className="mt-6">
        {comingSoon ? (
          <button
            disabled
            className="w-full rounded-lg bg-[var(--muted)]/30 py-3 font-medium text-center"
          >
            Coming Soon
          </button>
        ) : (
          <a
            href={downloadLink}
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[var(--primary)] px-6 py-3 text-lg font-medium text-[var(--primary-foreground)] transition-all duration-200 hover:bg-[var(--primary)]/90 hover:shadow-[0_10px_30px_-15px_var(--primary)]"
          >
            <Download className="h-5 w-5" />
            Download
          </a>
        )}
      </div>
      {comingSoon && (
        <div className="absolute top-2 right-2 rounded-full bg-[var(--muted)]/40 px-2 py-0.5 text-xs font-medium">
          Planned
        </div>
      )}
    </motion.div>
  );
};

const platformIcons = {
  windows: Laptop,
  macos: Apple,
  linux: Terminal,
};

const platformNames = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
};

export default function DownloadPage() {
  const { token } = useAuth();
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  useEffect(() => {
    fetchDownloadLinks();
  }, []);

  async function fetchDownloadLinks() {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .order('platform');

      if (error) throw error;
      setDownloadLinks(data || []);
    } catch (error) {
      console.error('Error fetching download links:', error);
      // Fallback to default
      setDownloadLinks([
        {
          platform: 'windows',
          version: '0.2.2',
          download_url: 'https://github.com/natidev-sh/nati/releases/download/v0.2.2/Nati-0.2.2.Setup.exe',
          is_available: true,
        },
        { platform: 'macos', version: 'Coming Soon', download_url: '#', is_available: false },
        { platform: 'linux', version: 'Coming Soon', download_url: '#', is_available: false },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Download Nati | Nati.dev"
        description="Download the native Nati application for Windows, macOS, or Linux and start building AI apps locally."
      />
      <div className="relative py-16 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-[var(--primary)]/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 tracking-tight sm:text-5xl">Get Nati Everywhere</h1>
          <p className="max-w-3xl mx-auto opacity-80 mb-16 text-lg">
            Build AI apps locally with instant feedback loops and zero cloud dependency. Download the native app for your OS to get started.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {downloadLinks.map((link) => {
              const Icon = platformIcons[link.platform];
              return (
                <PlatformCard
                  key={link.platform}
                  icon={<Icon className="h-7 w-7" />}
                  title={`Nati for ${platformNames[link.platform]}`}
                  version={link.is_available ? `Version ${link.version}` : link.version}
                  downloadLink={link.download_url}
                  comingSoon={!link.is_available}
                />
              );
            })}
          </motion.div>
        )}
        
        {!token && (
          <motion.div
            className="max-w-3xl mx-auto mt-16 p-6 rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-2">Unlock Pro Features</h3>
            <p className="opacity-80 mb-4">
              Create an account or sign in to manage your API keys and unlock pro features for nati.dev.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="px-5 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 transition-colors">
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-16 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="opacity-70">
            Nati is open-source. Advanced users can build from source.
          </p>
          <a
            href="https://github.com/natidev-sh/nati"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 transition-colors hover:bg-[var(--muted)] hover:border-[var(--primary)]/30"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </motion.div>
      </div>

      <section id="pro-pricing" className="py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Go Pro with Nati
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg opacity-80">
            Upgrade to a Pro plan to unlock unlimited projects, advanced analytics, priority support, and much more.
          </p>
        </motion.div>
        <CongestedPricing />
      </section>

      <BentoGrid1 />
      <FooterGlow />
    </>
  );
}