import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, Code2, Layers, Zap, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta.jsx'
import FooterGlow from '../../components/FooterGlow.jsx'
import { useTheme } from '../../theme/ThemeProvider'

const comparisonData = [
  {
    category: 'Scope & Purpose',
    features: [
      { name: 'Full IDE Experience', nati: true, v0: false },
      { name: 'Component Generation', nati: true, v0: true },
      { name: 'Complete App Building', nati: true, v0: false },
      { name: 'Database Management', nati: true, v0: false },
    ]
  },
  {
    category: 'Pricing',
    features: [
      { name: 'Free Tier', nati: 'Unlimited forever', v0: '200 credits' },
      { name: 'Pro Price', nati: '$19/month', v0: '$20/month' },
      { name: 'Unlimited Usage', nati: true, v0: 'Credit-based' },
    ]
  },
  {
    category: 'Development Features',
    features: [
      { name: 'AI Chat Assistant', nati: true, v0: true },
      { name: 'Real-time Preview', nati: true, v0: true },
      { name: 'Full Project Management', nati: true, v0: false },
      { name: 'Database Browser', nati: true, v0: false },
      { name: 'Deployment Tools', nati: true, v0: false },
      { name: 'Team Collaboration', nati: 'Pro', v0: false },
      { name: 'Git Integration', nati: true, v0: false },
    ]
  },
  {
    category: 'Technology',
    features: [
      { name: 'Framework Support', nati: 'Any framework', v0: 'React/Next.js' },
      { name: 'Local Development', nati: true, v0: false },
      { name: 'Offline Mode', nati: true, v0: false },
      { name: 'Open Source', nati: true, v0: false },
    ]
  }
]

const prosConsData = {
  nati: {
    pros: [
      'Full IDE with complete project management',
      'Build entire applications, not just components',
      'Local-first development',
      'Free tier with unlimited usage',
      'Visual database browser',
      'Works offline',
      'Any framework support',
      'Open source'
    ],
    cons: [
      'Requires desktop installation',
      'More complex for simple component generation',
      'Learning curve for full IDE features'
    ]
  },
  v0: {
    pros: [
      'Excellent for quick component generation',
      'Browser-based, no installation',
      'Vercel integration',
      'Simple and focused',
      'Great for React/Next.js'
    ],
    cons: [
      'Component-only, not full apps',
      'Credit-based system limits usage',
      'No database management',
      'No local development',
      'Limited to React/Next.js',
      'No project management features',
      'Requires internet connection',
      'Closed source'
    ]
  }
}

const useCases = [
  {
    title: 'Building Complete Applications',
    winner: 'Nati',
    reason: 'Full IDE with project management, database tools, and deployment'
  },
  {
    title: 'Quick React Component Generation',
    winner: 'v0',
    reason: 'Specialized and optimized for React component creation'
  },
  {
    title: 'Team Projects',
    winner: 'Nati',
    reason: 'Built-in collaboration, Git integration, and team features'
  },
  {
    title: 'Rapid Prototyping UI',
    winner: 'v0',
    reason: 'Fast, focused component generation in browser'
  },
  {
    title: 'Production Applications',
    winner: 'Nati',
    reason: 'Full development environment with database, testing, and deployment'
  },
  {
    title: 'Multi-framework Projects',
    winner: 'Nati',
    reason: 'Supports any framework, not limited to React/Next.js'
  }
]

