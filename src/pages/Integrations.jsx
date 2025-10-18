import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Check, ArrowRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta.jsx'
import FooterGlow from '../components/FooterGlow.jsx'
import { useTheme } from '../theme/ThemeProvider'

const getIntegrations = (isDark) => [
  {
    name: 'Supabase',
    category: 'Database',
    logo: '/assets/logos/brand-logos/supabase-logo-icon.png',
    gradient: 'from-green-500 to-emerald-600',
    description: 'Open source Firebase alternative with PostgreSQL',
    features: ['Real-time subscriptions', 'Authentication', 'Storage', 'Row Level Security'],
    setupTime: '2 minutes',
    difficulty: 'Easy',
    popular: true,
    connectUrl: '/dashboard',
  },
  {
    name: 'Vercel',
    category: 'Deployment',
    icon: '▲',
    gradient: 'from-black to-gray-800',
    description: 'Deploy your apps instantly to the edge',
    features: ['Automatic deployments', 'Edge functions', 'Analytics', 'Preview deployments'],
    setupTime: '1 minute',
    difficulty: 'Easy',
    popular: true,
    connectUrl: '/dashboard',
  },
  {
    name: 'GitHub',
    category: 'Version Control',
    logo: isDark ? '/assets/logos/brand-logos/GitHub_Invertocat_Light.svg' : '/assets/logos/brand-logos/GitHub_Invertocat_Dark.svg',
    gradient: 'from-gray-700 to-gray-900',
    description: 'Seamless Git integration and collaboration',
    features: ['Push/Pull', 'Branch management', 'Pull requests', 'Issue tracking'],
    setupTime: '30 seconds',
    difficulty: 'Easy',
    popular: true,
    connectUrl: '/dashboard',
  },
  {
    name: 'Netlify',
    category: 'Deployment',
    logo: '/assets/logos/brand-logos/netlify.svg',
    gradient: 'from-teal-500 to-cyan-600',
    description: 'Modern web hosting and serverless functions',
    features: ['Continuous deployment', 'Forms', 'Functions', 'Split testing'],
    setupTime: '2 minutes',
    difficulty: 'Easy',
    popular: false,
    connectUrl: '/dashboard',
  },
  {
    name: 'Stripe',
    category: 'Payments',
    logo: '/assets/logos/brand-logos/Stripe_Icon.jpeg',
    gradient: 'from-purple-500 to-indigo-600',
    description: 'Accept payments and manage subscriptions',
    features: ['One-time payments', 'Subscriptions', 'Invoicing', 'Webhooks'],
    setupTime: '5 minutes',
    difficulty: 'Medium',
    popular: true,
    connectUrl: '/dashboard',
  },
  {
    name: 'OpenAI',
    category: 'AI',
    logo: isDark ? '/assets/logos/brand-logos/openai_white.svg' : '/assets/logos/brand-logos/openai_dark.svg',
    gradient: 'from-green-400 to-blue-500',
    description: 'Integrate GPT and AI models into your apps',
    features: ['GPT-4', 'Embeddings', 'Fine-tuning', 'DALL-E'],
    setupTime: '3 minutes',
    difficulty: 'Medium',
    popular: true,
    connectUrl: '/dashboard',
  },
  {
    name: 'Clerk',
    category: 'Authentication',
    logo: '/assets/logos/brand-logos/clerk.jpeg',
    gradient: 'from-blue-500 to-purple-600',
    description: 'Complete user management and authentication',
    features: ['Social login', 'Multi-factor auth', 'User management', 'Sessions'],
    setupTime: '3 minutes',
    difficulty: 'Easy',
    popular: false,
    connectUrl: '/dashboard',
  },
  {
    name: 'Resend',
    category: 'Email',
    logo: isDark ? '/assets/logos/brand-logos/resend-icon-white.png' : '/assets/logos/brand-logos/resend-icon-black.png',
    gradient: 'from-pink-500 to-rose-600',
    description: 'Modern email API for developers',
    features: ['Transactional emails', 'Templates', 'Analytics', 'Webhooks'],
    setupTime: '2 minutes',
    difficulty: 'Easy',
    popular: false,
    connectUrl: '/dashboard',
  },
  {
    name: 'Cloudinary',
    category: 'Media',
    logo: '/assets/logos/brand-logos/cloudinary.png',
    gradient: 'from-blue-400 to-sky-600',
    description: 'Image and video management in the cloud',
    features: ['Upload', 'Transformations', 'Optimization', 'CDN'],
    setupTime: '3 minutes',
    difficulty: 'Easy',
    popular: false,
    connectUrl: '/dashboard',
  },
]

const categories = ['All', 'Database', 'Deployment', 'Version Control', 'Payments', 'AI', 'Authentication', 'Email', 'Media']

export default function Integrations() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const integrations = useMemo(() => getIntegrations(isDark), [isDark])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <PageMeta
        title="Integration Marketplace | Nati - Connect Your Favorite Tools"
        description="Connect Nati with Supabase, Vercel, GitHub, Stripe, and more. One-click integrations for database, deployment, payments, and AI services."
      />
      
      <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
        {/* Background */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? 'opacity-100' : 'opacity-30'}`} />
        <div className={`absolute top-0 left-0 w-[800px] h-[800px] ${isDark ? 'bg-[var(--primary)]/10' : 'bg-[var(--primary)]/5'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 right-0 w-[800px] h-[800px] ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl`} />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          {/* Hero */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--primary)]">Integration Marketplace</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--primary)] to-purple-500 bg-clip-text text-transparent">
                Connect Everything
              </span>
            </h1>

            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-12">
              Integrate with your favorite tools in minutes. One-click setup, no complex configuration.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]/60" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[var(--primary)] transition-colors ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/40'
                      : 'bg-white border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/70'
                  }`}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-[var(--primary)] text-white'
                      : isDark
                        ? 'bg-white/5 text-white/60 hover:bg-white/10'
                        : 'bg-white text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-[var(--muted)]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Integrations Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filteredIntegrations.map((integration, idx) => (
              <motion.div
                key={integration.name}
                className={`group relative p-6 rounded-2xl transition-all hover:scale-105 ${
                  isDark
                    ? 'border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[var(--primary)]/50'
                    : 'border border-[var(--border)] bg-white hover:border-[var(--primary)]/50 shadow-sm'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                {integration.popular && (
                  <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    isDark ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                  }`}>
                    ⭐ Popular
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br ${integration.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${integration.gradient} flex items-center justify-center shadow-lg overflow-hidden`}>
                      {integration.logo ? (
                        <img src={integration.logo} alt={`${integration.name} logo`} className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="text-3xl font-bold text-white">{integration.icon}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[var(--primary)] mb-1">{integration.category}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{integration.setupTime}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{integration.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">{integration.description}</p>

                  <div className="space-y-2 mb-4">
                    {integration.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      integration.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      integration.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {integration.difficulty}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]/60">•</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{integration.setupTime} setup</div>
                  </div>

                  <Link
                    to={integration.connectUrl}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
                  >
                    <Zap className="h-4 w-4" />
                    Connect Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-[var(--muted-foreground)]">No integrations found matching your search.</p>
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            className="mt-20 text-center rounded-3xl border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              Need a Custom Integration?
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto">
              We're always adding new integrations. Request one or build your own with our API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
              >
                Request Integration
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/docs"
                className={`inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all ${
                  isDark
                    ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    : 'bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                }`}
              >
                View API Docs
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      <FooterGlow />
    </>
  )
}
