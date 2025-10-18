import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '../auth/AuthContext.jsx'
import { TrendingUp, Zap, DollarSign, Activity, BarChart3, Clock, ArrowUp, ArrowDown, Sparkles } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Analytics() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalTokens: 0,
    totalCost: 0,
    totalRequests: 0,
    avgResponseTime: 0,
    modelBreakdown: [],
    dailyUsage: [],
    topProjects: [],
    trends: {
      tokensTrend: 0,
      costTrend: 0,
      requestsTrend: 0,
      responseTrend: 0
    }
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    setLoading(true)
    try {
      if (!user) return

      // Fetch current month data
      const now = new Date()
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

      // Fetch all API usage data for current month
      const { data: allUsage, error: usageError } = await supabase
        .from('api_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'success')
        .gte('created_at', currentMonthStart.toISOString())

      // Fetch previous month data for comparison
      const { data: lastMonthUsage } = await supabase
        .from('api_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'success')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString())

      if (usageError) {
        console.error('Error fetching API usage:', usageError)
        // Table might not exist yet
        throw usageError
      }

      // Calculate stats manually for current month
      const overallStats = {
        total_tokens: allUsage?.reduce((sum, row) => sum + (row.total_tokens || 0), 0) || 0,
        total_cost: allUsage?.reduce((sum, row) => sum + (parseFloat(row.cost) || 0), 0) || 0,
        total_requests: allUsage?.length || 0,
        avg_response_time: allUsage?.length > 0 
          ? allUsage.reduce((sum, row) => sum + (row.response_time_ms || 0), 0) / allUsage.length 
          : 0
      }

      // Calculate last month stats for comparison
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

      // Calculate daily usage from allUsage data
      const dailyMap = {}
      allUsage?.forEach(row => {
        const date = new Date(row.created_at).toDateString()
        if (!dailyMap[date]) {
          dailyMap[date] = { tokens: 0, cost: 0, requests: 0 }
        }
        dailyMap[date].tokens += row.total_tokens || 0
        dailyMap[date].cost += parseFloat(row.cost) || 0
        dailyMap[date].requests += 1
      })

      const dailyData = Object.entries(dailyMap).map(([date, data]) => ({
        date: new Date(date),
        ...data
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

      // Convert daily data to format for UI
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const formattedDaily = (dailyData || []).map(day => ({
        date: days[new Date(day.date).getDay()],
        tokens: parseInt(day.tokens) || 0,
        cost: parseFloat(day.cost) || 0
      })).reverse()

      setAnalytics({
        totalTokens: parseInt(overallStats.total_tokens) || 0,
        totalCost: parseFloat(overallStats.total_cost) || 0,
        totalRequests: parseInt(overallStats.total_requests) || 0,
        avgResponseTime: parseFloat(overallStats.avg_response_time) / 1000 || 0, // Convert ms to seconds
        modelBreakdown: Object.values(modelBreakdown).sort((a, b) => b.tokens - a.tokens),
        dailyUsage: formattedDaily,
        topProjects: Object.values(projectBreakdown).sort((a, b) => b.tokens - a.tokens).slice(0, 5),
        trends
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
          subtitle="this month"
          trend={analytics.trends.tokensTrend}
        />
        <StatCard
          title="Total Cost"
          value={`$${analytics.totalCost.toFixed(2)}`}
          icon={DollarSign}
          subtitle="this month"
          trend={analytics.trends.costTrend}
        />
        <StatCard
          title="API Requests"
          value={analytics.totalRequests.toLocaleString()}
          icon={Activity}
          subtitle="this month"
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
            <h3 className="text-lg font-semibold">Token Usage This Week</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Daily breakdown of token consumption</p>
          </div>
          <BarChart3 className="h-5 w-5 text-[var(--muted-foreground)]" />
        </div>
        
        {/* Modern Recharts Graph */}
        <div className="h-72 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.dailyUsage}>
              <defs>
                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                formatter={(value) => [`${(value / 1000).toFixed(1)}K tokens`, 'Tokens']}
              />
              <Area 
                type="monotone" 
                dataKey="tokens" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fill="url(#colorTokens)"
                animationDuration={1000}
              />
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
