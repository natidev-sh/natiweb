import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Sparkles, Code2, Database, Globe, Settings, Zap, Brain, 
  Rocket, ArrowRight, Download, Github, Eye, CheckCircle, Terminal,
  Server, Package, Play, X, Maximize2
} from 'lucide-react'
import { Link } from 'react-router-dom'

const projectTemplates = [
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    emoji: '📊',
    description: 'Real-time metrics & beautiful charts',
    prompt: 'Create a modern analytics dashboard with real-time charts and metrics',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/30 hover:border-blue-500/60'
  },
  {
    id: 'saas',
    title: 'SaaS Landing',
    emoji: '🚀',
    description: 'Marketing site with pricing',
    prompt: 'Build a stunning SaaS landing page with pricing and features',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/30 hover:border-purple-500/60'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    emoji: '🛍️',
    description: 'Product catalog & checkout',
    prompt: 'Create an e-commerce store with products and cart',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/30 hover:border-green-500/60'
  },
  {
    id: 'social',
    title: 'Social Feed',
    emoji: '💬',
    description: 'Posts, likes & comments',
    prompt: 'Build a social media feed with posts and interactions',
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
    border: 'border-orange-500/30 hover:border-orange-500/60'
  }
]

const demoSteps = [
  { id: 'select', title: 'Choose Template', icon: Rocket },
  { id: 'chat', title: 'Chat with AI', icon: Brain },
  { id: 'thinking', title: 'AI Planning', icon: Sparkles },
  { id: 'building', title: 'Generating Code', icon: Code2 },
  { id: 'preview', title: 'Live Preview', icon: Eye },
  { id: 'features', title: 'Deploy & More', icon: Globe }
]

