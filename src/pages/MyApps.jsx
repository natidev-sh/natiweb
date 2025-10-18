import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '../auth/AuthContext.jsx'
import PageMeta from '../components/PageMeta.jsx'
import { 
  Folder, Calendar, Trash2, Edit2, ExternalLink, Github, 
  Database, Globe, Smartphone, MoreVertical, Search, Plus, Users, Check
} from 'lucide-react'

function formatDistanceToNow(date) {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${Math.floor(diffMonths / 12)}y ago`
}

export default function MyApps() {
  const { user } = useAuth()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [teams, setTeams] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    fetchApps()
    fetchTeams()
  }, [])

  async function fetchTeams() {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          team:teams(id, name)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (error) throw error
      
      const teamsList = data?.map(item => Array.isArray(item.team) ? item.team[0] : item.team).filter(Boolean) || []
      setTeams(teamsList)
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  async function fetchApps() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_apps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching apps:', error)
        // Check if table doesn't exist
        if (error.message?.includes('relation') || error.code === '42P01') {
          console.error('Table user_apps does not exist. Run the migration first!')
        }
        throw error
      }
      setApps(data || [])
      console.log(`Loaded ${data?.length || 0} apps from database`)
    } catch (error) {
      console.error('Error fetching apps:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRename(app) {
    setSelectedApp(app)
    setNewName(app.name)
    setIsRenameDialogOpen(true)
  }

  async function submitRename() {
    if (!selectedApp || !newName.trim()) return
    
    setRenaming(true)
    try {
      const { error } = await supabase
        .from('user_apps')
        .update({ name: newName, updated_at: new Date().toISOString() })
        .eq('id', selectedApp.id)

      if (error) throw error
      
      await fetchApps()
      setIsRenameDialogOpen(false)
      setSelectedApp(null)
    } catch (error) {
      console.error('Error renaming app:', error)
      alert('Failed to rename app')
    } finally {
      setRenaming(false)
    }
  }

  async function handleDelete(appId) {
    if (!confirm('Are you sure you want to delete this app? This action cannot be undone.')) {
      return
    }
    
    setDeleting(appId)
    try {
      const { error } = await supabase
        .from('user_apps')
        .delete()
        .eq('id', appId)

      if (error) throw error

      setApps(apps.filter(app => app.id !== appId))
    } catch (error) {
      console.error('Error deleting app:', error)
      alert('Failed to delete app')
    } finally {
      setDeleting(null)
    }
  }

  function handleShare(app) {
    setSelectedApp(app)
    setSelectedTeamId(teams[0]?.id || '')
    setIsShareDialogOpen(true)
  }

  async function shareWithTeam() {
    if (!selectedTeamId || !selectedApp) return
    
    setSharing(true)
    try {
      const { error } = await supabase
        .from('team_apps')
        .insert({
          team_id: selectedTeamId,
          app_id: selectedApp.id,
          shared_by: user.id
        })

      if (error) {
        if (error.code === '23505') { // Unique violation
          alert('This app is already shared with this team')
        } else {
          throw error
        }
      } else {
        alert('App shared with team successfully!')
        setIsShareDialogOpen(false)
      }
    } catch (error) {
      console.error('Error sharing app:', error)
      alert('Failed to share app: ' + error.message)
    } finally {
      setSharing(false)
    }
  }

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <PageMeta
        title="My Apps | Nati.dev"
        description="View and manage your AI apps synced from the desktop"
      />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Apps</h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              Apps synced from your Nati Desktop
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Folder className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{apps.length}</p>
                <p className="text-sm text-[var(--muted-foreground)]">Total Apps</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Github className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{apps.filter(a => a.github_repo).length}</p>
                <p className="text-sm text-[var(--muted-foreground)]">With GitHub</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Database className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{apps.filter(a => a.supabase_project_id).length}</p>
                <p className="text-sm text-[var(--muted-foreground)]">With Database</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-[var(--muted)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 border border-[var(--border)] rounded-lg">
            <Folder className="h-12 w-12 mx-auto mb-3 text-[var(--muted-foreground)] opacity-50" />
            <h3 className="font-semibold mb-1">
              {searchQuery ? 'No Apps Found' : 'No Apps Synced Yet'}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              {searchQuery ? 'Try a different search term' : 'Your apps will appear here once synced from the desktop app'}
            </p>
            {!searchQuery && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-left max-w-md mx-auto">
                  <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold mb-2">
                    To sync your apps:
                  </p>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Open Nati Desktop app</li>
                    <li>Make sure you're logged in</li>
                    <li>Wait 30 seconds for automatic sync</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
                <a
                  href="/download"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Download Desktop App
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="p-5 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] hover:bg-[var(--muted)] transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{app.name}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">{app.path}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="p-1 rounded-md hover:bg-[var(--muted)] transition-colors opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Could implement a dropdown menu here
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Integrations */}
                <div className="flex items-center gap-2 mb-3">
                  {app.github_repo && (
                    <a
                      href={`https://github.com/${app.github_repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md bg-[var(--muted)] hover:bg-[var(--border)] transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {app.supabase_project_id && (
                    <div
                      className="p-1.5 rounded-md bg-[var(--muted)]"
                      title="Supabase Connected"
                    >
                      <Database className="h-3.5 w-3.5 text-green-500" />
                    </div>
                  )}
                  {app.vercel_project_id && (
                    <div
                      className="p-1.5 rounded-md bg-[var(--muted)]"
                      title="Vercel Connected"
                    >
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                  )}
                  {app.is_capacitor && (
                    <div
                      className="p-1.5 rounded-md bg-[var(--muted)]"
                      title="Capacitor App"
                    >
                      <Smartphone className="h-3.5 w-3.5 text-purple-500" />
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(app.created_at)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {teams.length > 0 && (
                    <button
                      onClick={() => handleShare(app)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-sm"
                      title="Share with Team"
                    >
                      <Users className="h-3.5 w-3.5" />
                      Share
                    </button>
                  )}
                  <button
                    onClick={() => handleRename(app)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-sm"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Rename
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    disabled={deleting === app.id}
                    className="px-3 py-2 rounded-md border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors text-sm disabled:opacity-50"
                  >
                    {deleting === app.id ? (
                      <div className="h-3.5 w-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/10">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 How App Syncing Works</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p>
              <strong>Apps are stored permanently</strong> - Once synced from your desktop app, they stay in the cloud forever. 
              You can view them here anytime, even when your desktop app is closed.
            </p>
            <p>
              <strong>Auto-sync:</strong> When your desktop app is running and you're logged in, apps sync automatically every 5 minutes. 
              Any changes you make on the web (like renaming) sync back to your desktop.
            </p>
          </div>
        </div>
      </div>

      {/* Rename Dialog */}
      {isRenameDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsRenameDialogOpen(false)}>
          <div className="bg-[var(--background)] rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Rename App</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] mb-4"
              placeholder="App name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && submitRename()}
            />
            <div className="flex gap-3">
              <button
                onClick={submitRename}
                disabled={renaming || !newName.trim()}
                className="flex-1 px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {renaming ? 'Renaming...' : 'Rename'}
              </button>
              <button
                onClick={() => setIsRenameDialogOpen(false)}
                className="px-4 py-2 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share with Team Dialog */}
      {isShareDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsShareDialogOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Share with Team</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Make this app accessible to your team
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">App:</p>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="font-medium">{selectedApp?.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{selectedApp?.path}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block">Select Team</label>
              {teams.length === 0 ? (
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You're not a member of any teams. Create or join a team first.
                  </p>
                </div>
              ) : (
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Team members will be able to view and access this app's information including integrations.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={shareWithTeam}
                disabled={sharing || teams.length === 0 || !selectedTeamId}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                {sharing ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Share with Team
                  </>
                )}
              </button>
              <button
                onClick={() => setIsShareDialogOpen(false)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
