import React from 'react';
import { 
  Database, Play, GitBranch, History, Save, Download, 
  Settings, Zap, Shield, Users, BarChart3, Sparkles,
  Code2, Lock, RefreshCw, Search, FileText, Globe
} from 'lucide-react';

export default function NatiDB() {
  const features = [
    {
      icon: <Play className="h-6 w-6" />,
      title: "Split-Panel Query Runner",
      description: "Write SQL on the left, see results instantly on the right. Just like Supabase Studio, but better.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered SQL Assistant",
      description: "Describe what you want in plain English, get perfect SQL. Debug errors automatically.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "Database Branching",
      description: "Test schema changes safely with branches. Merge when ready. Never break production again.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Smart Query History",
      description: "Every query saved with success/fail status, row counts, and execution time. Never lose your work.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "15+ SQL Templates",
      description: "Pre-built templates for common operations. Joins, indexes, RLS policies, triggers, and more.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Visual Table Creator",
      description: "Design tables with a GUI. Add columns, set types, configure constraints. SQL generated automatically.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Data Visualization",
      description: "Turn query results into charts instantly. Bar, line, pie charts with zero configuration.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Performance Monitor",
      description: "Track query execution times, identify slow queries, optimize your database performance.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "RLS Policy Manager",
      description: "Visual RLS policy editor. See all policies, test them, create new ones with templates.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Share queries with your team. Comment, version, and collaborate on database work.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Schema Diff & Sync",
      description: "Compare schemas across environments. Generate migration scripts automatically.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Export Anywhere",
      description: "Export to CSV, JSON, SQL, Excel. One click. Any format. Any size.",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  const stats = [
    { value: "10x", label: "Faster Development" },
    { value: "100%", label: "Visual Interface" },
    { value: "15+", label: "SQL Templates" },
    { value: "∞", label: "Query History" }
  ];

  const testimonials = [
    {
      quote: "NatiDB replaced 3 different tools for us. It's the only database IDE we need.",
      author: "Sarah Chen",
      role: "CTO at TechCorp",
      avatar: "SC"
    },
    {
      quote: "The AI SQL assistant is like having a senior DBA on your team 24/7.",
      author: "Marcus Johnson",
      role: "Lead Developer",
      avatar: "MJ"
    },
    {
      quote: "Database branching saved us from a production disaster. Worth every penny.",
      author: "Emily Rodriguez",
      role: "DevOps Engineer",
      avatar: "ER"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Unlimited queries",
        "Query history (50 queries)",
        "5 saved queries",
        "Basic templates",
        "CSV export",
        "Community support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      features: [
        "Everything in Free",
        "Unlimited query history",
        "Unlimited saved queries",
        "All 15+ templates",
        "AI SQL Assistant",
        "Database branching",
        "Data visualization",
        "Performance monitoring",
        "Priority support"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Team",
      price: "$49",
      period: "per month",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared queries",
        "Schema diff & sync",
        "Advanced security",
        "SSO integration",
        "Audit logs",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Logo & Nav */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Database className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">NatiDB</h1>
                <p className="text-sm text-gray-400">by Nati.dev</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Get Started
              </button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-200">Now with AI-Powered SQL Assistant</span>
            </div>
            
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
              The Database IDE
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Developers Love
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Visual query builder, AI assistant, database branching, and team collaboration. 
              Everything you need to work with Supabase databases, in one beautiful interface.
            </p>

            <div className="flex items-center justify-center gap-4 mb-16">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Everything You Need</h3>
          <p className="text-xl text-gray-400">Powerful features that make database work a joy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:transform hover:scale-105"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white/5 backdrop-blur-sm border-y border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Loved by Developers</h3>
            <p className="text-xl text-gray-400">Join thousands of teams using NatiDB</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h3>
          <p className="text-xl text-gray-400">Start free, upgrade when you're ready</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <div 
              key={idx}
              className={`relative p-8 rounded-2xl ${
                plan.popular 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-2 border-purple-500' 
                  : 'bg-white/5 border border-white/10'
              } backdrop-blur-sm`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                plan.popular
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Database Workflow?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who ship faster with NatiDB
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="text-white font-semibold mb-4">Product</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex items-center justify-between">
            <p className="text-gray-400 text-sm">© 2025 NatiDB. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400 text-sm">Built with ❤️ by Nati.dev</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
