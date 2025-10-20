import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Download, Upload, Settings, MessageSquare, Code2, Eye, FileCode, Sparkles, AlertCircle } from 'lucide-react'
import PageMeta from '../components/PageMeta.jsx'
import { useTheme } from '../theme/ThemeProvider'
import CodeEditor from '../components/playground/CodeEditor.jsx'
import ChatPanel from '../components/playground/ChatPanel.jsx'
import PreviewPanel from '../components/playground/PreviewPanel.jsx'
import FileExplorer from '../components/playground/FileExplorer.jsx'
import ApiKeyModal from '../components/playground/ApiKeyModal.jsx'
import GatedFeatureModal from '../components/playground/GatedFeatureModal.jsx'

export default function Playground() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // UI State
  const [showChat, setShowChat] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [showGatedModal, setShowGatedModal] = useState(false)
  const [gatedFeature, setGatedFeature] = useState('')

  // Project State
  const [files, setFiles] = useState({
    'index.html': {
      name: 'index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #6366f1;
    }
  </style>
</head>
<body>
  <h1>Welcome to Nati Playground! 🚀</h1>
  <p>Start chatting with AI to generate your app. Try: "Create a todo list"</p>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>`
    },
    'app.js': {
      name: 'app.js',
      language: 'javascript',
      content: `// Your app code here
console.log('Hello from Nati Playground!');

// Example: Simple counter
let count = 0;
const app = document.getElementById('app');

const button = document.createElement('button');
button.textContent = 'Click me!';
button.style.cssText = 'padding: 10px 20px; font-size: 16px; cursor: pointer;';

const counter = document.createElement('p');
counter.textContent = \`Count: \${count}\`;

button.addEventListener('click', () => {
  count++;
  counter.textContent = \`Count: \${count}\`;
});

app.appendChild(button);
app.appendChild(counter);`
    },
    'styles.css': {
      name: 'styles.css',
      language: 'css',
      content: `/* Your styles here */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

#app {
  margin-top: 2rem;
}`
    }
  })

  const [activeFile, setActiveFile] = useState('index.html')
  const [apiKey, setApiKey] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI coding assistant powered by Gemini 1.5 Pro. I can help you build apps right here in your browser. Try asking me to create something, like "Build a calculator" or "Create a todo app".\n\n⚠️ **You\'ll need your own Gemini API key** to use AI features. Click the settings icon to add it.'
    }
  ])

  // Load saved state from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('nati_playground_api_key')
    const savedFiles = localStorage.getItem('nati_playground_files')
    const savedMessages = localStorage.getItem('nati_playground_messages')

    if (savedApiKey) setApiKey(savedApiKey)
    if (savedFiles) setFiles(JSON.parse(savedFiles))
    if (savedMessages) setChatMessages(JSON.parse(savedMessages))
  }, [])

  // Save state to localStorage
  useEffect(() => {
    if (apiKey) localStorage.setItem('nati_playground_api_key', apiKey)
  }, [apiKey])

  useEffect(() => {
    localStorage.setItem('nati_playground_files', JSON.stringify(files))
  }, [files])

  useEffect(() => {
    localStorage.setItem('nati_playground_messages', JSON.stringify(chatMessages))
  }, [chatMessages])

  const handleFileChange = (fileName, newContent) => {
    setFiles(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        content: newContent
      }
    }))
  }

  const handleGatedAction = (feature) => {
    setGatedFeature(feature)
    setShowGatedModal(true)
  }

  const handleRunCode = () => {
    // Just refresh the preview
    setShowPreview(false)
    setTimeout(() => setShowPreview(true), 10)
  }

  return (
    <>
      <PageMeta
        title="Live Playground - Try Nati AI IDE in Browser"
        description="Experience AI-powered code generation in your browser. No signup required. Generate apps with AI and see results instantly."
      />

      <div className="fixed inset-0 bg-[var(--background)] flex flex-col">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white px-4 py-2 text-center text-sm">
          <Sparkles className="inline h-4 w-4 mr-2" />
          <span className="font-semibold">Try Nati AI IDE in Browser</span>
          <span className="mx-2">•</span>
          <span>Download full version for deploy, database tools, and more</span>
          <button
            onClick={() => window.open('/download', '_blank')}
            className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors"
          >
            Download Nati
          </button>
        </div>

        {/* Toolbar */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[var(--primary)]" />
            <span className="font-bold text-lg">Playground</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCode}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <Play className="h-4 w-4" />
              Run
            </button>

            <button
              onClick={() => handleGatedAction('deploy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Upload className="h-4 w-4" />
              Deploy
            </button>

            <button
              onClick={() => handleGatedAction('download')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Download className="h-4 w-4" />
              Download
            </button>

            <div className="w-px h-6 bg-gray-300" />

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-colors ${
                showChat ? 'bg-[var(--primary)] text-white' : isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              title="Toggle Chat"
            >
              <MessageSquare className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${
                showPreview ? 'bg-[var(--primary)] text-white' : isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              title="Toggle Preview"
            >
              <Eye className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowApiKeyModal(true)}
              className={`p-2 rounded-lg transition-colors ${
                apiKey ? 'text-green-500' : 'text-yellow-500'
              } ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              title="API Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer */}
          <FileExplorer
            files={files}
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            isDark={isDark}
          />

          {/* Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            <CodeEditor
              file={files[activeFile]}
              onChange={(content) => handleFileChange(activeFile, content)}
              isDark={isDark}
            />
          </div>

          {/* Chat Panel */}
          <AnimatePresence>
            {showChat && (
              <ChatPanel
                messages={chatMessages}
                onSendMessage={(msg) => setChatMessages(prev => [...prev, msg])}
                onUpdateFiles={(updatedFiles) => setFiles(updatedFiles)}
                files={files}
                apiKey={apiKey}
                isDark={isDark}
                onClose={() => setShowChat(false)}
              />
            )}
          </AnimatePresence>

          {/* Preview Panel */}
          <AnimatePresence>
            {showPreview && (
              <PreviewPanel
                files={files}
                isDark={isDark}
                onClose={() => setShowPreview(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* API Key Modal */}
        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          apiKey={apiKey}
          onSave={setApiKey}
          isDark={isDark}
        />

        {/* Gated Feature Modal */}
        <GatedFeatureModal
          isOpen={showGatedModal}
          onClose={() => setShowGatedModal(false)}
          feature={gatedFeature}
          isDark={isDark}
        />
      </div>
    </>
  )
}