export default function NatiDemoExperience() {
  const [currentStep, setCurrentStep] = useState('select')
  const [selectedProject, setSelectedProject] = useState(null)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [code, setCode] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [progress, setProgress] = useState(0)

  const startDemo = (project) => {
    setSelectedProject(project)
    setCurrentStep('chat')
    setMessages([
      { role: 'user', content: project.prompt }
    ])
    
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Perfect! I'll create a beautiful ${project.title.toLowerCase()} for you. Let me analyze the requirements and start building...`
        }])
        setTimeout(() => startThinking(), 1500)
      }, 2000)
    }, 500)
  }

  const startThinking = () => {
    setCurrentStep('thinking')
    setTimeout(() => startBuilding(), 2500)
  }

  const startBuilding = () => {
    setCurrentStep('building')
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => showLivePreview(), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)
    
    animateCode()
  }

  const animateCode = () => {
    const fullCode = `import { Card, Chart } from '@/components/ui'
import { useState } from 'react'

export default function App() {
  const [data, setData] = useState([...])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        ${selectedProject?.title || 'Dashboard'}
      </h1>
      <div className="grid gap-6">
        {/* Your beautiful app here */}
      </div>
    </div>
  )
}`
    
    let index = 0
    const interval = setInterval(() => {
      if (index < fullCode.length) {
        setCode(fullCode.slice(0, index))
        index += 3
      } else {
        clearInterval(interval)
      }
    }, 20)
  }

  const showLivePreview = () => {
    setCurrentStep('preview')
    setShowPreview(true)
    setTimeout(() => setCurrentStep('features'), 2000)
  }

  const reset = () => {
    setCurrentStep('select')
    setSelectedProject(null)
    setMessages([])
    setCode('')
    setShowPreview(false)
    setProgress(0)
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-[1800px] mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Terminal className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-sm font-bold text-[var(--primary)]">Interactive Live Demo</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-[var(--primary)] to-white bg-clip-text text-transparent">
              Build Apps in Seconds
            </span>
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-8">
            Experience the full power of Nati AI. Watch as a complete application is built from a single conversation.
          </p>

          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-2 flex-wrap max-w-4xl mx-auto mb-8">
            {demoSteps.map((step, idx) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isComplete = demoSteps.findIndex(s => s.id === currentStep) > idx
              
              return (
                <React.Fragment key={step.id}>
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]' 
                        : isComplete
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isComplete ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    <span className="text-sm font-semibold hidden sm:block">{step.title}</span>
                  </motion.div>
                  {idx < demoSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-white/20 hidden md:block" />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {currentStep !== 'select' && (
            <motion.button
              onClick={reset}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Start Over
            </motion.button>
          )}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'select' && (
            <ProjectSelection 
              key="select"
              templates={projectTemplates}
              onSelect={startDemo}
            />
          )}

          {currentStep === 'chat' && (
            <ChatInterface
              key="chat"
              messages={messages}
              isTyping={isTyping}
              project={selectedProject}
            />
          )}

          {currentStep === 'thinking' && (
            <ThinkingState key="thinking" project={selectedProject} />
          )}

          {currentStep === 'building' && (
            <BuildingState 
              key="building"
              code={code}
              progress={progress}
            />
          )}

          {(currentStep === 'preview' || currentStep === 'features') && (
            <PreviewAndFeatures
              key="preview"
              project={selectedProject}
              showFeatures={currentStep === 'features'}
            />
          )}
        </AnimatePresence>

        {/* CTA Footer */}
        {currentStep === 'features' && (
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Build Your Own?</h3>
            <p className="text-xl text-[var(--muted-foreground)] mb-8">
              Download Nati for free and start building production-ready apps in minutes.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all"
              >
                <Download className="h-5 w-5" />
                Download Nati Free
              </Link>
              <a
                href="https://github.com/natidev-sh/nati"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Project Selection Component
function ProjectSelection({ templates, onSelect }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {templates.map((project, idx) => (
        <motion.button
          key={project.id}
          onClick={() => onSelect(project)}
          className={`group relative p-6 rounded-2xl border-2 ${project.border} ${project.gradient} backdrop-blur-sm transition-all hover:scale-105 text-left`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-5xl mb-4">{project.emoji}</div>
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-sm text-white/60 mb-4">{project.description}</p>
          <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>
            Start Building <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}

// Chat Interface Component
function ChatInterface({ messages, isTyping, project }) {
  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="rounded-2xl border border-[var(--primary)]/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-[0_20px_100px_rgba(99,102,241,0.3)]">
        <div className="border-b border-white/10 px-6 py-4 bg-[var(--primary)]/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center">
              ✨
            </div>
            <div>
              <h3 className="font-bold text-white">Nati AI Assistant</h3>
              <p className="text-sm text-white/60">Building your {project?.title}</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4 min-h-[400px]">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-white/10' 
                  : 'bg-gradient-to-br from-[var(--primary)] to-purple-600'
              }`}>
                {msg.role === 'user' ? '👤' : '✨'}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[var(--primary)]/20 border border-[var(--primary)]/30'
                  : 'bg-white/5 border border-white/10'
              }`}>
                <p className="text-sm leading-relaxed text-white">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center">
                ✨
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-2">
                  <motion.div className="w-2 h-2 rounded-full bg-[var(--primary)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-[var(--primary)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-[var(--primary)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Thinking State Component
function ThinkingState({ project }) {
  const thoughts = [
    'Analyzing requirements...',
    'Planning component structure...',
    'Selecting optimal tech stack...',
    'Preparing build configuration...'
  ]

  return (
    <motion.div
      className="max-w-2xl mx-auto text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <Brain className="h-12 w-12 text-white" />
      </motion.div>
      <h3 className="text-3xl font-bold mb-4">AI is Thinking...</h3>
      <div className="space-y-3">
        {thoughts.map((thought, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.3 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: idx * 0.3 }}
            >
              <Sparkles className="h-5 w-5 text-[var(--primary)]" />
            </motion.div>
            <span className="text-white/80">{thought}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Building State Component
function BuildingState({ code, progress }) {
  return (
    <motion.div
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="rounded-2xl overflow-hidden border border-[var(--primary)]/20 bg-[#0c0a1f] shadow-[0_20px_100px_rgba(99,102,241,0.3)]">
          <div className="flex items-center justify-between px-5 py-4 bg-[var(--primary)]/5 border-b border-[var(--primary)]/10">
            <div className="flex items-center gap-3">
              <Code2 className="h-5 w-5 text-[var(--primary)]" />
              <span className="font-semibold">App.jsx</span>
            </div>
            <motion.div 
              className="flex items-center gap-2 text-[var(--primary)] text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4" />
              Writing code...
            </motion.div>
          </div>
          <div className="p-6 font-mono text-sm h-[500px] overflow-auto">
            <pre className="text-[var(--primary)] leading-relaxed">
              <code>{code}<motion.span className="inline-block w-2 h-5 bg-[var(--primary)] ml-1" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} /></code>
            </pre>
          </div>
        </div>

        {/* Progress Panel */}
        <div className="rounded-2xl border border-[var(--primary)]/20 bg-black/40 backdrop-blur-xl p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-6">Building Your App</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Overall Progress</span>
                <span className="text-sm text-[var(--primary)]">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <TaskItem 
                icon={Package} 
                text="Installing dependencies" 
                complete={progress > 25}
              />
              <TaskItem 
                icon={Code2} 
                text="Generating components" 
                complete={progress > 50}
              />
              <TaskItem 
                icon={Settings} 
                text="Configuring build" 
                complete={progress > 75}
              />
              <TaskItem 
                icon={Rocket} 
                text="Starting dev server" 
                complete={progress >= 100}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TaskItem({ icon: Icon, text, complete }) {
  return (
    <motion.div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        complete 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-white/5 border-white/10'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {complete ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Icon className="h-5 w-5 text-[var(--primary)]" />
        </motion.div>
      )}
      <span className={complete ? 'text-green-400' : 'text-white/60'}>{text}</span>
    </motion.div>
  )
}

// Preview and Features Component
// Preview HTML getter function
function getPreviewHTML(projectId) {
  const previews = {
    dashboard: `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
@keyframes slideUp{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.8}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#000;color:#fff;min-height:100vh}
.container{min-height:100vh;padding:clamp(20px,5vw,60px);background:radial-gradient(circle at 30% 20%,rgba(99,102,241,0.08) 0%,transparent 50%),radial-gradient(circle at 70% 80%,rgba(99,102,241,0.08) 0%,transparent 50%),#000;position:relative}
.grid-bg{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(99,102,241,0.03) 1px,transparent 1px);background-size:24px 24px;pointer-events:none}
header{margin-bottom:clamp(24px,4vw,48px);animation:slideUp 0.6s ease-out}
h1{font-size:clamp(28px,5vw,56px);font-weight:800;background:linear-gradient(135deg,#fff 0%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
.subtitle{color:#94a3b8;font-size:clamp(14px,2vw,18px)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:clamp(16px,2vw,24px);margin-bottom:clamp(24px,3vw,40px)}
.card{background:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.1);border-radius:16px;padding:clamp(20px,3vw,32px);position:relative;overflow:hidden;animation:slideUp 0.8s ease-out;transition:0.3s}
.card:hover{transform:translateY(-4px);border-color:rgba(99,102,241,0.3);box-shadow:0 20px 60px rgba(99,102,241,0.15)}
.label{color:#64748b;font-size:clamp(11px,1.5vw,13px);font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
.value{font-size:clamp(32px,5vw,48px);font-weight:900;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
.change{color:#10b981;font-size:clamp(13px,1.8vw,16px);font-weight:700;display:flex;align-items:center;gap:6px}
.chart-container{background:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.1);border-radius:16px;padding:clamp(20px,3vw,32px)}
.chart-title{font-size:clamp(18px,2.5vw,24px);font-weight:700;margin-bottom:clamp(16px,2vw,24px);display:flex;align-items:center;gap:8px}
.dot{width:8px;height:8px;border-radius:50%;background:#6366f1;animation:pulse 2s ease-in-out infinite}
@media(max-width:640px){.stats{grid-template-columns:1fr}}
</style></head><body>
<div class="grid-bg"></div>
<div class="container">
<header>
  <h1>Revenue Dashboard</h1>
  <p class="subtitle">Real-time business metrics and analytics</p>
</header>
<div class="stats">
  <div class="card">
    <div class="label">Total Revenue</div>
    <div class="value">$2.4M</div>
    <div class="change"><span class="dot"></span>+32.4%</div>
  </div>
  <div class="card" style="animation-delay:0.1s">
    <div class="label">Active Users</div>
    <div class="value">124K</div>
    <div class="change"><span class="dot"></span>+18.2%</div>
  </div>
  <div class="card" style="animation-delay:0.2s">
    <div class="label">Conversion</div>
    <div class="value">12.4%</div>
    <div class="change"><span class="dot"></span>+5.1%</div>
  </div>
  <div class="card" style="animation-delay:0.3s">
    <div class="label">Growth Rate</div>
    <div class="value">+58%</div>
    <div class="change"><span class="dot"></span>Trending</div>
  </div>
</div>
<div class="chart-container">
  <div class="chart-title"><span class="dot"></span>Revenue Trend</div>
  <svg width="100%" height="clamp(180px,30vw,280px)" viewBox="0 0 800 200" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.4"/>
        <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0"/>
      </linearGradient>
    </defs>
    <path d="M0,180 L100,160 L200,140 L300,110 L400,90 L500,70 L600,50 L700,40 L800,30" stroke="#6366f1" stroke-width="3" fill="none"/>
    <path d="M0,180 L100,160 L200,140 L300,110 L400,90 L500,70 L600,50 L700,40 L800,30 L800,200 L0,200 Z" fill="url(#g1)"/>
    <circle cx="800" cy="30" r="6" fill="#6366f1"><animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/></circle>
  </svg>
</div>
</div>
</body></html>`,
    saas: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>@keyframes fadeIn{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}@keyframes glow{0%,100%{box-shadow:0 0 30px rgba(99,102,241,0.5)}50%{box-shadow:0 0 60px rgba(99,102,241,0.8)}}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#000;color:#fff;overflow-x:hidden}.container{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:clamp(40px,8vw,80px) clamp(20px,4vw,40px);position:relative;background:radial-gradient(circle at 30% 20%,rgba(99,102,241,0.15) 0%,transparent 50%),radial-gradient(circle at 70% 80%,rgba(99,102,241,0.15) 0%,transparent 50%),#000}.grid-overlay{position:absolute;inset:0;background-image:radial-gradient(circle at 2px 2px,rgba(255,255,255,0.03) 1px,transparent 0);background-size:40px 40px;opacity:0.5;pointer-events:none}.orb{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none}.orb1{width:clamp(300px,40vw,500px);height:clamp(300px,40vw,500px);top:10%;left:10%;background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%);animation:float 10s ease-in-out infinite}.orb2{width:clamp(350px,45vw,600px);height:clamp(350px,45vw,600px);bottom:10%;right:10%;background:radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 70%);animation:float 12s ease-in-out infinite;animation-delay:-4s}.content{max-width:1200px;text-align:center;position:relative;z-index:10}.badge{display:inline-flex;align-items:center;gap:10px;padding:clamp(8px,1.5vw,12px) clamp(16px,3vw,24px);border-radius:100px;background:rgba(255,255,255,0.05);border:1px solid rgba(99,102,241,0.2);margin-bottom:clamp(24px,4vw,40px);animation:fadeIn 0.8s ease-out;font-size:clamp(12px,2vw,14px);font-weight:700}h1{font-size:clamp(40px,8vw,84px);font-weight:900;margin-bottom:clamp(20px,3vw,32px);line-height:1.1;animation:fadeIn 0.8s ease-out 0.2s backwards}.gradient-text{background:linear-gradient(135deg,#fff 0%,#a78bfa 50%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.subtitle{color:#94a3b8;font-size:clamp(16px,3vw,24px);margin-bottom:clamp(32px,5vw,48px);max-width:800px;margin-left:auto;margin-right:auto;line-height:1.6;animation:fadeIn 0.8s ease-out 0.4s backwards}.cta-group{display:flex;gap:clamp(12px,2vw,20px);justify-center;margin-bottom:clamp(40px,6vw,64px);flex-wrap:wrap;animation:fadeIn 0.8s ease-out 0.6s backwards}.btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:clamp(16px,3vw,20px) clamp(32px,5vw,48px);border-radius:16px;font-weight:800;font-size:clamp(16px,2vw,18px);border:none;animation:glow 3s ease-in-out infinite;text-decoration:none;display:inline-block}.btn-secondary{background:rgba(255,255,255,0.05);color:#fff;padding:clamp(16px,3vw,20px) clamp(32px,5vw,48px);border-radius:16px;font-weight:800;font-size:clamp(16px,2vw,18px);border:2px solid rgba(99,102,241,0.3);text-decoration:none;display:inline-block}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:clamp(24px,4vw,48px);max-width:900px;margin:0 auto;animation:fadeIn 0.8s ease-out 0.8s backwards}.stat-value{font-size:clamp(36px,7vw,56px);font-weight:900;margin-bottom:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.stat-label{color:#64748b;font-size:clamp(13px,2vw,16px);font-weight:700;text-transform:uppercase;letter-spacing:1px}</style></head><body><div class="container"><div class="grid-overlay"></div><div class="orb orb1"></div><div class="orb orb2"></div><div class="content"><div class="badge"><span>⭐</span><span>Trusted by 50,000+ developers</span></div><h1>Build The Future<br/><span class="gradient-text">With AI</span></h1><p class="subtitle">Ship production-ready applications 10x faster with AI-powered development</p><div class="cta-group"><a href="#" class="btn-primary">Start Building Free →</a><a href="#" class="btn-secondary">Watch Demo</a></div><div class="stats"><div><div class="stat-value">10x</div><div class="stat-label">Faster Dev</div></div><div><div class="stat-value">99.9%</div><div class="stat-label">Uptime</div></div><div><div class="stat-value">24/7</div><div class="stat-label">Support</div></div></div></div></div></body></html>`,
    ecommerce: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>@keyframes fadeIn{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#000;color:#fff;padding:clamp(20px,5vw,60px)}h1{font-size:clamp(28px,5vw,48px);font-weight:900;background:linear-gradient(135deg,#10b981,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:clamp(24px,4vw,40px)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:clamp(16px,3vw,24px)}.product{background:rgba(15,23,42,0.6);border:1px solid rgba(16,185,129,0.2);border-radius:16px;padding:20px;animation:fadeIn 0.6s ease-out;transition:0.3s}.product:hover{transform:translateY(-4px);border-color:rgba(16,185,129,0.5)}.img{width:100%;height:200px;background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.2));border-radius:12px;margin-bottom:16px}.title{font-size:18px;font-weight:700;margin-bottom:8px}.price{font-size:24px;font-weight:900;background:linear-gradient(135deg,#10b981,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}.btn{background:linear-gradient(135deg,#10b981,#3b82f6);color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:700;cursor:pointer;width:100%}</style></head><body><h1>🛍️ Product Store</h1><div class="grid"><div class="product"><div class="img"></div><div class="title">Premium Headphones</div><div class="price">$199</div><button class="btn">Add to Cart</button></div><div class="product" style="animation-delay:0.1s"><div class="img"></div><div class="title">Smart Watch</div><div class="price">$299</div><button class="btn">Add to Cart</button></div><div class="product" style="animation-delay:0.2s"><div class="img"></div><div class="title">Wireless Keyboard</div><div class="price">$149</div><button class="btn">Add to Cart</button></div><div class="product" style="animation-delay:0.3s"><div class="img"></div><div class="title">USB-C Hub</div><div class="price">$79</div><button class="btn">Add to Cart</button></div></div></body></html>`,
    social: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>@keyframes fadeIn{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#000;color:#fff;padding:clamp(20px,5vw,60px)}.header{display:flex;align-items:center;gap:12px;margin-bottom:clamp(24px,4vw,40px)}.avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ec4899)}h1{font-size:clamp(24px,4vw,36px);font-weight:900}.feed{max-width:600px;margin:0 auto;space-y:24px}.post{background:rgba(15,23,42,0.6);border:1px solid rgba(249,115,22,0.2);border-radius:16px;padding:20px;margin-bottom:24px;animation:fadeIn 0.6s ease-out}.post-header{display:flex;align-items:center;gap:12px;margin-bottom:16px}.post-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ec4899)}.post-name{font-weight:700}.post-time{color:#64748b;font-size:14px}.post-content{margin-bottom:16px;line-height:1.6}.post-actions{display:flex;gap:20px}.action{color:#64748b;font-size:14px;font-weight:600;cursor:pointer}.action:hover{color:#f97316}</style></head><body><div class="header"><div class="avatar"></div><h1>Social Feed</h1></div><div class="feed"><div class="post"><div class="post-header"><div class="post-avatar"></div><div><div class="post-name">Sarah Johnson</div><div class="post-time">2h ago</div></div></div><div class="post-content">Just launched my new project built with Nati AI! The development speed is incredible 🚀</div><div class="post-actions"><div class="action">❤️ 24 Likes</div><div class="action">💬 8 Comments</div><div class="action">🔄 Share</div></div></div><div class="post" style="animation-delay:0.1s"><div class="post-header"><div class="post-avatar"></div><div><div class="post-name">Mike Chen</div><div class="post-time">4h ago</div></div></div><div class="post-content">Built a full dashboard in 10 minutes. This AI-powered IDE is a game changer! 💡</div><div class="post-actions"><div class="action">❤️ 42 Likes</div><div class="action">💬 15 Comments</div><div class="action">🔄 Share</div></div></div></div></body></html>`
  }
  return previews[projectId] || previews.dashboard
}

function PreviewAndFeatures({ project, showFeatures }) {
  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Live Preview */}
      <div className="rounded-2xl overflow-hidden border border-[var(--primary)]/20 bg-white shadow-[0_20px_100px_rgba(99,102,241,0.3)] mb-8">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-[var(--primary)]" />
            <span className="font-mono font-semibold text-sm">localhost:3000</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-bold text-green-600">Live</span>
          </div>
        </div>
        <div className="h-[600px] bg-white overflow-hidden">
          <iframe
            srcDoc={getPreviewHTML(project?.id)}
            className="w-full h-full border-0"
            title="preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>

      {/* Features Panel */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FeatureCard
              icon={Database}
              title="Database Browser"
              description="Visual SQL database management built-in"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={Globe}
              title="One-Click Deploy"
              description="Deploy to production in seconds"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={Server}
              title="Connect Supabase"
              description="Instant backend integration"
              gradient="from-green-500 to-emerald-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, description, gradient }) {
  return (
    <motion.div
      className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-white/20 transition-all"
      whileHover={{ y: -5 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-white/60">{description}</p>
    </motion.div>
  )
}
