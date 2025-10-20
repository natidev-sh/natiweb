import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Key, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react'

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSave, isDark }) {
  const [inputValue, setInputValue] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    onSave(inputValue)
    onClose()
  }

  const handleClear = () => {
    setInputValue('')
    onSave('')
    localStorage.removeItem('nati_playground_api_key')
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl shadow-2xl ${
                isDark ? 'bg-[#252526]' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-[var(--primary)]" />
                  <h2 className="text-xl font-bold">API Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Info */}
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-600 mb-1">Google Gemini 1.5 Pro API Key Required</p>
                      <p className={isDark ? 'text-blue-300' : 'text-blue-700'}>
                        You need your own Gemini API key to use AI features. It's free to get started!
                      </p>
                    </div>
                  </div>
                </div>

                {/* How to get key */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">How to get your API key:</label>
                  <ol className={`text-sm space-y-1 list-decimal list-inside ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <li>Visit Google AI Studio</li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Get API Key"</li>
                    <li>Create a new API key</li>
                    <li>Copy and paste it below</li>
                  </ol>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
                  >
                    Open Google AI Studio
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center justify-between">
                    <span>Your Gemini API Key</span>
                    {apiKey && (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        Saved
                      </span>
                    )}
                  </label>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="AIza..."
                    className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors font-mono text-sm ${
                      isDark
                        ? 'bg-[#1e1e1e] border-white/10 focus:border-[var(--primary)]'
                        : 'bg-white border-gray-300 focus:border-[var(--primary)]'
                    }`}
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="text-xs text-[var(--primary)] hover:underline"
                  >
                    {showKey ? 'Hide' : 'Show'} API Key
                  </button>
                </div>

                {/* Privacy Note */}
                <div className={`text-xs p-3 rounded-lg ${
                  isDark ? 'bg-green-500/10 text-green-300' : 'bg-green-50 text-green-700'
                }`}>
                  <strong>🔒 Privacy:</strong> Your API key is stored only in your browser's localStorage. 
                  It never leaves your device and is not sent to our servers.
                </div>
              </div>

              {/* Footer */}
              <div className={`px-6 py-4 border-t flex items-center justify-between ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <button
                  onClick={handleClear}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  Clear
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
