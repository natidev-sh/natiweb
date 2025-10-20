import React, { useRef, useEffect } from 'react'
import { FileCode } from 'lucide-react'

export default function CodeEditor({ file, onChange, isDark }) {
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [file?.content])

  // Handle tab key
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newValue = file.content.substring(0, start) + '  ' + file.content.substring(end)
      onChange(newValue)
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      }, 0)
    }
  }

  if (!file) {
    return (
      <div className={`flex-1 flex items-center justify-center ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className="text-center text-gray-500">
          <FileCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Select a file to edit</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 flex flex-col ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      {/* Editor Header */}
      <div className={`px-4 py-2 border-b flex items-center gap-2 text-sm ${
        isDark ? 'bg-[#252526] border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <FileCode className="h-4 w-4" />
        <span className="font-semibold">{file.name}</span>
        <span className={`ml-auto text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {file.language.toUpperCase()}
        </span>
      </div>

      {/* Code Area */}
      <div className="flex-1 relative overflow-auto">
        <textarea
          ref={textareaRef}
          value={file.content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className={`w-full h-full p-4 resize-none outline-none font-mono text-sm leading-relaxed ${
            isDark 
              ? 'bg-[#1e1e1e] text-gray-300' 
              : 'bg-white text-gray-900'
          }`}
          style={{
            minHeight: '100%',
            tabSize: 2,
          }}
        />
      </div>

      {/* Status Bar */}
      <div className={`px-4 py-1 text-xs border-t flex items-center justify-between ${
        isDark ? 'bg-[#007acc] text-white border-white/10' : 'bg-blue-600 text-white border-blue-700'
      }`}>
        <span>Lines: {file.content.split('\n').length}</span>
        <span>Characters: {file.content.length}</span>
      </div>
    </div>
  )
}
