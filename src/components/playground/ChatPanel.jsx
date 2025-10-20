import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, X, Loader2, AlertCircle, Bot, User, Settings } from 'lucide-react'

export default function ChatPanel({ messages, onSendMessage, onUpdateFiles, files, apiKey, isDark, onClose }) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const callGeminiAPI = async (userMessage) => {
    if (!apiKey) {
      throw new Error('Please set your Gemini API key in settings')
    }

    const systemPrompt = `You are an expert coding assistant in a web-based code playground. Your job is to help users build web applications using HTML, CSS, and JavaScript.

Current files in the project:
${Object.keys(files).map(name => `- ${name}`).join('\n')}

When the user asks you to create or modify code:
1. Provide complete, working code
2. Be concise but include all necessary code
3. Format your response as a code block with the filename
4. Only modify files that need changes

Example response format:
\`\`\`html:index.html
<!DOCTYPE html>
<html>
...complete code here...
</html>
\`\`\`

\`\`\`javascript:app.js
// Complete JavaScript code here
\`\`\`

User's request: ${userMessage}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Failed to get AI response')
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  const parseCodeBlocks = (text) => {
    const codeBlockRegex = /```(\w+):?([\w.]+)?\n([\s\S]*?)```/g
    const matches = []
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const [, language, filename, code] = match
      matches.push({
        language,
        filename: filename || `${language}.${language}`,
        code: code.trim()
      })
    }

    return matches
  }

  const applyCodeChanges = (aiResponse) => {
    const codeBlocks = parseCodeBlocks(aiResponse)
    
    if (codeBlocks.length === 0) {
      return false
    }

    const updatedFiles = { ...files }
    let hasChanges = false

    codeBlocks.forEach(block => {
      if (updatedFiles[block.filename]) {
        updatedFiles[block.filename] = {
          ...updatedFiles[block.filename],
          content: block.code
        }
        hasChanges = true
      } else {
        // Create new file
        updatedFiles[block.filename] = {
          name: block.filename,
          language: block.language,
          content: block.code
        }
        hasChanges = true
      }
    })

    if (hasChanges) {
      onUpdateFiles(updatedFiles)
    }

    return hasChanges
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      role: 'user',
      content: input.trim()
    }

    onSendMessage(userMessage)
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      const aiResponse = await callGeminiAPI(input.trim())
      
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse
      }
      
      onSendMessage(assistantMessage)
      
      // Try to apply code changes
      applyCodeChanges(aiResponse)
      
    } catch (err) {
      console.error('AI Error:', err)
      setError(err.message)
      
      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${err.message}\n\nPlease check:\n- Your API key is valid\n- You have internet connection\n- Your API key has available quota`
      }
      
      onSendMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '30%', opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-l flex flex-col ${isDark ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}
    >
      {/* Header */}
      <div className={`px-4 py-2 border-b flex items-center justify-between ${
        isDark ? 'bg-[#252526] border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[var(--primary)]" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          title="Close Chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* API Key Warning */}
      {!apiKey && (
        <div className={`mx-4 mt-4 p-3 rounded-lg border ${
          isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-yellow-600 mb-1">API Key Required</p>
              <p className={isDark ? 'text-yellow-300' : 'text-yellow-700'}>
                Click the settings icon to add your Gemini API key
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-[var(--primary)]/20' : 'bg-[var(--primary)]/10'
              }`}>
                <Bot className="h-4 w-4 text-[var(--primary)]" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white'
                  : isDark
                  ? 'bg-[#252526] border border-white/10'
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[var(--primary)] to-purple-600 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isDark ? 'bg-[var(--primary)]/20' : 'bg-[var(--primary)]/10'
            }`}>
              <Bot className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div className={`rounded-2xl px-4 py-3 ${
              isDark ? 'bg-[#252526]' : 'bg-gray-100'
            }`}>
              <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={apiKey ? "Ask AI to build something..." : "Set your API key first..."}
            disabled={!apiKey || isLoading}
            rows={3}
            className={`flex-1 px-3 py-2 rounded-lg border outline-none resize-none transition-colors text-sm ${
              isDark
                ? 'bg-[#1e1e1e] border-white/10 focus:border-[var(--primary)] placeholder-gray-500'
                : 'bg-white border-gray-300 focus:border-[var(--primary)] placeholder-gray-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !apiKey || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
