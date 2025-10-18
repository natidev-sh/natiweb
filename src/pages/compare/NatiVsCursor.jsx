import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, Sparkles, Code2, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta.jsx'
import FooterGlow from '../../components/FooterGlow.jsx'
import { useTheme } from '../../theme/ThemeProvider'

export default function NatiVsCursor() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const surfaceCard = isDark
    ? 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm'
    : 'rounded-2xl border border-[var(--border)] bg-white shadow-sm'

  const headingGradient = 'bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-green-500 bg-clip-text text-transparent'

  return (
    <>
      <PageMeta
        title="Nati vs Cursor - AI-First IDE vs AI-Enhanced Editor Comparison 2024"
        description="Compare Nati and Cursor. Nati is built for creating apps from scratch, while Cursor enhances existing code. See which AI development tool fits your workflow."
      />
      
      <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-100' : 'opacity-30'}`} />
        <div className={`absolute top-0 left-0 w-[600px] h-[600px] ${isDark ? 'bg-green-500/10' : 'bg-green-500/5'} rounded-full blur-3xl`} />

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
                  <div className="h-18 w-18 md:h-20 md:w-20 rounded-2xl bg-[var(--background)]/40 flex items-center justify-center">
                    <img
                      src="/assets/logos/brand-logos/nati-logo.png"
                      alt="Nati logo"
                      className="max-h-14 max-w-16 object-contain"
                    />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[var(--foreground)]'}`}>Nati</div>
              </div>
              <div className={`text-4xl ${isDark ? 'text-white/40' : 'text-[var(--muted-foreground)]'}`}>vs</div>
              <div className="text-center">
                <div className="mb-3 flex items-center justify-center">
                  <div className="h-18 w-18 md:h-20 md:w-20 rounded-2xl bg-[var(--background)]/40 flex items-center justify-center">
                    <img
                      src={isDark ? '/assets/logos/brand-logos/compare-logos/Cursor-White.png' : '/assets/logos/brand-logos/compare-logos/Cursor-Dark.png'}
                      alt="Cursor logo"
                      className="max-h-14 max-w-16 object-contain"
                    />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[var(--foreground)]'}`}>Cursor</div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className={headingGradient}>Nati vs Cursor</span>
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
              AI-first creation tool vs AI-enhanced code editor. Different philosophies for different workflows.
            </p>
          </motion.div>

          {/* Quick Summary */}
          <motion.div className="grid md:grid-cols-3 gap-6 mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5">
              <Sparkles className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Built for Creation</h3>
              <p className="text-[var(--muted-foreground)]">
                Nati creates apps <span className="text-purple-500 font-bold">from scratch</span> with AI conversation
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
              <Code2 className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Full Stack Tools</h3>
              <p className="text-[var(--muted-foreground)]">
                <span className="text-green-500 font-bold">Database browser, deployment</span>, and more built-in
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
              <Rocket className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Free Forever</h3>
              <p className="text-[var(--muted-foreground)]">
                <span className="text-blue-500 font-bold">$0 forever</span> vs Cursor's $20/month requirement
              </p>
            </div>
          </motion.div>

          {/* Philosophy Difference */}
          <motion.div className="mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-12">Core Philosophy</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-8 rounded-2xl border-2 border-[var(--primary)] ${isDark ? 'bg-[var(--primary)]/5' : 'bg-[var(--primary)]/10'}`}>
                <div className="text-4xl mb-4"><img
                      src="/assets/logos/brand-logos/nati-logo.png"
                      alt="Nati logo"
                      className="max-h-10 max-w-12 object-contain"
                    /></div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">Nati: AI-First Creation</h3>
                <ul className="space-y-3 text-[var(--muted-foreground)]">
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 mt-0.5" /> Build complete apps from natural language</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 mt-0.5" /> Chat-driven development workflow</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 mt-0.5" /> Integrated database, preview, deploy</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 mt-0.5" /> Designed for building from zero</li>
                </ul>
              </div>
              <div className={`${surfaceCard} p-8`}>
                <div className=" mb-6"><img
                      src={isDark ? '/assets/logos/brand-logos/compare-logos/Cursor-White.png' : '/assets/logos/brand-logos/compare-logos/Cursor-Dark.png'}
                      alt="Cursor logo"
                      className="max-h-16 max-w-16 object-contain"
                    /></div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">Cursor: AI-Enhanced Editing</h3>
                <ul className="space-y-3 text-[var(--muted-foreground)]">
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 mt-0.5" /> Enhanced VS Code with AI features</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 mt-0.5" /> AI-powered code completion</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 mt-0.5" /> Codebase-aware chat</li>
                  <li className="flex items-start gap-2"><Check className="h-5 w-5 text-green-500 mt-0.5" /> Designed for editing existing code</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div className="mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-12">Feature Comparison</h2>
            <div className={`${surfaceCard} overflow-hidden`}>
              <div className="p-6">
                <div className="grid gap-4">
                  {[
                    { name: 'Primary Use', nati: 'Creating new apps', cursor: 'Editing existing code' },
                    { name: 'Free Tier', nati: 'Full features forever', cursor: '2 week trial only' },
                    { name: 'Paid Tier', nati: '$19/month', cursor: '$20/month' },
                    { name: 'AI Chat', nati: true, cursor: true },
                    { name: 'Full App Generation', nati: true, cursor: false },
                    { name: 'Database Browser', nati: true, cursor: false },
                    { name: 'Live Preview', nati: true, cursor: false },
                    { name: 'Deployment Tools', nati: 'Pro', cursor: false },
                    { name: 'VS Code Compatible', nati: false, cursor: true },
                    { name: 'Extension Marketplace', nati: false, cursor: true },
                    { name: 'Local-First', nati: true, cursor: false }
                  ].map((feature, idx) => (
                    <div key={idx} className={`grid md:grid-cols-3 gap-4 items-center py-3 border-b ${isDark ? 'border-white/5' : 'border-[var(--border)]'} last:border-0`}>
                      <div className="font-semibold text-[var(--foreground)]">{feature.name}</div>
                      <div className="flex items-center gap-2">
                        {typeof feature.nati === 'boolean' ? (
                          feature.nati ? <><Check className="h-5 w-5 text-green-500" /> <span className="text-green-500">Yes</span></> : <><X className="h-5 w-5 text-red-500" /> <span className="text-red-500">No</span></>
                        ) : <span className="text-[var(--primary)] font-semibold">{feature.nati}</span>}
                      </div>
                      <div className={`flex items-center gap-2 ${isDark ? 'opacity-60' : 'text-[var(--muted-foreground)]'}`}>
                        {typeof feature.cursor === 'boolean' ? (
                          feature.cursor ? <><Check className="h-5 w-5 text-green-500" /> <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>Yes</span></> : <><X className="h-5 w-5 text-red-500" /> <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>No</span></>
                        ) : <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>{feature.cursor}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div className="mb-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-12">When to Use Each</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Starting a New Project', winner: 'Nati', reason: 'Build complete apps from description' },
                { title: 'Refactoring Existing Code', winner: 'Cursor', reason: 'AI understands your codebase' },
                { title: 'MVP Development', winner: 'Nati', reason: 'Fastest path from idea to working app' },
                { title: 'Need VS Code Extensions', winner: 'Cursor', reason: 'Compatible with VS Code ecosystem' },
                { title: 'Full-Stack Development', winner: 'Nati', reason: 'Database, preview, deploy all integrated' },
                { title: 'Learning to Code', winner: 'Nati', reason: 'Chat-driven, explains as it builds' }
              ].map((useCase, idx) => (
                <div key={idx} className={`${surfaceCard} p-6`}>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{useCase.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[var(--muted-foreground)]">Best:</span>
                    <span className={`font-bold ${useCase.winner === 'Nati' ? 'text-[var(--primary)]' : 'text-green-400'}`}>{useCase.winner}</span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{useCase.reason}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Verdict */}
          <motion.div className="rounded-3xl border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 to-green-500/10 p-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">The Verdict</h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-8">
              Not really competitors - different tools for different jobs. Use <span className="text-[var(--primary)] font-bold">Nati</span> to create new apps from scratch. 
              Use <span className="text-green-400 font-bold">Cursor</span> to enhance your existing development workflow. Many developers use both!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/download" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all">
                Try Nati Free <ArrowRight className="h-5 w-5" />
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
