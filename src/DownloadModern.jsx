import React, { useState, useEffect } from 'react';
import { Download, Laptop, Apple, Terminal, Github, Loader2, Sparkles, Shield, Zap, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import FooterGlow from './components/FooterGlow';
import BentoGrid1 from './sections/BentoGrid1.jsx';
import CongestedPricing from './components/mvpblocks/congusted-pricing.tsx';
import PageMeta from './components/PageMeta.jsx';
import { supabase } from './integrations/supabase/client';

const PlatformCard = ({ icon, title, version, downloadLink, comingSoon = false, isBeta = false, featured = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
        comingSoon
          ? 'border-[var(--border)]/50 bg-[var(--background-darkest)]/50 text-[var(--muted-foreground)]'
          : featured
          ? 'border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--background-darkest)] to-[var(--background-darkest)] shadow-2xl shadow-[var(--primary)]/30'
          : 'border-[var(--border)] bg-[var(--background-darkest)] shadow-xl shadow-[var(--primary)]/10 hover:border-[var(--primary)]/40 hover:shadow-[var(--primary)]/20'
      }`}
    >
      {/* Animated gradient border on hover */}
      {!comingSoon && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(45deg, var(--primary), transparent, var(--primary))',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
            opacity: isHovered ? 0.1 : 0,
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-3 -right-3 rotate-12">
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-purple-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
            <Sparkles className="h-3 w-3" />
            RECOMMENDED
          </div>
        </div>
      )}

      {/* Beta badge */}
      {isBeta && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-xs font-medium text-amber-500">
            <FlaskConical className="h-3 w-3" />
            BETA
          </div>
        </div>
      )}

      <div className="relative flex items-center gap-4 z-10">
        <motion.div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${
            comingSoon ? 'bg-[var(--muted)]/20' : 'bg-[var(--primary)]/15 text-[var(--primary)]'
          }`}
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {icon}
        </motion.div>
        <div>
          <h3 className={`text-xl font-semibold ${comingSoon ? '' : 'text-[var(--foreground)]'}`}>{title}</h3>
          {version && (
            <p className="text-sm opacity-70 flex items-center gap-1">
              {version}
              {isBeta && <span className="text-amber-500">• Experimental</span>}
            </p>
          )}
        </div>
      </div>

      <p className="relative mt-4 flex-grow text-sm opacity-80 z-10">
        {comingSoon
          ? 'Our team is hard at work to bring Nati to this platform. Stay tuned for updates!'
          : isBeta
          ? 'Latest features and improvements. May contain bugs. Perfect for testing new features before stable release.'
          : 'Get the full desktop experience with our native application for the best performance and stability.'}
      </p>

      <div className="relative mt-6 z-10">
        {comingSoon ? (
          <button
            disabled
            className="w-full rounded-lg bg-[var(--muted)]/30 py-3 font-medium text-center"
          >
            Coming Soon
          </button>
        ) : (
          <motion.a
            href={downloadLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative inline-flex w-full items-center justify-center gap-3 rounded-lg px-6 py-3 text-lg font-medium transition-all duration-200 overflow-hidden ${
              isBeta
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-[0_10px_30px_-15px] hover:shadow-amber-500/50'
                : 'bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white hover:shadow-[0_10px_30px_-15px] hover:shadow-[var(--primary)]'
            }`}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: isHovered ? '100%' : '-100%' }}
              transition={{ duration: 0.6 }}
            />
            <Download className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Download {isBeta ? 'Beta' : 'Stable'}</span>
          </motion.a>
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

export default function DownloadModern() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('stable');
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [betaLinks, setBetaLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloadLinks();
  }, []);

  async function fetchDownloadLinks() {
    try {
      // Fetch stable releases
      const { data: stableData, error: stableError } = await supabase
        .from('download_links')
        .select('*')
        .eq('is_beta', false)
        .order('platform');

      // Fetch beta releases
      const { data: betaData, error: betaError } = await supabase
        .from('download_links')
        .select('*')
        .eq('is_beta', true)
        .order('platform');

      if (stableError) throw stableError;
      
      // Sort to put Windows first
      const sortPlatforms = (data) => {
        const order = { windows: 0, macos: 1, linux: 2 };
        return data.sort((a, b) => (order[a.platform] || 99) - (order[b.platform] || 99));
      };

      setDownloadLinks(sortPlatforms(stableData || []));
      setBetaLinks(sortPlatforms(betaData || []));
    } catch (error) {
      console.error('Error fetching download links:', error);
      // Fallback with Windows first
      setDownloadLinks([
        {
          platform: 'windows',
          version: '0.2.10',
          download_url: 'https://github.com/natidev-sh/nati/releases/download/v0.2.10/Nati-0.2.10.Setup.exe',
          is_available: true,
          is_beta: false,
        },
        { platform: 'macos', version: 'Coming Soon', download_url: '#', is_available: false, is_beta: false },
        { platform: 'linux', version: 'Coming Soon', download_url: '#', is_available: false, is_beta: false },
      ]);
      setBetaLinks([
        {
          platform: 'windows',
          version: '0.2.11-beta1',
          download_url: 'https://github.com/natidev-sh/nati/releases/download/v0.2.11-beta1/Nati-0.2.11-beta1.Setup.exe',
          is_available: true,
          is_beta: true,
        },
        { platform: 'macos', version: 'Coming Soon', download_url: '#', is_available: false, is_beta: true },
        { platform: 'linux', version: 'Coming Soon', download_url: '#', is_available: false, is_beta: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const currentLinks = activeTab === 'stable' ? downloadLinks : betaLinks;

  return (
    <>
      <PageMeta
        title="Download Nati | Nati.dev"
        description="Download the native Nati application for Windows, macOS, or Linux. Choose between stable releases or beta versions with latest features."
      />
      <div className="relative py-16 text-center">
        {/* Animated background gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 tracking-tight sm:text-5xl bg-gradient-to-r from-[var(--foreground)] to-[var(--primary)] bg-clip-text text-transparent">
            Get Nati Everywhere
          </h1>
          <p className="max-w-3xl mx-auto opacity-80 mb-8 text-lg">
            Build AI apps locally with instant feedback loops and zero cloud dependency.
          </p>
        </motion.div>

        {/* Channel Tabs */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex gap-2 p-1 rounded-xl bg-[var(--background-darkest)] border border-[var(--border)]">
            <button
              onClick={() => setActiveTab('stable')}
              className={`relative px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'stable'
                  ? 'text-white'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {activeTab === 'stable' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Stable Release
              </span>
            </button>
            <button
              onClick={() => setActiveTab('beta')}
              className={`relative px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'beta'
                  ? 'text-white'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {activeTab === 'beta' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                Beta Channel
              </span>
            </button>
          </div>
        </motion.div>

        {/* Channel Info Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="max-w-3xl mx-auto mb-12 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-darkest)]/50"
          >
            {activeTab === 'stable' ? (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Production Ready</p>
                  <p className="text-[var(--muted-foreground)]">Thoroughly tested and recommended for all users</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Latest Features</p>
                  <p className="text-[var(--muted-foreground)]">Get experimental features first • May contain bugs</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Platform Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
            >
              {currentLinks.map((link, index) => {
                const Icon = platformIcons[link.platform];
                // Windows is featured on both channels
                const featured = link.platform === 'windows';
                return (
                  <motion.div
                    key={`${activeTab}-${link.platform}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PlatformCard
                      icon={<Icon className="h-7 w-7" />}
                      title={`Nati for ${platformNames[link.platform]}`}
                      version={link.is_available ? `Version ${link.version}` : link.version}
                      downloadLink={link.download_url}
                      comingSoon={!link.is_available}
                      isBeta={activeTab === 'beta'}
                      featured={featured}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Login CTA */}
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

        {/* GitHub Link */}
        <motion.div
          className="mt-16 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="opacity-70">
            Nati is open-source. Advanced users can build from source.
          </p>
          <motion.a
            href="https://github.com/natidev-sh/nati"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 transition-colors hover:bg-[var(--muted)] hover:border-[var(--primary)]/30"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </motion.a>
        </motion.div>
      </div>

      {/* Pricing Section */}
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
