import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/auth/AuthContext.jsx'
import PageMeta from '@/components/PageMeta.jsx'
import RoleEditor, { getRoleConfig } from '@/components/RoleEditor.jsx'
import { 
  Users, Crown, Shield, Eye, Settings as SettingsIcon, Edit3,
  Trash2, UserMinus, ArrowLeft, Save, Loader2, Mail, AlertCircle
} from 'lucide-react'

export default function TeamSettings() {
  const { teamId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [myRole, setMyRole] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (teamId) {
      fetchTeamData()
    }
  }, [teamId])

  async function fetchTeamData() {
    try {
      setLoading(true)
      
      // Fetch team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()

      if (teamError) throw teamError
      
      setTeam(teamData)
      setTeamName(teamData.name)
      setTeamDescription(teamData.description || '')

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles!team_members_user_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .eq('is_active', true)

      if (membersError) throw membersError
      
      // Transform data and add email as user_id fallback
      const transformedMembers = membersData.map(m => ({
        ...m,
        user: {
          ...m.profiles,
          email: m.user_id // Use user_id as display until email is added to profiles
        }
      }))
      
      setMembers(transformedMembers)
      
      // Find my role
      const me = transformedMembers.find(m => m.user_id === user.id)
      setMyRole(me?.role)
      
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateTeamSettings() {
    if (!teamName.trim()) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: teamName,
          description: teamDescription
        })
        .eq('id', teamId)

      if (error) throw error
      
      alert('Team settings updated!')
    } catch (error) {
      console.error('Error updating team:', error)
      alert('Failed to update team: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  async function updateMemberRole(memberId, newRole) {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId)

      if (error) throw error

      await fetchTeamData()
      alert('Role updated successfully!')
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update role: ' + error.message)
    }
  }

  async function removeMember(memberId) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      await fetchTeamData()
      setMemberToRemove(null)
      alert('Member removed successfully')
    } catch (error) {
      console.error('Error removing member:', error)
      alert('Failed to remove member: ' + error.message)
    }
  }

  async function deleteTeam() {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId)

      if (error) throw error

      navigate('/dashboard?tab=teams')
    } catch (error) {
      console.error('Error deleting team:', error)
      alert('Failed to delete team: ' + error.message)
    }
  }

  const getRoleIcon = (role) => {
    const config = getRoleConfig(role)
    if (!config) return null
    const Icon = config.icon
    return <Icon className={`h-4 w-4 text-${config.color}-500`} />
  }

  const canManage = myRole === 'owner' || myRole === 'admin'
  const isOwner = myRole === 'owner'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Team Not Found</h2>
          <button
            onClick={() => navigate('/dashboard?tab=teams')}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white"
          >
            Back to Teams
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageMeta title={`${team.name} Settings`} />
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard?tab=teams')}
            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Team Settings</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Manage your team settings and members
            </p>
          </div>
        </div>

        {/* General Settings */}
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={!canManage}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] disabled:opacity-50"
                placeholder="My Team"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Description</label>
              <textarea
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                disabled={!canManage}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] disabled:opacity-50"
                placeholder="What is this team for?"
              />
            </div>
            {canManage && (
              <button
                onClick={updateTeamSettings}
                disabled={saving || !teamName.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Members Management */}
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Members ({members.length})</h2>
            {canManage && (
              <button
                onClick={() => navigate(`/dashboard?tab=teams`)}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Invite Members
              </button>
            )}
          </div>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {member.user?.avatar_url ? (
                    <img
                      src={member.user.avatar_url}
                      alt={member.user.email}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {member.user?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {member.user?.first_name && member.user?.last_name
                          ? `${member.user.first_name} ${member.user.last_name}`
                          : member.user?.email}
                      </p>
                      {member.user_id === user.id && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {member.user?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleIcon(member.role)}
                      <p className="text-xs text-[var(--muted-foreground)] capitalize">
                        {member.role}
                      </p>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        • Joined {new Date(member.joined_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {canManage && member.user_id !== user.id && member.role !== 'owner' ? (
                  <div className="flex items-center gap-3">
                    <RoleEditor
                      currentRole={member.role}
                      onRoleChange={(newRole) => updateMemberRole(member.id, newRole)}
                      isOwner={isOwner}
                    />
                    <button
                      onClick={() => setMemberToRemove(member)}
                      className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-all hover:scale-110"
                      title="Remove member"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <RoleEditor
                    currentRole={member.role}
                    onRoleChange={() => {}}
                    isOwner={false}
                    disabled={true}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        {isOwner && (
          <div className="p-6 rounded-lg border-2 border-red-500/20 bg-red-50 dark:bg-red-950/10">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Danger Zone
            </h2>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Once you delete a team, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Team
            </button>
          </div>
        )}
      </div>

      {/* Remove Member Dialog */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setMemberToRemove(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <UserMinus className="h-6 w-6 text-red-600 dark:text-red-400" />
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
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
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

      {/* Delete Team Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteDialogOpen(false)}>
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
            <p className="text-sm mb-6">
              Are you sure you want to delete <strong>{team.name}</strong>? All team data, members, and shared resources will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteTeam}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
              >
                Delete Team
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
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
