import React, { useState } from 'react'
import PageMeta from '../components/PageMeta.jsx'
import { CheckCircle, Circle, Sparkles, Rocket, Target, Zap } from 'lucide-react'

export default function Roadmap() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const roadmapItems = [
    // ✅ Completed
    {
      title: 'Desktop App Authentication',
      description: 'Seamless login from desktop app with OAuth integration',
      status: 'completed',
      category: 'auth',
      date: 'October 2024',
    },
    {
      title: 'Pro & Admin Badges',
      description: 'Visual indicators for Pro subscribers and admin users',
      status: 'completed',
      category: 'ui',
      date: 'October 2024',
    },
    {
      title: 'Session Management',
      description: 'View and manage logged-in devices and sessions',
      status: 'completed',
      category: 'security',
      date: 'October 2024',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Track API usage, token consumption, and costs',
      status: 'completed',
      category: 'analytics',
      date: 'October 2024',
    },
    
    // 🚀 In Progress
    {
      title: 'Real-time Sync',
      description: 'Sync settings and projects between web and desktop app',
      status: 'in-progress',
      category: 'sync',
      date: 'Q4 2024',
    },
    {
      title: 'Remote Desktop Control',
      description: 'Start, stop, and manage desktop apps from the web',
      status: 'in-progress',
      category: 'control',
      date: 'Q4 2024',
    },
    {
      title: 'Login Notifications',
      description: 'Email alerts for new device logins and suspicious activity',
      status: 'in-progress',
      category: 'security',
      date: 'Q4 2024',
    },
    
    // 📋 Planned
    {
      title: 'Prompt Library',
      description: 'Save, organize, and share AI prompts across devices',
      status: 'planned',
      category: 'ai',
      date: 'Q1 2025',
    },
    {
      title: 'Model Playground',
      description: 'Test prompts across multiple AI models with comparison',
      status: 'planned',
      category: 'ai',
      date: 'Q1 2025',
    },
    {
      title: 'Cost Optimization AI',
      description: 'AI-powered suggestions to reduce API costs',
      status: 'planned',
      category: 'analytics',
      date: 'Q1 2025',
    },
    {
      title: 'Team Workspaces',
      description: 'Collaborate on AI apps with team members',
      status: 'planned',
      category: 'collaboration',
      date: 'Q1 2025',
    },
    {
      title: 'Mobile Companion App',
      description: 'Manage your AI apps on the go with iOS & Android apps',
      status: 'planned',
      category: 'mobile',
      date: 'Q2 2025',
    },
    {
      title: 'WebAuthn/Passkeys',
      description: 'Passwordless login with biometric authentication',
      status: 'planned',
      category: 'auth',
      date: 'Q1 2025',
    },
    {
      title: 'Batch Testing',
      description: 'Test prompts across multiple models simultaneously',
      status: 'planned',
      category: 'ai',
      date: 'Q1 2025',
    },
    {
      title: 'Revenue Analytics',
      description: 'Track monetization metrics for your AI apps',
      status: 'planned',
      category: 'analytics',
      date: 'Q2 2025',
    },
    {
      title: 'Integration Hub',
      description: 'Connect with GitHub, Vercel, Stripe, and more',
      status: 'planned',
      category: 'integrations',
      date: 'Q2 2025',
    },
  ]

  const categories = [
    { id: 'all', label: 'All Features', icon: Target },
    { id: 'auth', label: 'Authentication', icon: CheckCircle },
    { id: 'ai', label: 'AI Features', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: Zap },
    { id: 'security', label: 'Security', icon: CheckCircle },
  ]

  const filteredItems = selectedCategory === 'all' 
    ? roadmapItems 
    : roadmapItems.filter(item => item.category === selectedCategory)

  const completedCount = roadmapItems.filter(i => i.status === 'completed').length
  const inProgressCount = roadmapItems.filter(i => i.status === 'in-progress').length
  const plannedCount = roadmapItems.filter(i => i.status === 'planned').length

  return (
    <>
      <PageMeta
        title="Roadmap | Nati.dev"
        description="See what we're building for the future of AI app development"
      />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
            <Rocket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Product Roadmap</span>
          </div>
          <h1 className="text-4xl font-bold">What We're Building</h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Track our progress and see what's coming next for Nati.dev
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 rounded-lg border border-[var(--border)] bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-[var(--muted-foreground)]">Completed</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-lg border border-[var(--border)] bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-[var(--muted-foreground)]">In Progress</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-lg border border-[var(--border)] bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{plannedCount}</p>
                <p className="text-sm text-[var(--muted-foreground)]">Planned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                selectedCategory === category.id
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'border-[var(--border)] hover:bg-[var(--muted)]'
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Roadmap Items */}
        <div className="space-y-6">
          {/* Completed */}
          {filteredItems.some(i => i.status === 'completed') && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Completed
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredItems.filter(i => i.status === 'completed').map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-2">{item.description}</p>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In Progress */}
          {filteredItems.some(i => i.status === 'in-progress') && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-500" />
                In Progress
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredItems.filter(i => i.status === 'in-progress').map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 flex-shrink-0 mt-0.5">
                        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-2">{item.description}</p>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Planned */}
          {filteredItems.some(i => i.status === 'planned') && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Circle className="h-5 w-5 text-[var(--muted-foreground)]" />
                Planned
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredItems.filter(i => i.status === 'planned').map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Circle className="h-5 w-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-[var(--muted-foreground)] mb-2">{item.description}</p>
                        <span className="text-xs text-[var(--muted-foreground)] font-medium">{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-6 rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold">Have a Feature Request?</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              We'd love to hear your ideas! Join our community and help shape the future of Nati.dev
            </p>
            <div className="flex gap-3 justify-center">
              <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity">
                Request a Feature
              </button>
              <button className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
                Join Discord
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
