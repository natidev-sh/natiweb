import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Zap, DollarSign, Shield, Code2, Users, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta.jsx'
import FooterGlow from '../components/FooterGlow.jsx'
import { useTheme } from '../theme/ThemeProvider'

const getCompetitors = (isDark) => [
  {
    name: 'Lovable',
    slug: 'lovable',
    tagline: 'See why developers choose Nati over Lovable',
    description: '5x cheaper, local-first, your code stays on your machine',
    logo: isDark
      ? '/assets/logos/brand-logos/compare-logos/lovable_logo_white.svg'
      : '/assets/logos/brand-logos/compare-logos/lovable_logo_black.svg',
    gradient: 'from-purple-500 to-pink-500',
    keyDiff: 'Local-first vs Cloud-only',
    highlights: ['$19 vs $100/mo', 'Local-first', 'No vendor lock-in']
  },
  {
    name: 'v0 by Vercel',
    slug: 'v0',
    tagline: 'Nati offers more control and flexibility than v0',
    description: 'Full IDE for complete apps vs component-only generator',
    logo: isDark
      ? '/assets/logos/brand-logos/compare-logos/v0-logo-dark.svg'
      : '/assets/logos/brand-logos/compare-logos/v0-logo-light.svg',
    gradient: 'from-black to-gray-700',
    keyDiff: 'Full IDE vs Component Generator',
    highlights: ['Complete apps', 'Any framework', 'No credits']
  },
  {
    name: 'Bolt',
    slug: 'bolt',
    tagline: 'Local development with more power than Bolt',
    description: 'Native desktop performance vs browser limitations',
    logo: '/assets/logos/brand-logos/compare-logos/bolt-new-logo.svg',
    gradient: 'from-blue-500 to-cyan-500',
    keyDiff: 'Desktop App vs Browser-only',
    highlights: ['Works offline', 'Native speed', 'Full file access']
  },
  {
    name: 'Cursor',
    slug: 'cursor',
    tagline: 'AI-first development vs Code editor with AI',
    description: 'Built for creating apps from scratch vs editing existing code',
    logo: isDark
      ? '/assets/logos/brand-logos/compare-logos/Cursor-White.png'
      : '/assets/logos/brand-logos/compare-logos/Cursor-Dark.png',
    gradient: 'from-green-500 to-emerald-500',
    keyDiff: 'Built for creation vs Built for editing',
    highlights: ['Free forever', 'Chat-driven', 'Database tools']
  }
]

const quickComparison = [
  {
    feature: 'Pricing',
    nati: 'Free forever, Pro $19/mo',
    icon: DollarSign,
    color: 'text-green-500'
  },
  {
    feature: 'Privacy',
    nati: 'Local-first, your code stays on your machine',
    icon: Shield,
    color: 'text-blue-500'
  },
  {
    feature: 'Speed',
    nati: 'Lightning fast with native performance',
    icon: Zap,
    color: 'text-yellow-500'
  },
  {
    feature: 'Technology',
    nati: 'Full-stack apps, any framework',
    icon: Code2,
    color: 'text-purple-500'
  },
  {
    feature: 'Collaboration',
    nati: 'Real-time team features with Pro',
    icon: Users,
    color: 'text-pink-500'
  },
  {
    feature: 'Deployment',
    nati: 'Deploy anywhere with one click',
    icon: Globe,
    color: 'text-cyan-500'
  }
]

export default function Compare() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const competitors = useMemo(() => getCompetitors(isDark), [isDark])

  return (
    <>
      <PageMeta
        title="Compare Nati | vs Lovable, v0, Bolt, Cursor - AI IDE Comparison"
        description="Compare Nati with Lovable, v0, Bolt, and Cursor. See feature-by-feature comparisons, pricing, and why developers choose Nati for AI-powered development."
      />
      
      <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
        {/* Background Effects */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-100' : 'opacity-30'}`} />
        <div className={`absolute top-0 left-0 w-[800px] h-[800px] ${isDark ? 'bg-[var(--primary)]/10' : 'bg-[var(--primary)]/5'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 right-0 w-[800px] h-[800px] ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl`} />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--primary)]">Honest Comparisons</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-purple-500 bg-clip-text text-transparent">
                How Nati Compares
              </span>
            </h1>

            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-12">
              See how Nati stacks up against other AI development tools. 
              We believe in transparency, so here's an honest comparison.
            </p>
          </motion.div>

          {/* Quick Comparison Grid */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-12">
              Why Developers Choose Nati
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickComparison.map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={idx}
                    className={`p-6 rounded-2xl transition-all ${
                      isDark ? 'border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20' : 'border border-[var(--border)] bg-white hover:border-[var(--primary)]/40 shadow-sm'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Icon className={`h-8 w-8 ${item.color} mb-4`} />
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{item.feature}</h3>
                    <p className="text-[var(--muted-foreground)]">{item.nati}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Detailed Comparisons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] text-center mb-4">
              Detailed Comparisons
            </h2>
            <p className="text-center text-[var(--muted-foreground)] mb-12 text-lg">
              Choose a tool to see a detailed side-by-side comparison
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {competitors.map((competitor, idx) => (
                <motion.div
                  key={competitor.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <Link
                    to={`/compare/${competitor.slug}`}
                    className={`group block relative p-8 rounded-2xl transition-all hover:scale-105 ${
                      isDark ? 'border-2 border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm hover:border-[var(--primary)]/50' : 'border-2 border-[var(--border)] bg-white hover:border-[var(--primary)]/40 shadow-md'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${competitor.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-xl bg-[var(--background)]/40 flex items-center justify-center">
                          <img
                            src={competitor.logo}
                            alt={`${competitor.name} logo`}
                            className="max-h-12 max-w-16 object-contain"
                          />
                        </div>
                        <ArrowRight className={`h-6 w-6 transition-all ${isDark ? 'text-white/40 group-hover:text-[var(--primary)]' : 'text-[var(--muted-foreground)] group-hover:text-[var(--primary)]'} group-hover:translate-x-1`} />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                        Nati vs {competitor.name}
                      </h3>
                      
                      <p className="text-[var(--muted-foreground)] mb-3 text-sm">
                        {competitor.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {competitor.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                            <Check className="h-3 w-3 text-[var(--primary)]" />
                            <span className="text-xs font-semibold text-[var(--primary)]">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-white/60' : 'text-[var(--muted-foreground)]'}`}>
                        <span>View detailed comparison</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-20 text-center rounded-3xl border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 backdrop-blur-xl p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              Try Nati Free Today
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto">
              Join thousands of developers building faster with AI. 
              No credit card required, no cloud lock-in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Download Nati Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/demo"
                className={`inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all ${
                  isDark ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                }`}
              >
                Try Interactive Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      <FooterGlow />
    </>
  )
}
