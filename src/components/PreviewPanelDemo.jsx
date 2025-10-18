import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Code2, RefreshCw, Maximize2, Terminal, FileCode, Database, Globe, Settings, Zap, Brain, Rocket, ArrowRight, Download, Github } from 'lucide-react'

const projectTemplates = [
  {
    id: 'dashboard',
    title: '📊 Analytics Dashboard',
    description: 'Real-time metrics & charts',
    prompt: 'Create a modern analytics dashboard with real-time charts, metrics cards, and data visualization',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'saas',
    title: '🚀 SaaS Landing',
    description: 'Marketing website',
    prompt: 'Build a stunning SaaS landing page with pricing, features, and testimonials',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'ecommerce',
    title: '🛍️ E-commerce Store',
    description: 'Product catalog & cart',
    prompt: 'Create an e-commerce store with product listings, shopping cart, and checkout',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'social',
    title: '💬 Social Feed',
    description: 'Posts, likes & comments',
    prompt: 'Build a social media feed with posts, likes, comments, and user profiles',
    color: 'from-orange-500 to-red-500'
  }
]

const mockCode = `import { AreaChart, Card } from '@/components/ui'

export default function Dashboard() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-950 to-slate-900">
      <h1 className="text-4xl font-bold mb-8">
        Analytics Dashboard
      </h1>
      <div className="grid grid-cols-3 gap-6">
        <MetricCard 
          title="Revenue" 
          value="$2.4M" 
          change="+32%" 
        />
        <MetricCard 
          title="Users" 
          value="124K" 
          change="+18%" 
        />
        <MetricCard 
          title="Conversion" 
          value="12.4%" 
          change="+5%" 
        />
      </div>
      <div className="mt-8">
        <AreaChart data={revenueData} />
      </div>
    </div>
  )
}`

const mockPreview = `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:linear-gradient(135deg,#020617 0%,#0f172a 100%);color:#fff;min-height:100vh;padding:40px}
h1{font-size:42px;font-weight:900;margin-bottom:32px;background:linear-gradient(135deg,#fff 0%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:32px}
.card{background:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:24px}
.label{color:#64748b;font-size:14px;font-weight:600;margin-bottom:12px}
.value{font-size:36px;font-weight:900;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.change{color:#10b981;font-size:16px;font-weight:700}
.chart{background:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:32px;height:300px;display:flex;align-items:flex-end;gap:8px}
.bar{background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:8px 8px 0 0;flex:1;animation:grow 1s ease-out}
@keyframes grow{0%{height:0}100%{height:var(--h)}}
</style></head><body>
<h1>Analytics Dashboard</h1>
<div class="grid">
  <div class="card">
    <div class="label">Revenue</div>
    <div class="value">$2.4M</div>
    <div class="change">↗ +32%</div>
  </div>
  <div class="card">
    <div class="label">Users</div>
    <div class="value">124K</div>
    <div class="change">↗ +18%</div>
  </div>
  <div class="card">
    <div class="label">Conversion</div>
    <div class="value">12.4%</div>
    <div class="change">↗ +5%</div>
  </div>
</div>
<div class="chart">
  <div class="bar" style="--h:60%"></div>
  <div class="bar" style="--h:75%"></div>
  <div class="bar" style="--h:55%"></div>
  <div class="bar" style="--h:85%"></div>
  <div class="bar" style="--h:70%"></div>
  <div class="bar" style="--h:95%"></div>
  <div class="bar" style="--h:80%"></div>
  <div class="bar" style="--h:100%"></div>
</div>
</body></html>`

