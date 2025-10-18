import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ArrowRight, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'

const getIntegrations = (isDark) => [
  { name: 'Supabase', logo: '/assets/logos/brand-logos/supabase-logo-icon.png', color: 'from-green-500 to-emerald-600' },
  { 
    name: 'GitHub', 
    logo: isDark ? '/assets/logos/brand-logos/GitHub_Invertocat_Light.svg' : '/assets/logos/brand-logos/GitHub_Invertocat_Dark.svg',
    color: 'from-gray-700 to-gray-900' 
  },
  { name: 'Stripe', logo: '/assets/logos/brand-logos/Stripe_Icon.jpeg', color: 'from-purple-500 to-indigo-600' },
  { 
    name: 'OpenAI', 
    logo: isDark ? '/assets/logos/brand-logos/openai_white.svg' : '/assets/logos/brand-logos/openai_dark.svg',
    color: 'from-green-400 to-blue-500' 
  },
  { name: 'Clerk', logo: '/assets/logos/brand-logos/clerk.jpeg', color: 'from-blue-500 to-purple-600' },
  { 
    name: 'Resend', 
    logo: isDark ? '/assets/logos/brand-logos/resend-icon-white.png' : '/assets/logos/brand-logos/resend-icon-black.png',
    color: 'from-pink-500 to-rose-600' 
  },
  { name: 'Netlify', logo: '/assets/logos/brand-logos/netlify.svg', color: 'from-teal-500 to-cyan-600' },
  { name: 'Vercel', icon: '▲', color: 'from-black to-gray-800' },
]

const features = [
  'One-click authentication',
  'Instant database setup',
  'Deploy in seconds',
  'Automated backups',
  'Real-time sync',
  'AI-powered tools'
]

export default function IntegrationsShowcase() {
  const { theme } = useTheme()
  const [activeIntegration, setActiveIntegration] = useState(0)
  const [hoveredIntegration, setHoveredIntegration] = useState(null)
  const [connectingLines, setConnectingLines] = useState([])
  
  const isDark = theme === 'dark'
  const integrations = getIntegrations(isDark)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIntegration((prev) => (prev + 1) % integrations.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [integrations.length])

  useEffect(() => {
    // Create random connecting lines effect
    const interval = setInterval(() => {
      const randomLines = []
      for (let i = 0; i < 3; i++) {
        randomLines.push({
          from: Math.floor(Math.random() * integrations.length),
          to: Math.floor(Math.random() * integrations.length)
        })
      }
      setConnectingLines(randomLines)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-32 overflow-hidden bg-[var(--background)]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/5 to-transparent" />
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] ${isDark ? 'opacity-100' : 'opacity-30'}`} />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--primary)]">Powerful Integrations</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-purple-500 bg-clip-text text-transparent">
                Connect Everything
              </span>
              <br />
              <span className="text-[var(--foreground)]">Build Anything</span>
            </h2>

            <p className="text-xl text-[var(--muted-foreground)] mb-8">
              Nati integrates with all your favorite tools. Database, deployment, payments, 
              authentication—all configured in seconds, not hours.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-[var(--foreground)] font-semibold">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl font-black bg-gradient-to-r from-[var(--primary)] to-purple-500 bg-clip-text text-transparent mb-1">
                  8+
                </div>
                <div className="text-sm text-[var(--muted-foreground)] font-semibold">
                  Integrations
                </div>
              </div>
              <div>
                <div className="text-3xl font-black bg-gradient-to-r from-[var(--primary)] to-purple-500 bg-clip-text text-transparent mb-1">
                  1-Click
                </div>
                <div className="text-sm text-[var(--muted-foreground)] font-semibold">
                  Setup
                </div>
              </div>
              <div>
                <div className="text-3xl font-black bg-gradient-to-r from-[var(--primary)] to-purple-500 bg-clip-text text-transparent mb-1">
                  &lt;2 min
                </div>
                <div className="text-sm text-[var(--muted-foreground)] font-semibold">
                  To Deploy
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/integrations"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                <Zap className="h-5 w-5" />
                View All Integrations
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/demo"
                className={`inline-flex items-center gap-2 px-8 py-4 border-2 font-bold rounded-xl transition-all ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                    : 'bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
                }`}
              >
                Try Demo
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Interactive Visualization */}
          <motion.div
            className="relative w-full h-[500px]"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Center Circle - Nati Logo */}
            <div className="absolute" style={{ top: '56%', left: '58%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
              <motion.div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-white-900 flex items-center justify-center shadow-2xl p-3"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 20px 60px rgba(99,102,241,0.3)',
                    '0 20px 80px rgba(99,102,241,0.6)',
                    '0 20px 60px rgba(99,102,241,0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <img 
                  src="/assets/logos/brand-logos/nati-logo.png" 
                  alt="Nati" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>

            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(99,102,241,0.3)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(139,92,246,0.3)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              {integrations.map((_, idx) => {
                const angle = (idx / integrations.length) * 2 * Math.PI - Math.PI / 2
                const radiusPercent = 38
                const x2 = 50 + radiusPercent * Math.cos(angle)
                const y2 = 50 + radiusPercent * Math.sin(angle)
                return (
                  <motion.line
                    key={idx}
                    x1="50%"
                    y1="50%"
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: activeIntegration === idx ? 1 : 0.3,
                      opacity: activeIntegration === idx ? 1 : 0.3
                    }}
                    transition={{ duration: 0.5 }}
                  />
                )
              })}
            </svg>

            {/* Integration Bubbles */}
            {integrations.map((integration, idx) => {
              const angle = (idx / integrations.length) * 2 * Math.PI - Math.PI / 2
              const radiusPercent = 38 // percentage from center
              const centerX = 50 // center of container in percentage
              const centerY = 50 // center of container in percentage
              const x = centerX + radiusPercent * Math.cos(angle)
              const y = centerY + radiusPercent * Math.sin(angle)

              return (
                <motion.div
                  key={integration.name}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 15
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setHoveredIntegration(idx)}
                  onMouseLeave={() => setHoveredIntegration(null)}
                >
                  <motion.div
                    className={`relative w-20 h-20 rounded-2xl backdrop-blur-sm border flex items-center justify-center cursor-pointer shadow-lg overflow-hidden ${
                      isDark 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-white border-gray-200'
                    }`}
                    animate={{
                      scale: activeIntegration === idx || hoveredIntegration === idx ? 1.2 : 1,
                      y: activeIntegration === idx ? [-5, 5, -5] : 0,
                    }}
                    transition={{
                      scale: { duration: 0.3 },
                      y: { duration: 2, repeat: activeIntegration === idx ? Infinity : 0 }
                    }}
                  >
                    {integration.logo ? (
                      <img src={integration.logo} alt={integration.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="text-3xl">{integration.icon}</span>
                    )}
                    
                    {/* Pulse Ring */}
                    {activeIntegration === idx && (
                      <motion.div
                        className={`absolute inset-0 rounded-xl border-2 ${isDark ? 'border-white' : 'border-[var(--primary)]'}`}
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <AnimatePresence>
                    {(hoveredIntegration === idx || activeIntegration === idx) && (
                      <motion.div
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className={`px-3 py-1 backdrop-blur-sm rounded-lg border text-xs font-bold ${
                          isDark 
                            ? 'bg-black/80 border-white/20 text-white' 
                            : 'bg-white/90 border-gray-200 text-gray-900'
                        }`}>
                          {integration.name}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* Particles/Stars Effect */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-white' : 'bg-[var(--primary)]'}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
