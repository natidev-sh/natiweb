import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Code, Rocket, CheckCircle, Cpu, Layout, Globe, ArrowRight, Brain, Eye, Layers, Maximize2, X } from 'lucide-react'

const demoProjects = [
  {
    id: 'saas',
    title: 'Analytics Dashboard',
    icon: Layers,
    description: 'Enterprise-grade analytics platform',
    code: `import { TrendingUp, Users, Activity, DollarSign } from 'lucide-react'
import { LineChart, AreaChart } from '@/components/charts'

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          Revenue Dashboard
        </h1>
        <p className="text-slate-400 mt-2">Real-time business metrics</p>
      </header>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        {metrics.map(metric => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend">
          <AreaChart data={revenueData} />
        </ChartCard>
        <ChartCard title="User Activity">
          <LineChart data={activityData} />
        </ChartCard>
      </div>
    </div>
  )
}`,
    preview: 'saas'
  },
  {
    id: 'ai-chat',
    title: 'AI Chat Interface',
    icon: Brain,
    description: 'Next-gen conversational AI',
    code: `import { Send, Sparkles, MessageSquare } from 'lucide-react'
import { useChat } from '@/hooks/useChat'

export default function AIChat() {
  const { messages, sendMessage, isTyping } = useChat()
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
      <header className="border-b border-white/10 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Nati AI Assistant</h2>
            <p className="text-sm text-slate-400">Powered by GPT-4 Turbo</p>
          </div>
        </div>
      </header>
      
      <MessageList messages={messages} isTyping={isTyping} />
      
      <footer className="p-6 border-t border-white/10">
        <ChatInput onSend={sendMessage} />
      </footer>
    </div>
  )
}`,
    preview: 'chat'
  },
  {
    id: 'landing',
    title: 'Product Landing',
    icon: Eye,
    description: 'Conversion-optimized hero section',
    code: `import { ArrowRight, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Trusted by 50,000+ developers</span>
          </div>
          
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Build The Future
            <br />With AI
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Ship production-ready applications 10x faster with our AI-powered development platform
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="group">
              Start Building Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
            </Button>
            <Button size="lg" variant="outline">Watch Demo</Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    </section>
  )
}`,
    preview: 'landing'
  }
]

const stages = [
  { id: 'thinking', label: 'Analyzing', icon: Brain, color: 'from-cyan-500 to-blue-500' },
  { id: 'writing', label: 'Writing', icon: Code, color: 'from-blue-500 to-indigo-500' },
  { id: 'building', label: 'Building', icon: Zap, color: 'from-indigo-500 to-purple-500' },
  { id: 'deploying', label: 'Live!', icon: CheckCircle, color: 'from-purple-500 to-pink-500' }
]

