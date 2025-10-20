import React from 'react'
import { FileCode, FileJson, Palette } from 'lucide-react'

const getFileIcon = (fileName) => {
  if (fileName.endsWith('.html')) return <FileCode className="h-4 w-4 text-orange-500" />
  if (fileName.endsWith('.js')) return <FileCode className="h-4 w-4 text-yellow-500" />
  if (fileName.endsWith('.css')) return <Palette className="h-4 w-4 text-blue-500" />
  if (fileName.endsWith('.json')) return <FileJson className="h-4 w-4 text-green-500" />
  return <FileCode className="h-4 w-4" />
}

export default function FileExplorer({ files, activeFile, onSelectFile, isDark }) {
  return (
    <div className={`w-64 border-r flex-shrink-0 ${isDark ? 'bg-[#252526] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
      <div className={`px-4 py-3 font-semibold text-sm border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        FILES
      </div>
      <div className="py-2">
        {Object.values(files).map((file) => (
          <button
            key={file.name}
            onClick={() => onSelectFile(file.name)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
              activeFile === file.name
                ? isDark
                  ? 'bg-[#37373d] text-white'
                  : 'bg-blue-50 text-blue-900'
                : isDark
                ? 'hover:bg-[#2a2d2e] text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {getFileIcon(file.name)}
            <span>{file.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
