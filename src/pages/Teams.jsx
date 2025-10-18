import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/auth/AuthContext.jsx'
import PageMeta from '@/components/PageMeta.jsx'
import { 
  Users, Crown, Shield, Eye, Mail, Plus, Settings, 
  Folder, Key, FileText, Activity, X, Check, Copy,
  Trash2, UserPlus, LogOut, ExternalLink, UserMinus
} from 'lucide-react'

export default function Teams() {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [teamResources, setTeamResources] = useState({ apps: 0, keys: 0, prompts: 0 })
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState(null)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviteLink, setInviteLink] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [creating, setCreating] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [activeTab, setActiveTab] = useState('members')

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamDetails(selectedTeam.id)
    }
  }, [selectedTeam])

  async function fetchTeams() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (error) throw error
      
      const teamsData = data?.map(m => ({
        ...m.team,
        myRole: m.role
      })) || []
      
      setTeams(teamsData)
      if (teamsData.length > 0 && !selectedTeam) {
        setSelectedTeam(teamsData[0])
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchTeamDetails(teamId) {
    try {
      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles!team_members_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('team_id', teamId)
        .eq('is_active', true)

      if (membersError) throw membersError
      
      // Transform data and add email as user_id (we'll display the ID)
      const transformedMembers = (membersData || []).map(m => ({
        ...m,
        user: {
          ...m.profiles,
          email: m.user_id // Use user_id as fallback for display
        }
      }))
      setTeamMembers(transformedMembers)

      // Fetch shared resources count
      const [appsRes, keysRes, promptsRes] = await Promise.all([
        supabase.from('team_apps').select('id', { count: 'exact' }).eq('team_id', teamId),
        supabase.from('team_api_keys').select('id', { count: 'exact' }).eq('team_id', teamId),
        supabase.from('team_prompts').select('id', { count: 'exact' }).eq('team_id', teamId),
      ])

      setTeamResources({
        apps: appsRes.count || 0,
        keys: keysRes.count || 0,
        prompts: promptsRes.count || 0
      })
    } catch (error) {
      console.error('Error fetching team details:', error)
    }
  }

  async function createTeam() {
    if (!newTeamName.trim()) return
    
    setCreating(true)
    try {
      console.log('Creating team for user:', user.id)
      const slug = newTeamName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      // Check current session
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session:', session ? 'Active' : 'None')
      
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: newTeamName,
          slug: slug,
          owner_id: user.id
        })
        .select()
        .single()

      if (teamError) {
        console.error('Team creation error:', teamError)
        throw new Error(teamError.message || 'Failed to create team')
      }

      console.log('Team created:', team)

      // Add owner as team member
      const { error: memberError } = await supabase.from('team_members').insert({
        team_id: team.id,
        user_id: user.id,
        role: 'owner',
        joined_at: new Date().toISOString()
      })

      if (memberError) {
        console.error('Member insertion error:', memberError)
        throw new Error(memberError.message || 'Failed to add team member')
      }

      await fetchTeams()
      setIsCreateDialogOpen(false)
      setNewTeamName('')
      alert('Team created successfully!')
    } catch (error) {
      console.error('Error creating team:', error)
      alert(error.message || 'Failed to create team. Check console for details.')
    } finally {
      setCreating(false)
    }
  }

  async function inviteMember() {
    if (!inviteEmail.trim() || !selectedTeam) return
    
    setInviting(true)
    try {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

      const { error } = await supabase.from('team_invites').insert({
        team_id: selectedTeam.id,
        email: inviteEmail,
        role: inviteRole,
        invited_by: user.id,
        token: token,
        expires_at: expiresAt.toISOString()
      })

      if (error) throw error

      const link = `${window.location.origin}/invite/${token}`
      setInviteLink(link)
      setInviteEmail('')
    } catch (error) {
      console.error('Error inviting member:', error)
      alert(error.message || 'Failed to send invite')
      setInviting(false)
    } finally {
      if (!inviteLink) setInviting(false)
    }
  }

  async function removeMember(memberId) {
    if (!selectedTeam) return
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      await fetchTeamDetails(selectedTeam.id)
      setMemberToRemove(null)
      alert('Member removed successfully')
    } catch (error) {
      console.error('Error removing member:', error)
      alert(error.message || 'Failed to remove member')
    }
  }

  async function updateMemberRole(memberId, newRole) {
    if (!selectedTeam) return
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId)

      if (error) throw error

      await fetchTeamDetails(selectedTeam.id)
      alert('Role updated successfully')
    } catch (error) {
      console.error('Error updating role:', error)
      alert(error.message || 'Failed to update role')
    }
  }

  async function leaveTeam() {
    if (!selectedTeam) return
    
    if (!confirm('Are you sure you want to leave this team?')) return

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', selectedTeam.id)
        .eq('user_id', user.id)

      if (error) throw error

      await fetchTeams()
      setSelectedTeam(teams.length > 0 ? teams[0] : null)
      alert('Left team successfully')
    } catch (error) {
      console.error('Error leaving team:', error)
      alert(error.message || 'Failed to leave team')
    }
  }

  async function deleteTeam() {
    if (!teamToDelete) return
    
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamToDelete.id)

      if (error) throw error

      await fetchTeams()
      setSelectedTeam(teams.length > 0 ? teams[0] : null)
      setIsDeleteDialogOpen(false)
      setTeamToDelete(null)
      alert('Team deleted successfully')
    } catch (error) {
      console.error('Error deleting team:', error)
      alert(error.message || 'Failed to delete team')
    }
  }

  function copyInviteLink() {
    navigator.clipboard.writeText(inviteLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  function closeInviteDialog() {
    setIsInviteDialogOpen(false)
    setInviteLink('')
    setInviteEmail('')
    setInviting(false)
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />
      case 'editor': return <Settings className="h-4 w-4 text-green-500" />
      case 'viewer': return <Eye className="h-4 w-4 text-gray-500" />
      default: return null
    }
  }

  const canManageTeam = selectedTeam?.myRole === 'owner' || selectedTeam?.myRole === 'admin'

  return (
    <>
      <PageMeta
        title="Teams | Nati.dev"
        description="Collaborate with your team on AI projects"
      />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Team Workspaces
            </h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              Collaborate with your team members
            </p>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Create Team
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12 border border-[var(--border)] rounded-lg">
            <Users className="h-12 w-12 mx-auto mb-3 text-[var(--muted-foreground)] opacity-50" />
            <h3 className="font-semibold mb-1">No Teams Yet</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Create a team to collaborate with others
            </p>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Create Your First Team
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Teams Sidebar */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--muted-foreground)] px-3 mb-2">Your Teams</h3>
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTeam?.id === team.id
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'border-[var(--border)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{team.name}</h4>
                    {getRoleIcon(team.myRole)}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {team.myRole}
                  </p>
                </button>
              ))}
            </div>

            {/* Team Details */}
            {selectedTeam && (
              <div className="space-y-6">
                {/* Team Header */}
                <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{selectedTeam.name}</h2>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {selectedTeam.description || 'No description'}
                      </p>
                    </div>
                    {canManageTeam && (
                      <a
                        href={`/team/${selectedTeam.id}/settings`}
                        className="p-2 rounded-md hover:bg-[var(--muted)] transition-colors inline-flex items-center gap-1"
                        title="Team Settings"
                      >
                        <Settings className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]">
                      <Folder className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-lg font-bold">{teamResources.apps}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">Shared Apps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]">
                      <Key className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-lg font-bold">{teamResources.keys}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">API Keys</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-lg font-bold">{teamResources.prompts}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">Prompts</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Team Members ({teamMembers.length})</h3>
                    {canManageTeam && (
                      <button
                        onClick={() => setIsInviteDialogOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-sm"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Invite
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {teamMembers.map(member => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                            {member.user?.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{member.user?.email}</p>
                              {member.user_id === user.id && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {getRoleIcon(member.role)}
                              <p className="text-xs text-[var(--muted-foreground)] capitalize">
                                {member.role}
                              </p>
                            </div>
                          </div>
                        </div>
                        {canManageTeam && member.user_id !== user.id && member.role !== 'owner' && (
                          <div className="flex items-center gap-1">
                            <select
                              value={member.role}
                              onChange={(e) => updateMemberRole(member.id, e.target.value)}
                              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm cursor-pointer hover:bg-[var(--muted)] transition-colors"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="editor">Editor</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => setMemberToRemove(member)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-colors"
                              title="Remove member"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Actions */}
                <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
                  <h3 className="font-semibold mb-4">Team Actions</h3>
                  <div className="flex gap-3">
                    {selectedTeam.myRole !== 'owner' && (
                      <button
                        onClick={leaveTeam}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-950/30 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Leave Team
                      </button>
                    )}
                    {selectedTeam.myRole === 'owner' && (
                      <button
                        onClick={() => {
                          setTeamToDelete(selectedTeam)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Team
                      </button>
                    )}
                  </div>
                </div>

                {/* Pro Feature Notice */}
                <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/10">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    ⭐ Team Workspaces - Pro Feature
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Collaborate in real-time, share resources, and build together. 
                    Only Pro and Admin users can create and manage teams.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Team Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsCreateDialogOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Create Team</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Start collaborating with your team</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700 dark:text-gray-300">Team Name</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-base"
                  placeholder="My Awesome Team"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && createTeam()}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={createTeam}
                  disabled={creating || !newTeamName.trim()}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                >
                  {creating ? 'Creating...' : 'Create Team'}
                </button>
                <button
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setMemberToRemove(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <UserMinus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Remove Member</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm mb-6">
              Are you sure you want to remove <strong>{memberToRemove.user?.email}</strong> from the team?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => removeMember(memberToRemove.id)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:from-red-700 hover:to-pink-700 transition-all shadow-lg shadow-red-500/30"
              >
                Remove
              </button>
              <button
                onClick={() => setMemberToRemove(null)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Confirmation */}
      {isDeleteDialogOpen && teamToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteDialogOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Delete Team</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm mb-6">
              Are you sure you want to delete <strong>{teamToDelete.name}</strong>? All team data, members, and shared resources will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteTeam}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:from-red-700 hover:to-pink-700 transition-all shadow-lg shadow-red-500/30"
              >
                Delete Team
              </button>
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setTeamToDelete(null)
                }}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Dialog */}
      {isInviteDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeInviteDialog}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Invite Team Member</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send an invitation to collaborate</p>
                </div>
              </div>
              <button onClick={closeInviteDialog} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {inviteLink ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Invitation Created!</h4>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Share this link with your teammate to join the team.
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700 dark:text-gray-300">Invite Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono"
                    />
                    <button
                      onClick={copyInviteLink}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
                    >
                      {copiedLink ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={closeInviteDialog}
                  className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all text-base"
                    placeholder="teammate@example.com"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700 dark:text-gray-300">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all text-base cursor-pointer"
                  >
                    <option value="viewer">👁️ Viewer - Read-only access</option>
                    <option value="editor">✏️ Editor - Can edit and create</option>
                    <option value="admin">🛡️ Admin - Full access</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={inviteMember}
                    disabled={inviting || !inviteEmail.trim()}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
                  >
                    {inviting ? 'Creating Link...' : 'Create Invite Link'}
                  </button>
                  <button
                    onClick={closeInviteDialog}
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
