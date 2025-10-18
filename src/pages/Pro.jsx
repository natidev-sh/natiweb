import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, X, Zap, Crown, Rocket, Users, Code2, Database, 
  Globe, Shield, Sparkles, ArrowRight, Star, TrendingUp,
  Layers, GitBranch, Box, Infinity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta.jsx'
import FooterGlow from '../components/FooterGlow.jsx'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      { text: 'Unlimited local projects', included: true },
      { text: 'AI chat assistant', included: true },
      { text: 'Code generation', included: true },
      { text: 'Preview & debugging', included: true },
      { text: 'Community support', included: true },
      { text: 'Team collaboration', included: false },
      { text: 'Priority AI responses', included: false },
      { text: 'Advanced database tools', included: false },
      { text: 'Deploy to production', included: false },
      { text: 'Custom AI models', included: false },
    ],
    cta: 'Download Free',
    ctaLink: '/download',
    popular: false
  },
  {
    name: 'Pro',
    price: '$30',
    period: '/month',
    description: 'For serious developers',
    features: [
      { text: 'Everything in Free, plus:', included: true, bold: true },
      { text: 'Unlimited team members', included: true },
      { text: 'Priority AI responses (5x faster)', included: true },
      { text: 'Advanced database browser', included: true },
      { text: 'One-click deployments', included: true },
      { text: 'Custom AI model selection', included: true },
      { text: 'Advanced code analysis', included: true },
      { text: 'Real-time collaboration', included: true },
      { text: 'Priority support (24/7)', included: true },
      { text: 'Early access to features', included: true },
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/signup',
    popular: true,
    badge: '🔥 Most Popular'
  }
]

const proFeatures = [
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together in real-time. Share projects, code, and ideas with your team seamlessly.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Priority AI Processing',
    description: 'Get responses 5x faster with dedicated AI resources. No more waiting in queues.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Database,
    title: 'Advanced Database Tools',
    description: 'Visual SQL browser, query builder, and data management built right into your IDE.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Globe,
    title: 'Production Deployments',
    description: 'Deploy to Vercel, Netlify, or your own infrastructure with one click.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Code2,
    title: 'Custom AI Models',
    description: 'Choose from GPT-4, Claude, Gemini, and more. Pick the best model for each task.',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: 'Get help when you need it. Our team responds to Pro users within 1 hour, 24/7.',
    gradient: 'from-pink-500 to-rose-500'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Startup Founder',
    company: 'TechFlow',
    avatar: '👩‍💼',
    quote: 'Nati Pro cut our development time by 70%. We shipped our MVP in 2 weeks instead of 2 months.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Lead Developer',
    company: 'DevStudio',
    avatar: '👨‍💻',
    quote: 'The team collaboration features are incredible. Our entire team works in Nati now.',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Freelance Developer',
    company: 'Independent',
    avatar: '👩‍🎨',
    quote: 'Best $30/month I spend. Priority AI responses alone saved me hours every day.',
    rating: 5
  }
]

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '1M+', label: 'Projects Built' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' }
]

export default function Pro() {
  const [billingCycle, setBillingCycle] = useState('monthly')

  return (
    <>
      <PageMeta
        title="Nati Pro - Supercharge Your Development | 5x Faster AI, Teams, Deploy"
        description="Upgrade to Nati Pro for priority AI processing, team collaboration, advanced database tools, and one-click deployments. Transform how you build applications."
      />
      
      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl" />

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
              <Crown className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-sm font-bold text-[var(--primary)]">Upgrade to Pro</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-[var(--primary)] to-purple-500 bg-clip-text text-transparent">
                Build 5x Faster
              </span>
              <br />
              <span className="text-white">Ship More, Stress Less</span>
            </h1>

            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-12">
              Join thousands of developers who upgraded to Pro and never looked back. 
              Get priority AI, team collaboration, and production deployments for just $19/month.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[var(--primary)] to-purple-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)] font-semibold">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl border-2 ${
                  plan.popular 
                    ? 'border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/5 to-purple-500/5' 
                    : 'border-white/10 bg-white/5'
                } backdrop-blur-xl p-8 ${plan.popular ? 'md:scale-105' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-full text-white text-sm font-bold">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-[var(--muted-foreground)] mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-[var(--muted-foreground)]">{plan.period}</span>
                  </div>
                </div>

                <Link
                  to={plan.ctaLink}
                  className={`block w-full text-center py-4 rounded-xl font-bold mb-8 transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white shadow-lg shadow-[var(--primary)]/30 hover:shadow-xl hover:shadow-[var(--primary)]/50 hover:scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-green-500" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="h-3 w-3 text-white/30" />
                        </div>
                      )}
                      <span className={`${feature.included ? 'text-white' : 'text-white/40'} ${feature.bold ? 'font-bold' : ''}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Pro Features Grid */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Everything You Need to Build Faster
              </h2>
              <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
                Pro gives you the superpowers to ship production-ready apps at lightning speed
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proFeatures.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={idx}
                    className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-white/20 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Loved by Developers Worldwide
              </h2>
              <p className="text-xl text-[var(--muted-foreground)]">
                See what our Pro users are saying
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-white mb-4 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-sm text-[var(--muted-foreground)]">
                        {testimonial.role} · {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            className="relative rounded-3xl border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 backdrop-blur-xl p-12 text-center overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 to-purple-500/5" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to Build 5x Faster?
              </h2>
              <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto">
                Join thousands of developers shipping better products, faster. 
                Upgrade to Pro and transform your development workflow today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-[var(--primary)]/30 hover:shadow-xl hover:shadow-[var(--primary)]/50 transition-all hover:scale-105"
                >
                  <Crown className="h-5 w-5" />
                  Upgrade to Pro Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                >
                  Try Interactive Demo
                </Link>
              </div>
              <p className="mt-6 text-sm text-[var(--muted-foreground)]">
                💳 No credit card required to start · ⚡ Instant activation · 🔒 Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <FooterGlow />
    </>
  )
}