export default function PreviewPanelDemo() {
  const [activeTab, setActiveTab] = useState('preview') // 'chat', 'code', 'preview'
  const [buildStatus, setBuildStatus] = useState('idle') // 'idle', 'building', 'success', 'error'
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [displayedCode, setDisplayedCode] = useState('')
  const [showTyping, setShowTyping] = useState(false)

  const startDemo = () => {
    setBuildStatus('building')
    setActiveTab('chat')
    setMessages([mockMessages[0]])
    
    setTimeout(() => {
      setShowTyping(true)
      setTimeout(() => {
        setShowTyping(false)
        setMessages([...mockMessages])
        setActiveTab('code')
        animateCode()
      }, 2000)
    }, 1000)
  }

  const animateCode = () => {
    let index = 0
    const interval = setInterval(() => {
      if (index < mockCode.length) {
        setDisplayedCode(mockCode.slice(0, index + 1))
        index += 3
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setActiveTab('preview')
          setBuildStatus('success')
        }, 800)
      }
    }, 20)
  }

  const resetDemo = () => {
    setBuildStatus('idle')
    setActiveTab('preview')
    setMessages([])
    setDisplayedCode('')
    setShowTyping(false)
    setInputValue('')
  }

  return (
    <div className="w-full py-20 px-4 relative bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/5 rounded-full blur-3xl" />
      
      <div className="max-w-[1600px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Terminal className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-sm font-bold text-[var(--primary)]">World's First Web-Based AI IDE Preview</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-[var(--primary)] to-white bg-clip-text text-transparent">
              Experience Nati AI
            </span>
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-8">
            See how Nati builds complete applications from a simple conversation. 
            This is a live simulation of our desktop IDE's preview panel.
          </p>
          {buildStatus === 'idle' && (
            <motion.button
              onClick={startDemo}
              className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold rounded-xl shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Start Interactive Demo
              </span>
            </motion.button>
          )}
          {buildStatus !== 'idle' && (
            <motion.button
              onClick={resetDemo}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset Demo
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Preview Panel Simulation */}
        <motion.div
          className="rounded-2xl overflow-hidden border border-[var(--primary)]/20 bg-[#0a0a0a] shadow-[0_20px_100px_rgba(99,102,241,0.3)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 py-3 bg-[var(--primary)]/5 border-b border-[var(--primary)]/10">
            <TabButton 
              active={activeTab === 'chat'} 
              onClick={() => setActiveTab('chat')}
              icon={<Sparkles className="h-4 w-4" />}
              label="Chat"
            />
            <TabButton 
              active={activeTab === 'code'} 
              onClick={() => setActiveTab('code')}
              icon={<Code2 className="h-4 w-4" />}
              label="Code"
            />
            <TabButton 
              active={activeTab === 'preview'} 
              onClick={() => setActiveTab('preview')}
              icon={<FileCode className="h-4 w-4" />}
              label="Preview"
            />
            
            <div className="ml-auto flex items-center gap-2">
              {buildStatus === 'building' && (
                <motion.div 
                  className="flex items-center gap-2 text-[var(--primary)] text-sm font-semibold"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                  Building...
                </motion.div>
              )}
              {buildStatus === 'success' && (
                <motion.div 
                  className="flex items-center gap-2 text-green-500 text-sm font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Live
                </motion.div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="h-[600px] overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <ChatPanel 
                  messages={messages} 
                  showTyping={showTyping}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              )}
              {activeTab === 'code' && (
                <CodePanel code={displayedCode} />
              )}
              {activeTab === 'preview' && (
                <PreviewPanel 
                  html={mockPreview} 
                  buildStatus={buildStatus}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        active 
          ? 'bg-[var(--primary)]/20 text-[var(--primary)]' 
          : 'text-[var(--muted-foreground)] hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function ChatPanel({ messages, showTyping, inputValue, setInputValue }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f]"
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
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
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {showTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
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
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]/50 transition-colors"
            disabled
          />
          <button className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-xl font-semibold text-sm opacity-50 cursor-not-allowed">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CodePanel({ code }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full bg-[#0c0a1f] p-6 overflow-auto font-mono text-sm"
    >
      <pre className="text-[var(--primary)] leading-relaxed">
        <code>{code}<motion.span className="inline-block w-2 h-5 bg-[var(--primary)] ml-1" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} /></code>
      </pre>
    </motion.div>
  )
}

function PreviewPanel({ html, buildStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full bg-white relative"
    >
      {buildStatus === 'building' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <div className="w-16 h-16 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Building Your App...</h3>
          <p className="text-slate-500 text-sm">Generating components and styling</p>
        </div>
      )}
      {buildStatus === 'success' && (
        <iframe
          srcDoc={html}
          className="w-full h-full border-0"
          title="preview"
          sandbox="allow-scripts"
        />
      )}
    </motion.div>
  )
}