export default function NatiVsV0() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const surfaceCard = isDark
    ? 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm'
    : 'rounded-2xl border border-[var(--border)] bg-white shadow-sm'

  const headingGradient = 'bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-black bg-clip-text text-transparent'

  return (
    <>
      <PageMeta
        title="Nati vs v0 by Vercel - Full IDE vs Component Generator Comparison 2024"
        description="Compare Nati and v0. Nati offers a complete IDE for building full applications, while v0 specializes in React component generation. See which fits your needs."
      />
      
      <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-100' : 'opacity-30'}`} />
        <div className={`absolute top-0 left-0 w-[600px] h-[600px] ${isDark ? 'bg-black/50' : 'bg-slate-200/50'} rounded-full blur-3xl`} />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="mb-8">
            <Link to="/compare" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
              ← Back to all comparisons
            </Link>
          </div>

          {/* Hero */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
                      src={isDark ? '/assets/logos/brand-logos/compare-logos/v0-logo-light.svg' : '/assets/logos/brand-logos/compare-logos/v0-logo-dark.svg'}
                      alt="v0 logo"
                      className="max-h-14 max-w-18 object-contain"
                    />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[var(--foreground)]'}`}>v0</div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className={headingGradient}>
                Nati vs v0 by Vercel
              </span>
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
              Full IDE for building complete applications vs specialized component generator. 
              Different tools for different needs.
            </p>
          </motion.div>

          {/* Quick Summary */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
              <Layers className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Complete IDE</h3>
              <p className="text-[var(--muted-foreground)]">
                Nati builds <span className="text-blue-500 font-bold">entire applications</span>, not just components
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
              <DollarSign className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Unlimited Usage</h3>
              <p className="text-[var(--muted-foreground)]">
                No credits system - <span className="text-green-500 font-bold">build as much as you want</span>
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5">
              <Code2 className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Any Framework</h3>
              <p className="text-[var(--muted-foreground)]">
                <span className="text-purple-500 font-bold">Not limited to React</span> - use Vue, Svelte, Angular, or anything
              </p>
            </div>
          </motion.div>

          {/* Detailed Comparison */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-12">
              Feature-by-Feature Comparison
            </h2>
            <div className="space-y-8">
              {comparisonData.map((section, idx) => (
                <div key={idx} className={`${surfaceCard} overflow-hidden`}>
                  <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-[var(--muted)]/40 border-[var(--border)]/60'} px-6 py-4 border-b`}>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">{section.category}</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid gap-4">
                      {section.features.map((feature, featureIdx) => (
                        <div key={featureIdx} className={`grid md:grid-cols-3 gap-4 items-center py-3 border-b ${isDark ? 'border-white/5' : 'border-[var(--border)]'} last:border-0`}>
                          <div className="font-semibold text-[var(--foreground)]">{feature.name}</div>
                          <div className="flex items-center gap-2">
                            {typeof feature.nati === 'boolean' ? (
                              feature.nati ? (
                                <><Check className="h-5 w-5 text-green-500" /> <span className="text-green-500">Yes</span></>
                              ) : (
                                <><X className="h-5 w-5 text-red-500" /> <span className="text-red-500">No</span></>
                              )
                            ) : (
                              <span className="text-[var(--primary)] font-semibold">{feature.nati}</span>
                            )}
                          </div>
                          <div className={`flex items-center gap-2 ${isDark ? 'opacity-60' : 'text-[var(--muted-foreground)]'}`}>
                            {typeof feature.v0 === 'boolean' ? (
                              feature.v0 ? (
                                <><Check className="h-5 w-5 text-green-500" /> <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>Yes</span></>
                              ) : (
                                <><X className="h-5 w-5 text-red-500" /> <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>No</span></>
                              )
                            ) : (
                              <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>{feature.v0}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pros & Cons */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={`rounded-2xl border-2 border-[var(--primary)] ${isDark ? 'bg-[var(--primary)]/5' : 'bg-[var(--primary)]/10'} p-8`}>
            <div className=" mb-6"><img
                      src={isDark ? '/assets/logos/brand-logos/compare-logos/Nati-Light.png' : '/assets/logos/brand-logos/compare-logos/Nati-Dark.png'}
                      alt="Nati Logo"
                      className="max-h-16 max-w-16 object-contain"
                    /></div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6">Nati Advantages</h3>
              <ul className="space-y-3">
                {prosConsData.nati.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--foreground)]">{pro}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-[var(--muted-foreground)] mb-3">Considerations:</p>
                <ul className="space-y-2">
                  {prosConsData.nati.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-yellow-500">•</span>
                      <span className="text-[var(--muted-foreground)] text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`${surfaceCard} p-8`}>
              <div className=" mb-6"><img
                      src={isDark ? '/assets/logos/brand-logos/compare-logos/v0-logo-light.svg' : '/assets/logos/brand-logos/compare-logos/v0-logo-dark.svg'}
                      alt="v0 Logo"
                      className="max-h-16 max-w-16 object-contain"
                    /></div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6">v0 Advantages</h3>
              <ul className="space-y-3">
                {prosConsData.v0.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--foreground)]">{pro}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-[var(--muted-foreground)] mb-3">Limitations:</p>
                <ul className="space-y-2">
                  {prosConsData.v0.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                      <span className="text-[var(--muted-foreground)] text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-12">
              Which Tool for Which Use Case?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, idx) => (
                <div key={idx} className={`${surfaceCard} p-6`}>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{useCase.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[var(--muted-foreground)]">Winner:</span>
                    <span className={`font-bold ${useCase.winner === 'Nati' ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                      {useCase.winner}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{useCase.reason}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Final Verdict */}
          <motion.div
            className={`rounded-3xl border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 ${isDark ? 'to-black/10' : 'to-slate-200/40'} p-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">The Verdict</h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-8">
              <span className="text-[var(--primary)] font-bold">Nati</span> is a full IDE for building complete applications 
              with database management, deployment, and team features. <span className={`font-bold ${isDark ? 'text-white' : 'text-[var(--foreground)]'}`}>v0</span> excels 
              at quick React component generation. Choose Nati for full projects, v0 for quick components.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                Try Nati Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/compare"
                className={`inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all ${
                  isDark ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                }`}
              >
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
