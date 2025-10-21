import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '../auth/AuthContext.jsx'
import { TrendingUp, Zap, DollarSign, Activity, BarChart3, Clock, ArrowUp, ArrowDown, Sparkles, Calendar, X } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Analytics() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [tempDateRange, setTempDateRange] = useState(dateRange)
  const [analytics, setAnalytics] = useState({
    totalTokens: 0,
    totalCost: 0,
    totalRequests: 0,
    avgResponseTime: 0,
    modelBreakdown: [],
    dailyUsage: [],
    topProjects: [],
    providers: [],
    trends: {
      tokensTrend: 0,
      costTrend: 0,
      requestsTrend: 0,
      responseTrend: 0
    }
  })

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  async function fetchAnalytics() {
    setLoading(true)
    try {
      if (!user) return

      // Use selected date range
      const startDate = new Date(dateRange.startDate)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(dateRange.endDate)
      endDate.setHours(23, 59, 59, 999)

      // Calculate previous period for comparison (same length as selected range)
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      const previousStart = new Date(startDate)
      previousStart.setDate(previousStart.getDate() - daysDiff)
      const previousEnd = new Date(startDate)
      previousEnd.setSeconds(previousEnd.getSeconds() - 1)

      // Fetch all API usage data for selected period
      const { data: allUsage, error: usageError } = await supabase
        .from('api_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'success')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      // Fetch previous period data for comparison
      const { data: lastMonthUsage } = await supabase
        .from('api_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'success')
        .gte('created_at', previousStart.toISOString())
        .lte('created_at', previousEnd.toISOString())

      if (usageError) {
        console.error('Error fetching API usage:', usageError)
        // Table might not exist yet
        throw usageError
      }

      // Calculate stats manually for selected period
      const overallStats = {
        total_tokens: allUsage?.reduce((sum, row) => sum + (row.total_tokens || 0), 0) || 0,
        total_cost: allUsage?.reduce((sum, row) => sum + (parseFloat(row.cost) || 0), 0) || 0,
        total_requests: allUsage?.length || 0,
        avg_response_time: allUsage?.length > 0 
          ? allUsage.reduce((sum, row) => sum + (row.response_time_ms || 0), 0) / allUsage.length 
          : 0
      }

      // Calculate previous period stats for comparison
      const lastMonthStats = {
        total_tokens: lastMonthUsage?.reduce((sum, row) => sum + (row.total_tokens || 0), 0) || 0,
        total_cost: lastMonthUsage?.reduce((sum, row) => sum + (parseFloat(row.cost) || 0), 0) || 0,
        total_requests: lastMonthUsage?.length || 0,
        avg_response_time: lastMonthUsage?.length > 0
          ? lastMonthUsage.reduce((sum, row) => sum + (row.response_time_ms || 0), 0) / lastMonthUsage.length
          : 0
      }

      // Calculate percentage trends
      const calculateTrend = (current, previous) => {
        if (!previous || previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100)
      }

      const trends = {
        tokensTrend: calculateTrend(overallStats.total_tokens, lastMonthStats.total_tokens),
        costTrend: calculateTrend(overallStats.total_cost, lastMonthStats.total_cost),
        requestsTrend: calculateTrend(overallStats.total_requests, lastMonthStats.total_requests),
        responseTrend: -calculateTrend(overallStats.avg_response_time, lastMonthStats.avg_response_time) // Negative because lower is better
      }

      // Helper function to get provider name from model (defined before use)
      const getProviderFromModel = (modelName) => {
        const lowerModel = modelName.toLowerCase()
        if (lowerModel.includes('gpt') || lowerModel.includes('openai')) return 'OpenAI'
        if (lowerModel.includes('claude') || lowerModel.includes('anthropic')) return 'Anthropic'
        if (lowerModel.includes('gemini') || lowerModel.includes('google')) return 'Google'
        if (lowerModel.includes('llama') || lowerModel.includes('ollama')) return 'Ollama'
        if (lowerModel.includes('turbo')) return 'Nati'
        return 'Other'
      }

      // Calculate daily usage from allUsage data with provider breakdown
      const dailyMap = {}
      allUsage?.forEach(row => {
        const date = new Date(row.created_at).toDateString()
        if (!dailyMap[date]) {
          dailyMap[date] = { tokens: 0, cost: 0, requests: 0, byProvider: {} }
        }
        dailyMap[date].tokens += row.total_tokens || 0
        dailyMap[date].cost += parseFloat(row.cost) || 0
        dailyMap[date].requests += 1
        
        // Track tokens per provider
        const provider = getProviderFromModel(row.model)
        if (!dailyMap[date].byProvider[provider]) {
          dailyMap[date].byProvider[provider] = 0
        }
        dailyMap[date].byProvider[provider] += row.total_tokens || 0
      })

      const dailyData = Object.entries(dailyMap).map(([date, data]) => ({
        date: new Date(date),
        tokens: data.tokens,
        cost: data.cost,
        requests: data.requests,
        ...data.byProvider // Spread provider-specific data
      })).sort((a, b) => a.date - b.date)

      // Model breakdown from allUsage
      const modelData = allUsage

      // Aggregate by model
      const modelBreakdown = {}
      
      // Helper function to get logo and colors based on model name
      const getModelInfo = (modelName) => {
        const lowerModel = modelName.toLowerCase()
        
        if (lowerModel.includes('gpt') || lowerModel.includes('openai')) {
          return {
            gradient: 'from-emerald-500 to-teal-600',
            logo: '/assets/ai-logos/openai-logo.svg',
            color: '#10b981'
          }
        } else if (lowerModel.includes('claude') || lowerModel.includes('anthropic')) {
          return {
            gradient: 'from-orange-500 to-amber-600',
            logo: '/assets/ai-logos/anthropic-logo.svg',
            color: '#f97316'
          }
        } else if (lowerModel.includes('gemini') || lowerModel.includes('google')) {
          return {
            gradient: 'from-blue-500 to-indigo-600',
            logo: '/assets/ai-logos/google-gemini-logo.svg',
            color: '#3b82f6'
          }
        } else if (lowerModel.includes('llama') || lowerModel.includes('ollama')) {
          return {
            gradient: 'from-gray-700 to-gray-900',
            logo: '/assets/ai-logos/ollama-logo.svg',
            color: '#374151'
          }
        } else {
          return {
            gradient: 'from-purple-500 to-pink-600',
            logo: '/assets/ai-logos/nati-logo.svg',
            color: '#a855f7'
          }
        }
      }

      modelData?.forEach(row => {
        const modelKey = row.model.toLowerCase()
        if (!modelBreakdown[modelKey]) {
          modelBreakdown[modelKey] = {
            model: row.model,
            tokens: 0,
            cost: 0,
            requests: 0,
            ...getModelInfo(row.model)
          }
        }
        modelBreakdown[modelKey].tokens += row.total_tokens || 0
        modelBreakdown[modelKey].cost += parseFloat(row.cost || 0)
        modelBreakdown[modelKey].requests += 1
      })

      // Calculate top projects from allUsage
      const projectBreakdown = {}
      allUsage?.forEach(row => {
        if (!row.project_name) return
        if (!projectBreakdown[row.project_name]) {
          projectBreakdown[row.project_name] = {
            name: row.project_name,
            tokens: 0,
            cost: 0,
            requests: 0
          }
        }
        projectBreakdown[row.project_name].tokens += row.total_tokens || 0
        projectBreakdown[row.project_name].cost += parseFloat(row.cost || 0)
        projectBreakdown[row.project_name].requests += 1
      })

      // Convert daily data to format for UI (keep chronological order - oldest to newest)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const formattedDaily = (dailyData || []).map(day => {
        const dayData = {
          date: days[new Date(day.date).getDay()],
          tokens: parseInt(day.tokens) || 0,
          cost: parseFloat(day.cost) || 0
        }
        // Add provider-specific data
        Object.keys(day).forEach(key => {
          if (!['date', 'tokens', 'cost', 'requests'].includes(key)) {
            dayData[key] = day[key]
          }
        })
        return dayData
      })
      
      // Get unique providers for the graph
      const uniqueProviders = new Set()
      allUsage?.forEach(row => {
        uniqueProviders.add(getProviderFromModel(row.model))
      })

      setAnalytics({
        totalTokens: parseInt(overallStats.total_tokens) || 0,
        totalCost: parseFloat(overallStats.total_cost) || 0,
        totalRequests: parseInt(overallStats.total_requests) || 0,
        avgResponseTime: parseFloat(overallStats.avg_response_time) / 1000 || 0, // Convert ms to seconds
        modelBreakdown: Object.values(modelBreakdown).sort((a, b) => b.tokens - a.tokens),
        dailyUsage: formattedDaily,
        topProjects: Object.values(projectBreakdown).sort((a, b) => b.tokens - a.tokens).slice(0, 5),
        trends,
        providers: Array.from(uniqueProviders)
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Fallback to empty data
      setAnalytics({
        totalTokens: 0,
        totalCost: 0,
        totalRequests: 0,
        avgResponseTime: 0,
        modelBreakdown: [],
        dailyUsage: [],
        topProjects: [],
        providers: [],
        trends: {
          tokensTrend: 0,
          costTrend: 0,
          requestsTrend: 0,
          responseTrend: 0
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, subtitle, trend }) => (
    <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[var(--muted-foreground)] mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && (
            <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
              {trend && (
                <span className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {trend > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(trend)}%
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )

  const handlePresetSelect = (preset) => {
    const now = new Date()
    let startDate, endDate = new Date()
    
    switch(preset) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        return
    }
    
    const newRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
    
    setTempDateRange(newRange)
    setDateRange(newRange)
    setIsDatePickerOpen(false)
  }

  const handleApplyDateRange = () => {
    setDateRange(tempDateRange)
    setIsDatePickerOpen(false)
  }

  const handleCancelDateRange = () => {
    setTempDateRange(dateRange)
    setIsDatePickerOpen(false)
  }

  const formatDateRange = () => {
    const start = new Date(dateRange.startDate)
    const end = new Date(dateRange.endDate)
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-[var(--muted)] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const maxTokens = Math.max(...analytics.dailyUsage.map(d => d.tokens))

  return (
    <div className="space-y-6">
      {/* Date Range Picker Button */}
      <div className="flex items-center justify-between relative">
        <div>
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{formatDateRange()}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Change Date Range</span>
          </button>
          
          {/* Modern Date Range Picker Dropdown */}
          {isDatePickerOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={handleCancelDateRange} />
              
              {/* Dropdown Panel */}
              <div className="absolute right-0 top-full mt-2 z-50 bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200" style={{width: '700px'}}>
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-semibold">Select Date Range</h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">Choose a preset or pick custom dates</p>
              </div>
              <button
                onClick={handleCancelDateRange}
                className="h-10 w-10 rounded-lg hover:bg-[var(--muted)] flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex">
              {/* Quick Presets Sidebar */}
              <div className="w-48 p-4 border-r border-[var(--border)] bg-[var(--background-darkest)]">
                <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Quick Select</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handlePresetSelect('24h')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                  >
                    Last 24 hours
                  </button>
                  <button
                    onClick={() => handlePresetSelect('7d')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                  >
                    Last 7 days
                  </button>
                  <button
                    onClick={() => handlePresetSelect('30d')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                  >
                    Last 30 days
                  </button>
                  <button
                    onClick={() => handlePresetSelect('90d')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                  >
                    Last 90 days
                  </button>
                  <button
                    onClick={() => handlePresetSelect('thisMonth')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                  >
                    This month
                  </button>
                  <button
                    onClick={() => handlePresetSelect('lastMonth')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                  >
                    Last month
                  </button>
                  <button
                    onClick={() => handlePresetSelect('thisYear')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                  >
                    This year
                  </button>
                </div>
              </div>
              
              {/* Custom Date Picker */}
              <div className="flex-1 p-6">
                <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Custom Range</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={tempDateRange.startDate}
                      onChange={(e) => setTempDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      max={tempDateRange.endDate}
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={tempDateRange.endDate}
                      onChange={(e) => setTempDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      min={tempDateRange.startDate}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow"
                    />
                  </div>
                </div>
                
                {/* Selected Range Preview */}
                <div className="mt-6 p-4 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
                    <span className="font-medium">Selected Range:</span>
                    <span className="text-[var(--muted-foreground)]">
                      {new Date(tempDateRange.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' '}-{' '}
                      {new Date(tempDateRange.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="ml-auto text-[var(--muted-foreground)]">
                      ({Math.ceil((new Date(tempDateRange.endDate) - new Date(tempDateRange.startDate)) / (1000 * 60 * 60 * 24)) + 1} days)
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCancelDateRange}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyDateRange}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white hover:opacity-90 transition-opacity text-sm font-medium shadow-md"
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            </div>
          </div>
              </>
            )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tokens"
          value={
            analytics.totalTokens >= 1000000 
              ? `${(analytics.totalTokens / 1000000).toFixed(1)}M`
              : analytics.totalTokens >= 1000
                ? `${(analytics.totalTokens / 1000).toFixed(1)}K`
                : analytics.totalTokens.toString()
          }
          icon={Zap}
          subtitle="selected period"
          trend={analytics.trends.tokensTrend}
        />
        <StatCard
          title="Total Cost"
          value={`$${analytics.totalCost.toFixed(2)}`}
          icon={DollarSign}
          subtitle="selected period"
          trend={analytics.trends.costTrend}
        />
        <StatCard
          title="API Requests"
          value={analytics.totalRequests.toLocaleString()}
          icon={Activity}
          subtitle="selected period"
          trend={analytics.trends.requestsTrend}
        />
        <StatCard
          title="Avg Response Time"
          value={`${analytics.avgResponseTime.toFixed(2)}s`}
          icon={Clock}
          subtitle="across all models"
          trend={analytics.trends.responseTrend}
        />
      </div>

      {/* Daily Usage Chart with Modern Graph */}
      <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Token Usage Over Time</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Daily breakdown by AI provider</p>
          </div>
          <BarChart3 className="h-5 w-5 text-[var(--muted-foreground)]" />
        </div>
        
        {/* Modern Recharts Graph with per-provider lines */}
        <div className="h-72 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.dailyUsage}>
              <defs>
                <linearGradient id="colorOpenAI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAnthropic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOllama" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNati" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--muted-foreground)"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [`${(value / 1000).toFixed(1)}K tokens`, name]}
              />
              {analytics.providers?.includes('OpenAI') && (
                <Area 
                  type="monotone" 
                  dataKey="OpenAI" 
                  name="OpenAI"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#colorOpenAI)"
                  animationDuration={1000}
                />
              )}
              {analytics.providers?.includes('Anthropic') && (
                <Area 
                  type="monotone" 
                  dataKey="Anthropic" 
                  name="Anthropic"
                  stroke="#f97316" 
                  strokeWidth={2}
                  fill="url(#colorAnthropic)"
                  animationDuration={1000}
                />
              )}
              {analytics.providers?.includes('Google') && (
                <Area 
                  type="monotone" 
                  dataKey="Google" 
                  name="Google"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorGoogle)"
                  animationDuration={1000}
                />
              )}
              {analytics.providers?.includes('Ollama') && (
                <Area 
                  type="monotone" 
                  dataKey="Ollama" 
                  name="Ollama"
                  stroke="#6b7280" 
                  strokeWidth={2}
                  fill="url(#colorOllama)"
                  animationDuration={1000}
                />
              )}
              {analytics.providers?.includes('Nati') && (
                <Area 
                  type="monotone" 
                  dataKey="Nati" 
                  name="Nati"
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fill="url(#colorNati)"
                  animationDuration={1000}
                />
              )}
              {analytics.providers?.includes('Other') && (
                <Area 
                  type="monotone" 
                  dataKey="Other" 
                  name="Other"
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fill="url(#colorOther)"
                  animationDuration={1000}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Breakdown with AI Logos */}
      <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Usage by AI Model</h3>
          <Sparkles className="h-5 w-5 text-[var(--muted-foreground)]" />
        </div>
        <div className="space-y-4">
          {analytics.modelBreakdown.map((model, idx) => {
            const tokenPercent = (model.tokens / analytics.totalTokens) * 100
            return (
              <div key={idx} className="group p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${model.gradient} flex items-center justify-center p-2 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <img 
                        src={model.logo} 
                        alt={model.model}
                        className="w-full h-full object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-base">{model.model}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{model.requests.toLocaleString()} requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${model.cost.toFixed(2)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{(model.tokens / 1000).toFixed(0)}K tokens</p>
                  </div>
                </div>
                <div className="relative w-full h-3 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${model.gradient} transition-all duration-700 rounded-full shadow-sm`}
                    style={{ width: `${tokenPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-[var(--muted-foreground)] text-right">
                  {tokenPercent.toFixed(1)}% of total usage
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Projects */}
      <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
        <h3 className="text-lg font-semibold mb-4">Top Projects by Token Usage</h3>
        <div className="space-y-3">
          {analytics.topProjects.map((project, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{project.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <span>{(project.tokens / 1000).toFixed(0)}K tokens</span>
                    <span>•</span>
                    <span>${project.cost.toFixed(2)}</span>
                    <span>•</span>
                    <span>{project.requests} requests</span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs">
                  #{idx + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Optimization Tips */}
      <div className="p-6 rounded-lg border border-blue-500/20 bg-blue-500/10">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Cost Optimization Tips</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Consider using GPT-3.5 for simpler tasks to save up to 40% on costs</li>
              <li>• Enable caching for common prompts to reduce redundant API calls</li>
              <li>• Use smaller context windows when possible to minimize token usage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {analytics.totalRequests === 0 && (
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            📊 <strong>No data yet!</strong> Start using AI models from your desktop app to see analytics here.
          </p>
        </div>
      )}
    </div>
  )
}