export default function InteractiveDemo() {
  const [selected, setSelected] = useState(null)
  const [stage, setStage] = useState(0)
  const [code, setCode] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!selected || animating) return
    
    setStage(0)
    setCode('')
    setShowPreview(false)
    setAnimating(true)

    const animate = async () => {
      await new Promise(r => setTimeout(r, 1000))
      setStage(1)
      
      const fullCode = selected.code
      for (let i = 0; i <= fullCode.length; i += 3) {
        setCode(fullCode.substring(0, i))
        await new Promise(r => setTimeout(r, 20))
      }
      
      await new Promise(r => setTimeout(r, 500))
      setStage(2)
      await new Promise(r => setTimeout(r, 1000))
      setStage(3)
      setShowPreview(true)
      setAnimating(false)
    }

    animate()
  }, [selected])

  return (
    <div className="w-full py-20 px-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--primary)]">Watch AI Build in Real-Time</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            See The Magic <span className="text-[var(--primary)]">Happen</span>
          </h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            Watch AI analyze, write, build, and deploy production-ready applications in seconds
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {demoProjects.map((project, index) => {
            const Icon = project.icon
            const isActive = selected?.id === project.id
            return (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelected(project)}
                disabled={animating}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative p-8 rounded-2xl border transition-all text-left overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-[var(--primary)]/5 border-[var(--primary)] shadow-[0_20px_70px_-15px_var(--primary)]'
                    : 'bg-[var(--background)] border-[var(--primary)]/10 hover:border-[var(--primary)]/30'
                }`}
              >
                {/* Grid Background */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_14px] opacity-20" />
                
                {/* Icon Background Glow */}
                <div className="absolute right-4 bottom-4 w-32 h-32">
                  <Icon className="w-full h-full text-[var(--primary)] opacity-5" />
                </div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--primary)]/10 mb-4 border border-[var(--primary)]/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="h-7 w-7 text-[var(--primary)]" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="opacity-70 mb-4">{project.description}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                    <span>{isActive ? 'Selected' : 'Try it now'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Bottom Glow */}
                {isActive && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/50"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {selected && (
          <>
            <AnimatePresence mode="wait">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex items-center justify-center gap-2 flex-wrap"
              >
                {stages.map((s, i) => {
                  const Icon = s.icon
                  const isActive = i <= stage
                  const isCurrent = i === stage
                  return (
                    <div key={s.id} className="flex items-center">
                      <motion.div 
                        className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all relative overflow-hidden ${
                          isActive 
                            ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]'
                            : 'bg-[var(--background)] border-[var(--primary)]/20 opacity-50'
                        }`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {isActive && (
                          <motion.div 
                            className={`absolute inset-0 bg-gradient-to-r ${s.color} opacity-10`}
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        <Icon className={`h-5 w-5 relative z-10 ${isCurrent && isActive ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-bold relative z-10">{s.label}</span>
                        {isCurrent && isActive && (
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-[var(--primary)]"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      {i < stages.length - 1 && (
                        <motion.div 
                          className={`w-12 h-1 mx-2 rounded-full relative overflow-hidden ${
                            i < stage ? 'bg-[var(--primary)]' : 'bg-[var(--primary)]/10'
                          }`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: i < stage ? 1 : 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                      )}
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            <motion.div 
              className="grid xl:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Code Editor */}
              <motion.div 
                className="rounded-2xl overflow-hidden border border-[var(--primary)]/20 bg-[#0c0a1f] shadow-[0_20px_70px_-15px_var(--primary)]"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between px-5 py-4 bg-[var(--primary)]/5 border-b border-[var(--primary)]/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="ml-2 text-sm font-mono font-semibold opacity-60">App.jsx</span>
                  </div>
                  {stage === 1 && animating && (
                    <motion.div 
                      className="flex items-center gap-2 text-[var(--primary)]"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs font-bold">AI Writing...</span>
                    </motion.div>
                  )}
                </div>
                <div className="relative min-h-[550px] overflow-hidden">
                  {/* Grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />
                  
                  <div className="p-8 font-mono text-sm min-h-[550px] overflow-x-auto overflow-y-auto max-h-[550px] scrollbar-thin scrollbar-thumb-[var(--primary)]/20 scrollbar-track-transparent">
                    {stage === 0 && (
                      <motion.div 
                        className="flex flex-col items-center justify-center h-[500px] relative z-10"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Brain className="h-16 w-16 mb-4 text-[var(--primary)]" />
                        </motion.div>
                        <p className="opacity-60">Analyzing your request...</p>
                      </motion.div>
                    )}
                    {stage >= 1 && (
                      <pre className="text-[var(--primary)] leading-relaxed relative z-10 whitespace-pre">
                        <code>{code}{stage === 1 && animating && <motion.span className="inline-block w-2 h-5 bg-[var(--primary)] ml-1" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />}</code>
                      </pre>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Live Preview */}
              <motion.div 
                className="rounded-2xl overflow-hidden border border-[var(--primary)]/20 bg-white shadow-[0_20px_70px_-15px_var(--primary)]"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm max-w-md flex-1">
                      <Globe className="h-4 w-4 text-[var(--primary)]" />
                      <span className="text-sm font-mono font-semibold text-slate-600 truncate">preview.nati.dev/{selected.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AnimatePresence>
                      {showPreview && (
                        <motion.div 
                          className="flex items-center gap-2 text-green-600 text-sm font-bold"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-green-600"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          Live
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.button
                      onClick={() => setIsFullscreen(true)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Fullscreen"
                    >
                      <Maximize2 className="h-4 w-4 text-slate-600" />
                    </motion.button>
                  </div>
                </div>
                <div className="h-[550px] bg-white overflow-hidden relative">
                  {!showPreview && stage > 0 && (
                    <motion.div 
                      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="relative mb-6"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-16 h-16 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Building Your App...</h3>
                      <p className="text-slate-500 text-sm">Generating components and styling</p>
                      <div className="flex gap-2 mt-6">
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-[var(--primary)]"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-[var(--primary)]"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-[var(--primary)]"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </motion.div>
                  )}
                  <motion.div
                    className="w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showPreview ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <iframe
                      srcDoc={getPreviewHTML(selected.preview)}
                      className="w-full h-full border-0"
                      title="preview"
                      sandbox="allow-scripts"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}

        {!selected && (
          <motion.div 
            className="text-center py-32 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-[var(--primary)]/5 rounded-3xl blur-3xl" />
            <div className="relative z-10">
              <motion.div 
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/50 rounded-3xl mb-8 shadow-[0_20px_70px_-15px_var(--primary)]"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold mb-4">Choose a project to start</h3>
              <p className="text-lg opacity-70 max-w-md mx-auto">
                Select any template above and watch AI build it from scratch in real-time
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-white" />
                <span className="text-white font-mono text-sm">preview.nati.dev/{selected.id}</span>
              </div>
              <motion.button
                onClick={() => setIsFullscreen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.button>
            </div>
            <div className="flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <iframe
                srcDoc={getPreviewHTML(selected.preview)}
                className="w-full h-full border-0"
                title="fullscreen-preview"
                sandbox="allow-scripts"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getPreviewHTML(type) {
  const templates = {
    saas: `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
@keyframes slideUp{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.8}}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#000;color:#fff;min-height:100vh}
.container{min-height:100vh;padding:clamp(20px,5vw,60px);background:radial-gradient(circle at 30% 20%,rgba(99,102,241,0.08) 0%,transparent 50%),radial-gradient(circle at 70% 80%,rgba(99,102,241,0.08) 0%,transparent 50%),#000;position:relative}
.grid-bg{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(99,102,241,0.03) 1px,transparent 1px);background-size:24px 24px;pointer-events:none}
header{margin-bottom:clamp(24px,4vw,48px);animation:slideUp 0.6s ease-out}
h1{font-size:clamp(28px,5vw,56px);font-weight:800;background:linear-gradient(135deg,#fff 0%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
.subtitle{color:#94a3b8;font-size:clamp(14px,2vw,18px);margin-bottom:8px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:clamp(16px,2vw,24px);margin-bottom:clamp(24px,3vw,40px)}
.card{background:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.1);border-radius:16px;padding:clamp(20px,3vw,32px);position:relative;overflow:hidden;animation:slideUp 0.8s ease-out;transition:0.3s}
.card:hover{transform:translateY(-4px);border-color:rgba(99,102,241,0.3);box-shadow:0 20px 60px rgba(99,102,241,0.15)}
.card::before{content:'';position:absolute;top:0;right:0;width:50%;height:50%;background:linear-gradient(to right,rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(99,102,241,0.03) 1px,transparent 1px);background-size:14px 14px;opacity:0.5}
.label{color:#64748b;font-size:clamp(11px,1.5vw,13px);font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
.value{font-size:clamp(32px,5vw,48px);font-weight:900;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
.change{color:#10b981;font-size:clamp(13px,1.8vw,16px);font-weight:700;display:flex;align-items:center;gap:6px}
.chart-container{background:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.1);border-radius:16px;padding:clamp(20px,3vw,32px);position:relative;overflow:hidden}
.chart-container::before{content:'';position:absolute;inset:0;background:linear-gradient(to right,transparent,rgba(99,102,241,0.05) 50%,transparent);pointer-events:none}
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
    
    chat: `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
@keyframes fadeIn{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
@keyframes typing{0%,100%{opacity:0.3}50%{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#000;color:#fff;overflow:hidden}
.container{height:100vh;display:flex;flex-direction:column;background:radial-gradient(circle at 30% 20%,rgba(99,102,241,0.1) 0%,transparent 50%),#000}
.header{background:rgba(15,23,42,0.6);border-bottom:1px solid rgba(99,102,241,0.1);padding:clamp(16px,3vw,24px) clamp(20px,4vw,40px)}
.header-content{display:flex;align-items:center;gap:clamp(12px,2vw,16px)}
.avatar{width:clamp(48px,10vw,56px);height:clamp(48px,10vw,56px);border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:clamp(24px,5vw,28px);box-shadow:0 8px 32px rgba(99,102,241,0.3)}
h2{font-size:clamp(18px,3vw,24px);font-weight:800;margin-bottom:4px}
.subtitle{color:#64748b;font-size:clamp(12px,2vw,14px)}
.status{width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;margin-left:6px;animation:pulse 2s ease-in-out infinite}
.messages{flex:1;padding:clamp(20px,4vw,48px);overflow-y:auto}
.message{display:flex;gap:clamp(12px,2vw,16px);margin-bottom:clamp(24px,4vw,32px);animation:fadeIn 0.6s ease-out}
.msg-avatar{width:clamp(36px,6vw,44px);height:clamp(36px,6vw,44px);border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:clamp(18px,3vw,22px)}
.msg-avatar.ai{background:linear-gradient(135deg,#6366f1,#8b5cf6);box-shadow:0 4px 16px rgba(99,102,241,0.3)}
.msg-avatar.user{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)}
.msg-content{background:rgba(15,23,42,0.6);border:1px solid rgba(99,102,241,0.1);border-radius:16px;padding:clamp(16px,2vw,20px);max-width:min(600px,80vw);color:#e2e8f0;line-height:1.6;font-size:clamp(14px,2vw,16px)}
.msg-content.user{background:rgba(99,102,241,0.1);border-color:rgba(99,102,241,0.2)}
.typing-dots{display:flex;gap:4px;padding:8px 0}
.dot{width:6px;height:6px;border-radius:50%;background:#6366f1;animation:typing 1.4s ease-in-out infinite}
.dot:nth-child(2){animation-delay:0.2s}
.dot:nth-child(3){animation-delay:0.4s}
.footer{background:rgba(15,23,42,0.6);border-top:1px solid rgba(99,102,241,0.1);padding:clamp(16px,3vw,24px) clamp(20px,4vw,40px)}
.input-wrap{display:flex;gap:clamp(8px,2vw,12px)}
.input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(99,102,241,0.1);border-radius:12px;padding:clamp(12px,2vw,16px);color:#fff;font-size:clamp(14px,2vw,15px);outline:none}
.input:focus{border-color:#6366f1;box-shadow:0 0 20px rgba(99,102,241,0.2)}
.btn{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:12px;padding:clamp(12px,2vw,16px) clamp(20px,3vw,32px);font-weight:700;font-size:clamp(14px,2vw,16px);white-space:nowrap;box-shadow:0 4px 16px rgba(99,102,241,0.3)}
</style></head><body>
<div class="container">
  <div class="header">
    <div class="header-content">
      <div class="avatar">✨</div>
      <div>
        <h2>Nati AI Assistant</h2>
        <p class="subtitle">GPT-4 Turbo<span class="status"></span>Online</p>
      </div>
    </div>
  </div>
  <div class="messages">
    <div class="message">
      <div class="msg-avatar ai">🤖</div>
      <div class="msg-content">
        <p style="margin-bottom:12px;font-weight:600">Hello! I'm your AI assistant.</p>
        <p>I can help you build applications, write code, and design interfaces.</p>
        <p style="margin-top:12px;color:#6366f1;font-weight:600">What would you like to create?</p>
      </div>
    </div>
    <div class="message" style="flex-direction:row-reverse;animation-delay:0.2s">
      <div class="msg-avatar user">👤</div>
      <div class="msg-content user">I need a modern dashboard with real-time analytics</div>
    </div>
    <div class="message" style="animation-delay:0.4s">
      <div class="msg-avatar ai">🤖</div>
      <div class="msg-content">
        <p style="margin-bottom:8px;font-weight:600">Building your dashboard...</p>
        <div class="typing-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="input-wrap">
      <input class="input" placeholder="Type your message..."/>
      <button class="btn">Send</button>
    </div>
  </div>
</div>
</body></html>`,
    
    landing: `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
@keyframes fadeIn{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
@keyframes glow{0%,100%{box-shadow:0 0 30px rgba(99,102,241,0.5)}50%{box-shadow:0 0 60px rgba(99,102,241,0.8)}}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#000;color:#fff;overflow-x:hidden}
.container{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:clamp(40px,8vw,80px) clamp(20px,4vw,40px);position:relative;background:radial-gradient(circle at 30% 20%,rgba(99,102,241,0.15) 0%,transparent 50%),radial-gradient(circle at 70% 80%,rgba(99,102,241,0.15) 0%,transparent 50%),#000}
.grid-overlay{position:absolute;inset:0;background-image:radial-gradient(circle at 2px 2px,rgba(255,255,255,0.03) 1px,transparent 0);background-size:40px 40px;opacity:0.5;pointer-events:none}
.orb{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none}
.orb1{width:clamp(300px,40vw,500px);height:clamp(300px,40vw,500px);top:10%;left:10%;background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%);animation:float 10s ease-in-out infinite}
.orb2{width:clamp(350px,45vw,600px);height:clamp(350px,45vw,600px);bottom:10%;right:10%;background:radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 70%);animation:float 12s ease-in-out infinite;animation-delay:-4s}
.content{max-width:1200px;text-align:center;position:relative;z-index:10}
.badge{display:inline-flex;align-items:center;gap:10px;padding:clamp(8px,1.5vw,12px) clamp(16px,3vw,24px);border-radius:100px;background:rgba(255,255,255,0.05);border:1px solid rgba(99,102,241,0.2);margin-bottom:clamp(24px,4vw,40px);animation:fadeIn 0.8s ease-out;font-size:clamp(12px,2vw,14px);font-weight:700}
h1{font-size:clamp(40px,8vw,84px);font-weight:900;margin-bottom:clamp(20px,3vw,32px);line-height:1.1;animation:fadeIn 0.8s ease-out 0.2s backwards}
.gradient-text{background:linear-gradient(135deg,#fff 0%,#a78bfa 50%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{color:#94a3b8;font-size:clamp(16px,3vw,24px);margin-bottom:clamp(32px,5vw,48px);max-width:800px;margin-left:auto;margin-right:auto;line-height:1.6;animation:fadeIn 0.8s ease-out 0.4s backwards}
.cta-group{display:flex;gap:clamp(12px,2vw,20px);justify-content:center;margin-bottom:clamp(40px,6vw,64px);flex-wrap:wrap;animation:fadeIn 0.8s ease-out 0.6s backwards}
.btn-primary{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:clamp(16px,3vw,20px) clamp(32px,5vw,48px);border-radius:16px;font-weight:800;font-size:clamp(16px,2vw,18px);border:none;animation:glow 3s ease-in-out infinite;text-decoration:none;display:inline-block}
.btn-secondary{background:rgba(255,255,255,0.05);color:#fff;padding:clamp(16px,3vw,20px) clamp(32px,5vw,48px);border-radius:16px;font-weight:800;font-size:clamp(16px,2vw,18px);border:2px solid rgba(99,102,241,0.3);text-decoration:none;display:inline-block}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:clamp(24px,4vw,48px);max-width:900px;margin:0 auto;animation:fadeIn 0.8s ease-out 0.8s backwards}
.stat-value{font-size:clamp(36px,7vw,56px);font-weight:900;margin-bottom:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stat-label{color:#64748b;font-size:clamp(13px,2vw,16px);font-weight:700;text-transform:uppercase;letter-spacing:1px}
</style></head><body>
<div class="container">
  <div class="grid-overlay"></div>
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>
  <div class="content">
    <div class="badge">
      <span>⭐</span>
      <span>Trusted by 50,000+ developers</span>
    </div>
    <h1>
      Build The Future<br/>
      <span class="gradient-text">With AI</span>
    </h1>
    <p class="subtitle">
      Ship production-ready applications 10x faster with AI-powered development
    </p>
    <div class="cta-group">
      <a href="#" class="btn-primary">Start Building Free →</a>
      <a href="#" class="btn-secondary">Watch Demo</a>
    </div>
    <div class="stats">
      <div>
        <div class="stat-value">10x</div>
        <div class="stat-label">Faster Dev</div>
      </div>
      <div>
        <div class="stat-value">99.9%</div>
        <div class="stat-label">Uptime</div>
      </div>
      <div>
        <div class="stat-value">24/7</div>
        <div class="stat-label">Support</div>
      </div>
    </div>
  </div>
</div>
</body></html>`
  }
  return templates[type] || templates.saas
}
