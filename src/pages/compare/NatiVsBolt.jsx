import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, Shield, Zap, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta.jsx'
import FooterGlow from '../../components/FooterGlow.jsx'
import { useTheme } from '../../theme/ThemeProvider'

export default function NatiVsBolt() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const surfaceCard = isDark
    ? 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm'
    : 'rounded-2xl border border-[var(--border)] bg-white shadow-sm'

  const headingGradient = 'bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-blue-500 bg-clip-text text-transparent'

  return (
    <>
      <PageMeta
        title="Nati vs Bolt - Desktop vs Browser AI IDE Comparison 2024"
        description="Compare Nati and Bolt. Nati offers native desktop performance and offline development, while Bolt runs in your browser. See which AI IDE is right for you."
      />
      
      <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-100' : 'opacity-30'}`} />
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'} rounded-full blur-3xl`} />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="mb-8">
            <Link to="/compare" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
              ← Back to all comparisons
            </Link>
          </div>

          {/* Hero */}
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="mb-3 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-xl bg-[var(--background)]/40 flex items-center justify-center">
                    <img
                      src="/assets/logos/brand-logos/nati-logo.png"
                      alt="Nati logo"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[var(--foreground)]'}`}>Nati</div>
              </div>
              <div className={`text-4xl ${isDark ? 'text-white/40' : 'text-[var(--muted-foreground)]'}`}>vs</div>
              <div className="text-center">
                <div className="mb-3 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-xl bg-[var(--background)]/40 flex items-center justify-center">
                    <img
                      src="/assets/logos/brand-logos/compare-logos/bolt-new-logo.svg"
                      alt="Bolt logo"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[var(--foreground)]'}`}>Bolt</div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className={headingGradient}>Nati vs Bolt</span>
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
              Native desktop power vs browser convenience. See which approach fits your development workflow.
            </p>
          </motion.div>

          {/* Quick Summary */}
          <motion.div className="grid md:grid-cols-3 gap-6 mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
              <Shield className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Desktop App</h3>
              <p className="text-[var(--muted-foreground)]">
                Nati is a <span className="text-blue-500 font-bold">native desktop app</span> with full OS integration
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
              <Zap className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Offline Mode</h3>
              <p className="text-[var(--muted-foreground)]">
                Work <span className="text-green-500 font-bold">completely offline</span>, no internet required
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5">
              <Code2 className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Full Control</h3>
              <p className="text-[var(--muted-foreground)]">
                <span className="text-purple-500 font-bold">Local-first</span> with complete file system access
              </p>
            </div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div className="mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-12">Key Differences</h2>
            <div className={`${surfaceCard} overflow-hidden`}>
              <div className="p-6">
                <div className="grid gap-4">
                  {[
                    { name: 'Platform', nati: 'Native Desktop App', bolt: 'Browser-based' },
                    { name: 'Offline Support', nati: true, bolt: false },
                    { name: 'File System Access', nati: true, bolt: 'Limited' },
                    { name: 'Installation', nati: 'Required', bolt: 'Not required' },
                    { name: 'Deployment', nati: true, bolt: 'Pro' },
                    { name: 'Performance', nati: 'Native speed', bolt: 'Browser limited' },
                    { name: 'Privacy', nati: 'Local-first', bolt: 'Cloud-based' },
                    { name: 'Database Tools', nati: true, bolt: false },
                    { name: 'Free Tier', nati: 'Unlimited', bolt: 'Limited' },
                  ].map((feature, idx) => (
                    <div key={idx} className={`grid md:grid-cols-3 gap-4 items-center py-3 border-b ${isDark ? 'border-white/5' : 'border-[var(--border)]'} last:border-0`}>
                      <div className="font-semibold text-[var(--foreground)]">{feature.name}</div>
                      <div className="flex items-center gap-2">
                        {typeof feature.nati === 'boolean' ? (
                          feature.nati ? <><Check className="h-5 w-5 text-green-500" /> <span className="text-green-500">Yes</span></> : <><X className="h-5 w-5 text-red-500" /> <span className="text-red-500">No</span></>
                        ) : <span className="text-[var(--primary)] font-semibold">{feature.nati}</span>}
                      </div>
                      <div className={`flex items-center gap-2 ${isDark ? 'opacity-60' : 'text-[var(--muted-foreground)]'}`}>
                        {typeof feature.bolt === 'boolean' ? (
                          feature.bolt ? <><Check className="h-5 w-5 text-green-500" /> <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>Yes</span></> : <><X className="h-5 w-5 text-red-500" /> <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>No</span></>
                        ) : <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>{feature.bolt}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div className="mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-12">Best Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Professional Development', winner: 'Nati', reason: 'Native performance, offline support, full file access' },
                { title: 'Quick Browser Prototypes', winner: 'Bolt', reason: 'No installation, instant access from anywhere' },
                { title: 'Privacy-Sensitive Projects', winner: 'Nati', reason: 'Local-first, code never leaves your machine' },
                { title: 'Team Collaboration', winner: 'Nati', reason: 'Built-in Git, real-time features with Pro' },
                { title: 'Offline Development', winner: 'Nati', reason: 'Full functionality without internet' },
                { title: 'Trying AI IDEs', winner: 'Bolt', reason: 'Zero setup, test immediately in browser' }
              ].map((useCase, idx) => (
                <div key={idx} className={`${surfaceCard} p-6`}>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{useCase.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[var(--muted-foreground)]">Best:</span>
                    <span className={`font-bold ${useCase.winner === 'Nati' ? 'text-[var(--primary)]' : 'text-blue-400'}`}>{useCase.winner}</span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{useCase.reason}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Verdict */}
          <motion.div className="rounded-3xl border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 to-blue-500/10 p-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">The Verdict</h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-8">
              Choose <span className="text-[var(--primary)] font-bold">Nati</span> for professional development with native performance and offline support. 
              Choose <span className="text-blue-400 font-bold">Bolt</span> for quick browser-based experiments with zero setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/download" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all">
                Download Nati Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/compare" className={`inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all ${
                isDark ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
              }`}>
                See Other Comparisons
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      <FooterGlow />
    </>
  )
}
