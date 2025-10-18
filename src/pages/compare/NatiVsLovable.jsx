import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, Shield, Zap, DollarSign, Code2, Globe, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageMeta from '../../components/PageMeta.jsx'
import FooterGlow from '../../components/FooterGlow.jsx'
import { useTheme } from '../../theme/ThemeProvider'

const comparisonData = [
  {
    category: 'Pricing',
    features: [
      { name: 'Free Tier', nati: true, lovable: false },
      { name: 'Starting Price', nati: '$0 (Free forever)', lovable: '$20/month' },
      { name: 'Pro Price', nati: '$19/month', lovable: '$100/month' },
      { name: 'Unlimited Projects', nati: true, lovable: 'Limited by plan' },
    ]
  },
  {
    category: 'Privacy & Security',
    features: [
      { name: 'Local-first Development', nati: true, lovable: false },
      { name: 'Code Stays on Your Machine', nati: true, lovable: false },
      { name: 'No Cloud Lock-in', nati: true, lovable: false },
      { name: 'Offline Mode', nati: true, lovable: false },
    ]
  },
  {
    category: 'Features',
    features: [
      { name: 'AI Chat Assistant', nati: true, lovable: true },
      { name: 'Code Generation', nati: true, lovable: true },
      { name: 'Visual Database Browser', nati: true, lovable: false },
      { name: 'Real-time Preview', nati: true, lovable: true },
      { name: 'Team Collaboration', nati: 'Pro', lovable: true },
      { name: 'One-click Deployment', nati: true, lovable: true },
      { name: 'Custom AI Models', nati: 'Pro', lovable: false },
    ]
  },
  {
    category: 'Technology',
    features: [
      { name: 'Any Framework Support', nati: true, lovable: 'Limited' },
      { name: 'Desktop Application', nati: true, lovable: false },
      { name: 'Browser-based', nati: false, lovable: true },
      { name: 'Native Performance', nati: true, lovable: false },
      { name: 'Open Source', nati: true, lovable: false },
    ]
  }
]

const prosConsData = {
  nati: {
    pros: [
      'Free forever with no limitations',
      'Your code stays private on your machine',
      'Works offline',
      'Open source and transparent',
      'Native desktop performance',
      'No vendor lock-in',
      'Pro tier is 5x cheaper ($19 vs $100)',
      'Advanced database tools'
    ],
    cons: [
      'Requires local installation',
      'Desktop app only (no browser version)',
      'Team features require Pro'
    ]
  },
  lovable: {
    pros: [
      'Browser-based, no installation',
      'Team collaboration in all tiers',
      'Cloud hosting included',
      'Simple getting started'
    ],
    cons: [
      'No free tier',
      'Expensive ($20-$100/month)',
      'Your code in their cloud',
      'Requires internet connection',
      'Vendor lock-in',
      'Closed source',
      'Limited framework support'
    ]
  }
}

const useCases = [
  {
    title: 'For Privacy-Conscious Developers',
    winner: 'Nati',
    reason: 'Code stays on your machine, no cloud upload required'
  },
  {
    title: 'For Budget-Conscious Teams',
    winner: 'Nati',
    reason: 'Free forever, Pro is $19/mo vs Lovable\'s $20-$100/mo'
  },
  {
    title: 'For Quick Browser-based Prototypes',
    winner: 'Lovable',
    reason: 'No installation needed, works in browser'
  },
  {
    title: 'For Production Apps',
    winner: 'Nati',
    reason: 'Better performance, more control, advanced tools'
  },
  {
    title: 'For Offline Development',
    winner: 'Nati',
    reason: 'Works completely offline, Lovable requires internet'
  }
]

export default function NatiVsLovable() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const surfaceCard = isDark
    ? 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm'
    : 'rounded-2xl border border-[var(--border)] bg-white shadow-sm'

  const secondaryCard = isDark
    ? 'rounded-2xl border border-white/10 bg-white/5'
    : 'rounded-2xl border border-[var(--border)] bg-white'

  const headingGradient = 'bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-purple-500 bg-clip-text text-transparent'

  return (
    <>
      <PageMeta
        title="Nati vs Lovable - Detailed Comparison 2024 | Which AI IDE is Better?"
        description="Compare Nati and Lovable side-by-side. See pricing, features, performance, and privacy differences. Nati offers local-first development at 5x lower cost."
      />
      
      <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
        {/* Background */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-100' : 'opacity-30'}`} />
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl`} />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          {/* Breadcrumb */}
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
                      src={isDark ? '/assets/logos/brand-logos/compare-logos/lovable_logo_white.svg' : '/assets/logos/brand-logos/compare-logos/lovable_logo_black.svg'}
                      alt="Lovable logo"
                      className="max-h-14 max-w-16 object-contain"
                    />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[var(--foreground)]'}`}>Lovable</div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className={headingGradient}>
                Nati vs Lovable
              </span>
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
              Local-first AI development vs Cloud-based platform. 
              See which tool fits your workflow and budget better.
            </p>
          </motion.div>

          {/* Quick Summary */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6 rounded-2xl border border-green-500/20 bg-green-500/5">
              <DollarSign className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Price Advantage</h3>
              <p className="text-[var(--muted-foreground)]">
                Nati is <span className="text-green-500 font-bold">5x cheaper</span> - $19/mo vs $100/mo for Pro features
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
              <Shield className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Privacy First</h3>
              <p className="text-[var(--muted-foreground)]">
                Your code <span className="text-blue-500 font-bold">stays on your machine</span> with Nati's local-first approach
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5">
              <Zap className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Native Speed</h3>
              <p className="text-[var(--muted-foreground)]">
                Desktop app with <span className="text-purple-500 font-bold">native performance</span>, works offline
              </p>
            </div>
          </motion.div>

          {/* Detailed Comparison Table */}
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
                            {typeof feature.lovable === 'boolean' ? (
                              feature.lovable ? (
                                <><Check className="h-5 w-5 text-green-500" /> <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>Yes</span></>
                              ) : (
                                <><X className="h-5 w-5 text-red-500" /> <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>No</span></>
                              )
                            ) : (
                              <span className={isDark ? 'text-white' : 'text-[var(--foreground)]'}>{feature.lovable}</span>
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
                      src={isDark ? '/assets/logos/brand-logos/compare-logos/lovable_logo_white.svg' : '/assets/logos/brand-logos/compare-logos/lovable_logo_black.svg'}
                      alt="Lovable Logo"
                      className="max-h-16 max-w-16 object-contain"
                    />
                    </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6">Lovable Advantages</h3>
              <ul className="space-y-3">
                {prosConsData.lovable.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--foreground)]">{pro}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-[var(--muted-foreground)] mb-3">Disadvantages:</p>
                <ul className="space-y-2">
                  {prosConsData.lovable.cons.map((con, idx) => (
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
                    <span className={`font-bold ${useCase.winner === 'Nati' ? 'text-[var(--primary)]' : 'text-purple-400'}`}>
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
            className="rounded-3xl border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">The Verdict</h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-8">
              Choose <span className="text-[var(--primary)] font-bold">Nati</span> if you want privacy, 
              better value, and native performance. Choose <span className="text-purple-400 font-bold">Lovable</span> if 
              you need browser-based access and don't mind cloud hosting.
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
