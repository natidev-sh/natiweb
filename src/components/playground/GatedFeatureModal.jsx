import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Download, Upload, Check, ArrowRight } from 'lucide-react'

const features = {
  deploy: {
    icon: Upload,
    title: 'Deploy Your App',
    description: 'One-click deployment to production requires Nati Desktop',
    benefits: [
      'Deploy to Vercel, Netlify, or custom servers',
      'Automatic SSL certificates',
      'Custom domain support',
      'Environment variables management',
      'CI/CD pipeline integration',
      'Preview deployments for testing'
    ]
  },
  download: {
    icon: Download,
    title: 'Download Project',
    description: 'Download your project files to continue working locally with Nati Desktop',
    benefits: [
      'Export complete project structure',
      'Work offline on your machine',
      'Version control with Git',
      'Advanced debugging tools',
      'Database integration',
      'Team collaboration features'
    ]
  }
}

export default function GatedFeatureModal({ isOpen, onClose, feature, isDark }) {
  const config = features[feature] || features.deploy
  const Icon = config.icon

  const handleDownloadNati = () => {
    window.open('/download', '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
                isDark ? 'bg-[#252526]' : 'bg-white'
              }`}
            >
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-[var(--primary)] to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
                      <p className="text-white/90">{config.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Feature Locked Message */}
                <div className={`p-4 rounded-xl border-2 border-dashed ${
                  isDark ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-yellow-400/40 bg-yellow-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-600 mb-1">
                        This feature requires Nati Desktop
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                        The playground is great for trying out AI code generation, but for the full experience including deployment, 
                        download management, and advanced tools, you'll need the desktop app.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefits List */}
                <div>
                  <h3 className="font-bold text-lg mb-3">What you get with Nati Desktop:</h3>
                  <div className="grid gap-2">
                    {config.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          isDark ? 'bg-white/5' : 'bg-gray-50'
                        }`}
                      >
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison */}
                <div className={`p-4 rounded-xl ${
                  isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h4 className="font-semibold text-blue-600 mb-2">Playground vs Desktop</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        🌐 Playground (Current)
                      </p>
                      <ul className={`space-y-1 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                        <li>• Try AI code generation</li>
                        <li>• Browser-based editor</li>
                        <li>• Live preview</li>
                        <li>• No installation needed</li>
                      </ul>
                    </div>
                    <div>
                      <p className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        🚀 Desktop (Full Power)
                      </p>
                      <ul className={`space-y-1 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                        <li>• Everything in Playground</li>
                        <li>• Deploy to production</li>
                        <li>• Download projects</li>
                        <li>• Database tools</li>
                        <li>• Team collaboration</li>
                        <li>• Advanced debugging</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Pricing Note */}
                <div className={`text-center p-4 rounded-lg ${
                  isDark ? 'bg-green-500/10' : 'bg-green-50'
                }`}>
                  <p className="text-sm">
                    <span className="font-bold text-green-600">Free Forever</span>
                    <span className={isDark ? 'text-green-300' : 'text-green-700'}>
                      {' '}with unlimited projects • Pro features from $19/month
                    </span>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className={`px-6 py-4 border-t flex items-center justify-between ${
                isDark ? 'border-white/10 bg-[#1e1e1e]' : 'border-gray-200 bg-gray-50'
              }`}>
                <button
                  onClick={onClose}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                  }`}
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleDownloadNati}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Download className="h-5 w-5" />
                  Download Nati Free
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
