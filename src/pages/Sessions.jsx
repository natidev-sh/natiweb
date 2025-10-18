import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Monitor, Smartphone, Globe, Trash2, CheckCircle, Clock } from 'lucide-react'
import PageMeta from '../components/PageMeta.jsx'

export default function Sessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState(null)
  const [showAllPrevious, setShowAllPrevious] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  async function fetchSessions() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_active_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (e) {
      console.error('Error fetching sessions:', e)
    } finally {
      setLoading(false)
    }
  }

  async function revokeSession(sessionId) {
    setRevoking(sessionId)
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false, revoked_at: new Date().toISOString() })
        .eq('id', sessionId)

      if (error) throw error
      await fetchSessions()
    } catch (e) {
      console.error('Error revoking session:', e)
    } finally {
      setRevoking(null)
    }
  }

  function getDeviceIcon(deviceType) {
    switch (deviceType) {
      case 'desktop_app':
        return <Monitor className="h-5 w-5" />
      case 'mobile':
        return <Smartphone className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  function getDeviceName(session) {
    if (session.device_type === 'desktop_app') {
      return `Nati Desktop (${session.device_os || 'Unknown OS'})`
    }
    return session.device_name || 'Web Browser'
  }

  function formatLastActive(timestamp) {
    const now = new Date()
    const lastActive = new Date(timestamp)
    const diffMs = now - lastActive
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 5) return 'Active now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return lastActive.toLocaleDateString()
  }

  const activeSessions = sessions.filter(s => s.is_active)
  const inactiveSessions = sessions.filter(s => !s.is_active)
  
  // Get authorized devices (unique devices that have been used multiple times)
  const deviceMap = {}
  sessions.forEach(session => {
    const key = `${session.device_type}-${session.device_os}`
    if (!deviceMap[key]) {
      deviceMap[key] = {
        device_type: session.device_type,
        device_os: session.device_os,
        device_name: session.device_name,
        count: 0,
        lastUsed: session.last_active_at,
        isActive: false,
      }
    }
    deviceMap[key].count++
    if (session.is_active) {
      deviceMap[key].isActive = true
    }
    if (new Date(session.last_active_at) > new Date(deviceMap[key].lastUsed)) {
      deviceMap[key].lastUsed = session.last_active_at
    }
  })
  const authorizedDevices = Object.values(deviceMap).filter(d => d.count > 1)

  return (
    <>
      <PageMeta
        title="Sessions | Nati.dev"
        description="Manage your logged in devices and sessions"
      />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Sessions</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage devices and applications where you're logged in
          </p>
        </div>

        {/* Active Sessions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Active Sessions ({activeSessions.length})
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-[var(--muted)] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : activeSessions.length === 0 ? (
            <div className="text-center py-8 border border-[var(--border)] rounded-lg">
              <p className="text-[var(--muted-foreground)]">No active sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSessions.map(session => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                        {getDeviceIcon(session.device_type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{getDeviceName(session)}</h3>
                        <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatLastActive(session.last_active_at)}
                          </span>
                          {session.ip_address && (
                            <span>IP: {session.ip_address}</span>
                          )}
                          {session.location && (
                            <span>{session.location}</span>
                          )}
                        </div>
                        {session.is_current && (
                          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">
                            Current Session
                          </span>
                        )}
                      </div>
                    </div>
                    {!session.is_current && (
                      <button
                        onClick={() => revokeSession(session.id)}
                        disabled={revoking === session.id}
                        className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 text-[var(--muted-foreground)] hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Revoke session"
                      >
                        {revoking === session.id ? (
                          <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Authorized Devices */}
        {authorizedDevices.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-500" />
              Authorized Devices ({authorizedDevices.length})
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Devices you've used multiple times to access your account
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {authorizedDevices.map((device, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white ${
                      device.isActive 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}>
                      {getDeviceIcon(device.device_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{getDeviceName(device)}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                          {device.count} {device.count === 1 ? 'session' : 'sessions'}
                        </span>
                        {device.isActive && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        Last used {formatLastActive(device.lastUsed)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous Sessions */}
        {inactiveSessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--muted-foreground)]">
                Previous Sessions ({inactiveSessions.length})
              </h2>
              {inactiveSessions.length > 5 && (
                <button
                  onClick={() => setShowAllPrevious(!showAllPrevious)}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  {showAllPrevious ? 'Show less' : `Show all ${inactiveSessions.length}`}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {(showAllPrevious ? inactiveSessions : inactiveSessions.slice(0, 5)).map(session => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)]">
                      {getDeviceIcon(session.device_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{getDeviceName(session)}</h3>
                      <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.revoked_at ? `Revoked ${formatLastActive(session.revoked_at)}` : `Last active ${formatLastActive(session.last_active_at)}`}
                        </span>
                        {session.ip_address && (
                          <span>IP: {session.ip_address}</span>
                        )}
                        {session.location && (
                          <span>{session.location}</span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                          {session.revoked_at ? 'Revoked' : 'Expired'}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          Created {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/10">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Security Tip</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            If you see a session you don't recognize, revoke it immediately and change your password. 
            Sessions are automatically logged when you sign in from the desktop app or web browser.
          </p>
        </div>
      </div>
    </>
  )
}
