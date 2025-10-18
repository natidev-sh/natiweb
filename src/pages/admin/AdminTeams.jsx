import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { 
  Users, Trash2, Ban, Search, MoreVertical, Eye, 
  AlertCircle, Shield, Crown, Edit3, Calendar, Activity,
  CheckCircle, XCircle, Loader2
} from 'lucide-react'

export default function AdminTeams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchTeams()
  }, [])

  async function fetchTeams() {
    setLoading(true)
    try {
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false })

      if (teamsError) throw teamsError

      // Fetch all team members counts
      const teamIds = teamsData.map(t => t.id)
      
      const { data: membersData } = await supabase
        .from('team_members')
        .select('team_id')
        .in('team_id', teamIds)

      const { data: appsData } = await supabase
        .from('team_apps')
        .select('team_id')
        .in('team_id', teamIds)

      // Fetch owner profiles
      const ownerIds = teamsData.map(t => t.owner_id).filter(Boolean)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', ownerIds)

      // Create lookup maps
      const memberCounts = {}
      membersData?.forEach(m => {
        memberCounts[m.team_id] = (memberCounts[m.team_id] || 0) + 1
      })

      const appCounts = {}
      appsData?.forEach(a => {
        appCounts[a.team_id] = (appCounts[a.team_id] || 0) + 1
      })

      const profilesMap = {}
      profilesData?.forEach(p => {
        profilesMap[p.id] = p
      })

      // Transform data
      const transformedTeams = teamsData.map(team => {
        const owner = profilesMap[team.owner_id]
        return {
          ...team,
          memberCount: memberCounts[team.id] || 0,
          appCount: appCounts[team.id] || 0,
          ownerEmail: owner?.email || team.owner_id || 'Unknown',
          owner
        }
      })

      setTeams(transformedTeams)
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteTeam() {
    if (!selectedTeam) return
    
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', selectedTeam.id)

      if (error) throw error

      await fetchTeams()
      setShowDeleteModal(false)
      setSelectedTeam(null)
    } catch (error) {
      console.error('Error deleting team:', error)
      alert('Failed to delete team: ' + error.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleBanTeam() {
    if (!selectedTeam) return
    
    setActionLoading(true)
    try {
      // Add is_banned column to teams table if it doesn't exist
      const { error } = await supabase
        .from('teams')
        .update({ is_banned: !selectedTeam.is_banned })
        .eq('id', selectedTeam.id)

      if (error) throw error

      await fetchTeams()
      setShowBanModal(false)
      setSelectedTeam(null)
    } catch (error) {
      console.error('Error banning team:', error)
      alert('Failed to ban team: ' + error.message)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const TeamCard = ({ team }) => (
    <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {team.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{team.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Owner: {team.ownerEmail}
              </p>
            </div>
            {team.is_banned && (
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1">
                <Ban className="h-3 w-3" />
                Banned
              </span>
            )}
          </div>

          {team.description && (
            <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">
              {team.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{team.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>{team.appCount} apps</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(team.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => {
              setSelectedTeam(team)
              setShowBanModal(true)
            }}
            className={`p-2 rounded-lg transition-colors ${
              team.is_banned
                ? 'hover:bg-green-50 dark:hover:bg-green-950/20 text-green-600'
                : 'hover:bg-yellow-50 dark:hover:bg-yellow-950/20 text-yellow-600'
            }`}
            title={team.is_banned ? 'Unban team' : 'Ban team'}
          >
            {team.is_banned ? <CheckCircle className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              setSelectedTeam(team)
              setShowDeleteModal(true)
            }}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-colors"
            title="Delete team"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Team Management</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Manage all teams, ban problematic teams, or delete teams
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teams.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total Teams</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[var(--border)] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teams.filter(t => !t.is_banned).length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Active Teams</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[var(--border)] bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-red-500 flex items-center justify-center">
              <Ban className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teams.filter(t => t.is_banned).length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Banned Teams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search teams by name or owner email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
      </div>

      {/* Teams List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-xl">
          <Users className="h-12 w-12 mx-auto mb-3 text-[var(--muted-foreground)]" />
          <h3 className="font-semibold mb-1">No teams found</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            {searchQuery ? 'Try a different search term' : 'No teams have been created yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Delete Team</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm mb-4">
                Are you sure you want to permanently delete <strong>{selectedTeam.name}</strong>?
              </p>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200 font-semibold mb-2">
                  ⚠️ This will permanently delete:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 ml-4">
                  <li>• {selectedTeam.memberCount} team members (removed from team)</li>
                  <li>• {selectedTeam.appCount} shared apps (unshared)</li>
                  <li>• All team activity and posts</li>
                  <li>• All team invitations</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteTeam}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Team'
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban/Unban Modal */}
      {showBanModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowBanModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                selectedTeam.is_banned
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-yellow-100 dark:bg-yellow-900/20'
              }`}>
                {selectedTeam.is_banned ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Ban className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {selectedTeam.is_banned ? 'Unban Team' : 'Ban Team'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedTeam.is_banned ? 'Restore team access' : 'Restrict team access'}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm mb-4">
                {selectedTeam.is_banned ? (
                  <>
                    Are you sure you want to <strong>unban</strong> <strong>{selectedTeam.name}</strong>?
                    <br /><br />
                    The team will regain full access and members can continue collaborating.
                  </>
                ) : (
                  <>
                    Are you sure you want to <strong>ban</strong> <strong>{selectedTeam.name}</strong>?
                    <br /><br />
                    Team members will lose access to the team, but data will be preserved.
                    You can unban the team later to restore access.
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBanTeam}
                disabled={actionLoading}
                className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedTeam.is_banned
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                } disabled:opacity-50`}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {selectedTeam.is_banned ? 'Unbanning...' : 'Banning...'}
                  </>
                ) : (
                  selectedTeam.is_banned ? 'Unban Team' : 'Ban Team'
                )}
              </button>
              <button
                onClick={() => setShowBanModal(false)}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
