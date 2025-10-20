import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, X, RefreshCw, AlertCircle } from 'lucide-react'

export default function PreviewPanel({ files, isDark, onClose }) {
  const iframeRef = useRef(null)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const generatePreviewHTML = () => {
    try {
      const htmlFile = files['index.html'] || { content: '' }
      const jsFile = files['app.js'] || { content: '' }
      const cssFile = files['styles.css'] || { content: '' }

      let html = htmlFile.content

      // Inject CSS
      if (cssFile.content) {
        const styleTag = `<style>${cssFile.content}</style>`
        if (html.includes('</head>')) {
          html = html.replace('</head>', `${styleTag}</head>`)
        } else {
          html = `<style>${cssFile.content}</style>${html}`
        }
      }

      // Inject JS (replace script src references)
      if (jsFile.content) {
        const scriptTag = `<script>
          try {
            ${jsFile.content}
          } catch (error) {
            console.error('Runtime Error:', error);
            document.body.innerHTML = '<div style="padding: 20px; background: #fee; border: 1px solid #fcc; color: #c33; border-radius: 4px; margin: 20px;"><strong>Error:</strong> ' + error.message + '</div>' + document.body.innerHTML;
          }
        </script>`
        
        if (html.includes('</body>')) {
          // Replace existing script tags that reference app.js
          html = html.replace(/<script[^>]*src=["']app\.js["'][^>]*><\/script>/g, '')
          html = html.replace('</body>', `${scriptTag}</body>`)
        } else {
          html = html + scriptTag
        }
      }

      setError(null)
      return html
    } catch (err) {
      setError(err.message)
      return `<div style="padding: 20px; background: #fee; color: #c33;">
        <h3>Preview Error</h3>
        <p>${err.message}</p>
      </div>`
    }
  }

  useEffect(() => {
    if (iframeRef.current) {
      try {
        const html = generatePreviewHTML()
        const iframe = iframeRef.current
        
        // Use srcdoc instead of contentDocument to avoid CORS issues
        iframe.srcdoc = html
      } catch (err) {
        console.error('Preview Error:', err)
        setError(err.message)
      }
    }
  }, [files])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      if (iframeRef.current) {
        try {
          const html = generatePreviewHTML()
          iframeRef.current.srcdoc = html
        } catch (err) {
          console.error('Refresh Error:', err)
          setError(err.message)
        }
      }
      setIsRefreshing(false)
    }, 300)
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '40%', opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-l flex flex-col ${isDark ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'}`}
    >
      {/* Header */}
      <div className={`px-4 py-2 border-b flex items-center justify-between ${
        isDark ? 'bg-[#252526] border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span className="font-semibold text-sm">Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-1 rounded hover:bg-white/10 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh Preview"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Close Preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-start gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold">Preview Error</div>
            <div className="text-xs opacity-80">{error}</div>
          </div>
        </div>
      )}

      {/* Preview Frame */}
      <div className="flex-1 relative bg-white">
        <iframe
          ref={iframeRef}
          title="preview"
          sandbox="allow-scripts allow-modals"
          className="w-full h-full border-0"
        />
      </div>
    </motion.div>
  )
}
