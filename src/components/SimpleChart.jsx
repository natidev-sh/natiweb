import React from 'react'

export function SimpleLineChart({ data, height = 150 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
        No data available
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.value), 1)
  const min = 0 // Always start from 0 for better visual
  const range = max || 1
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    // Map value to Y position: 0 value = bottom (y=85), max value = top (y=15)
    const y = 85 - ((d.value / range) * 70)
    return { x, y, value: d.value, label: d.label }
  })
  
  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ')

  return (
    <div className="relative w-full space-y-2">
      {/* Chart */}
      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(99, 102, 241)', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: 'rgb(99, 102, 241)', stopOpacity: 0 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line 
              key={y}
              x1="0" 
              y1={y} 
              x2="100" 
              y2={y} 
              stroke="currentColor" 
              strokeWidth="0.2" 
              opacity="0.1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={`M ${points[0].x} 85 L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${points[points.length - 1].x} 85 Z`}
            fill="url(#areaGradient)"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            style={{ transition: 'all 0.3s ease' }}
          />
          
          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="2"
                fill="white"
                stroke="rgb(99, 102, 241)"
                strokeWidth="2"
                style={{ transition: 'all 0.3s ease' }}
                className="hover:r-3"
              />
            </g>
          ))}
        </svg>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between px-1">
        {data.map((d, i) => (
          <div key={i} className="text-xs text-center text-muted-foreground font-medium">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SimpleBarChart({ data, height = 150 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
        No data available
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.value), 1)
  const colors = [
    'from-blue-500 to-blue-600',
    'from-yellow-500 to-yellow-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-gray-500 to-gray-600',
  ]

  return (
    <div className="relative w-full space-y-4">
      {/* Bars */}
      <div className="flex items-end justify-around gap-3" style={{ height }}>
        {data.map((d, i) => {
          const barHeight = max > 0 ? (d.value / max) * 100 : 5
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              {/* Value label on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  {d.value}
                </span>
              </div>
              
              {/* Bar */}
              <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                <div
                  className={`w-full bg-gradient-to-t ${colors[i % colors.length]} rounded-t-lg shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105`}
                  style={{ 
                    height: `${barHeight}%`,
                    minHeight: '4px'
                  }}
                  title={`${d.label}: ${d.value}`}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Labels */}
      <div className="flex justify-around gap-3">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <div className="text-xs font-medium text-muted-foreground">{d.label}</div>
            <div className="text-lg font-bold mt-1">{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MiniSparkline({ data, color = 'primary' }) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100" height="30" viewBox="0 0 100 100" preserveAspectRatio="none" className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`text-${color}`}
      />
    </svg>
  )
}
