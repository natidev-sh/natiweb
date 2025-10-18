import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/auth/AuthContext.jsx'
import PageMeta from '@/components/PageMeta.jsx'
import RoleEditor, { getRoleConfig } from '@/components/RoleEditor.jsx'
import { 
  Users, Crown, Shield, Eye, Settings as SettingsIcon, Edit3,
  Trash2, UserMinus, ArrowLeft, Save, Loader2, Mail, AlertCircle,
  Folder, Activity, Home, Plus, ExternalLink, Github
} from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'apps', label: 'Shared Apps', icon: Folder },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export default function TeamPage() {
  const { teamId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const activeTab = searchParams.get('tab') || 'overview'
  
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [sharedApps, setSharedApps] = useState([])
  const [myRole, setMyRole] = useState(null)

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
      
      const transformedMembers = membersData.map(m => ({
        ...m,
        user: {
          ...m.profiles,
          email: m.user_id
        }
      }))
      
      setMembers(transformedMembers)
      
      // Find my role
      const me = transformedMembers.find(m => m.user_id === user.id)
      setMyRole(me?.role)

      // Fetch shared apps
      const { data: appsData } = await supabase
        .from('team_apps')
        .select(`
          shared_by,
          shared_at,
          user_apps!inner(id, name, path, github_repo)
        `)
        .eq('team_id', teamId)
      
      setSharedApps((appsData || []).map(item => ({
        id: item.user_apps.id,
        name: item.user_apps.name,
        path: item.user_apps.path,
        github_repo: item.user_apps.github_repo,
        shared_by: item.shared_by,
        shared_at: item.shared_at
      })))
      
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId })
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
      <PageMeta title={team.name} />
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard?tab=teams')}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <RoleEditor
                  currentRole={myRole}
                  onRoleChange={() => {}}
                  isOwner={false}
                  disabled={true}
                />
              </div>
              {team.description && (
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  {team.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </span>
                <span className="flex items-center gap-1">
                  <Folder className="h-3.5 w-3.5" />
                  {sharedApps.length} {sharedApps.length === 1 ? 'app' : 'apps'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[var(--border)]">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-medium ${
                    isActive
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'overview' && (
            <OverviewTab team={team} members={members} sharedApps={sharedApps} myRole={myRole} />
          )}
          {activeTab === 'members' && (
            <MembersTab members={members} myRole={myRole} canManage={canManage} isOwner={isOwner} teamId={teamId} refreshData={fetchTeamData} getRoleIcon={getRoleIcon} user={user} />
          )}
          {activeTab === 'apps' && (
            <AppsTab sharedApps={sharedApps} />
          )}
          {activeTab === 'activity' && (
            <ActivityTab teamId={teamId} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab team={team} myRole={myRole} canManage={canManage} isOwner={isOwner} navigate={navigate} />
          )}
        </div>
      </div>
    </>
  )
}

// Overview Tab
function OverviewTab({ team, members, sharedApps, myRole }) {
  const roleConfig = getRoleConfig(myRole)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Stats Cards */}
      <div className="p-6 rounded-xl border border-[var(--border)] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">{members.length}</p>
            <p className="text-sm text-[var(--muted-foreground)]">Team Members</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-[var(--border)] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
            <Folder className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">{sharedApps.length}</p>
            <p className="text-sm text-[var(--muted-foreground)]">Shared Apps</p>
          </div>
        </div>
      </div>

      {/* Your Role */}
      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background-darkest)] md:col-span-2">
        <h3 className="font-semibold mb-4">Your Role</h3>
        <div className="flex items-start gap-4">
          {roleConfig && (
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br from-${roleConfig.color}-400 to-${roleConfig.color}-600 flex items-center justify-center`}>
              {React.createElement(roleConfig.icon, { className: "h-8 w-8 text-white" })}
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">{roleConfig?.label}</h4>
            <p className="text-sm text-[var(--muted-foreground)] mb-3">{roleConfig?.description}</p>
            <div className="space-y-1">
              {roleConfig?.permissions.map((permission, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className={`h-1.5 w-1.5 rounded-full bg-${roleConfig.color}-500`} />
                  <span>{permission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background-darkest)] md:col-span-2">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
            <Folder className="h-5 w-5" />
            <span className="font-medium">View Apps</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-medium">View Members</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Members Tab Component
function MembersTab({ members, myRole, canManage, isOwner, teamId, refreshData, getRoleIcon, user }) {
  const [memberToRemove, setMemberToRemove] = useState(null)

  async function updateMemberRole(memberId, newRole) {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId)

      if (error) throw error
      await refreshData()
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update role')
    }
  }

  async function removeMember(memberId) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error
      await refreshData()
      setMemberToRemove(null)
    } catch (error) {
      console.error('Error removing member:', error)
      alert('Failed to remove member')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Team Members ({members.length})</h2>
        {canManage && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white hover:opacity-90">
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-5 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
          >
            <div className="flex items-center gap-4">
              {member.user?.avatar_url ? (
                <img
                  src={member.user.avatar_url}
                  alt={member.user.email}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--border)]"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold ring-2 ring-[var(--border)]">
                  {member.user?.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">
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
                <p className="text-sm text-[var(--muted-foreground)]">
                  {member.user?.email}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Joined {new Date(member.joined_at).toLocaleDateString()}
                </p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">This cannot be undone</p>
              </div>
            </div>
            <p className="text-sm mb-6">
              Remove <strong>{memberToRemove.user?.email}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => removeMember(memberToRemove.id)}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                Remove
              </button>
              <button
                onClick={() => setMemberToRemove(null)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
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

// Apps Tab Component  
function AppsTab({ sharedApps }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Shared Apps ({sharedApps.length})</h2>
      </div>

      {sharedApps.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-xl">
          <Folder className="h-12 w-12 mx-auto mb-3 text-[var(--muted-foreground)]" />
          <h3 className="font-semibold mb-1">No apps shared yet</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Share apps from the dashboard to collaborate with your team
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sharedApps.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.name}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">{app.path}</p>
                    </div>
                  </div>
                  {app.github_repo && (
                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href={`https://github.com/${app.github_repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium transition-colors"
                      >
                        <Github className="h-3.5 w-3.5" />
                        View Repo
                      </a>
                      <a
                        href={`https://github.com/${app.github_repo}/fork`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Fork Repo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Activity Tab Component
function ActivityTab({ teamId }) {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [filter, setFilter] = useState('all') // 'all', 'activity', 'posts'

  useEffect(() => {
    fetchActivity()
    fetchPosts()
    
    // Real-time subscription
    const activityChannel = supabase
      .channel(`team_activity:${teamId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'team_activity', filter: `team_id=eq.${teamId}` },
        () => fetchActivity()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'team_posts', filter: `team_id=eq.${teamId}` },
        () => fetchPosts()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(activityChannel)
    }
  }, [teamId])

  async function fetchActivity() {
    try {
      const { data, error } = await supabase
        .from('team_activity')
        .select(`
          *,
          user:profiles!team_activity_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setActivities(data || [])
    } catch (error) {
      console.error('Error fetching activity:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('team_posts')
        .select(`
          *,
          user:profiles!team_posts_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })

      if (error) throw error
      // Filter out replies if parent_id exists
      const topLevelPosts = (data || []).filter(post => !post.parent_id)
      setPosts(topLevelPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  async function handlePostSubmit(e) {
    e.preventDefault()
    if (!newPost.trim()) return

    setPosting(true)
    try {
      const { error } = await supabase
        .from('team_posts')
        .insert({
          team_id: teamId,
          user_id: user.id,
          content: newPost.trim()
        })

      if (error) throw error
      setNewPost('')
      await fetchPosts()
      await fetchActivity()
    } catch (error) {
      console.error('Error posting:', error)
      alert('Failed to post')
    } finally {
      setPosting(false)
    }
  }

  const getActivityIcon = (action) => {
    switch (action) {
      case 'shared_app': return { icon: Folder, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' }
      case 'joined': return { icon: Users, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' }
      case 'left': return { icon: UserMinus, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' }
      case 'role_changed': return { icon: Shield, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' }
      case 'posted': return { icon: Mail, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' }
      case 'commented': return { icon: Mail, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' }
      default: return { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/20' }
    }
  }

  const getActivityText = (activity) => {
    const userName = activity.user?.first_name && activity.user?.last_name
      ? `${activity.user.first_name} ${activity.user.last_name}`
      : activity.user?.id || 'Someone'

    switch (activity.action_type) {
      case 'shared_app':
        return `${userName} shared an app`
      case 'joined':
        return `${userName} joined the team`
      case 'left':
        return `${userName} left the team`
      case 'role_changed':
        const old = activity.metadata?.old_role
        const newRole = activity.metadata?.new_role
        return `${userName}'s role changed from ${old} to ${newRole}`
      case 'posted':
        return `${userName} created a post`
      case 'commented':
        return `${userName} commented on a post`
      default:
        return `${userName} performed an action`
    }
  }

  const filteredContent = () => {
    if (filter === 'posts') return posts
    if (filter === 'activity') return activities.filter(a => a.action_type !== 'posted' && a.action_type !== 'commented')
    
    // Combine and sort
    const combined = [
      ...activities.map(a => ({ ...a, type: 'activity' })),
      ...posts.map(p => ({ ...p, type: 'post', action_type: 'posted' }))
    ]
    return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  return (
    <div className="space-y-6">
      {/* Post Composer */}
      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background-darkest)]">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Share with Team
        </h3>
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind? Share updates, ask questions, or start a discussion..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] resize-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!newPost.trim() || posting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
            >
              {posting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        {['all', 'posts', 'activity'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 border-b-2 transition-colors font-medium capitalize ${
              filter === f
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[var(--primary)]" />
          </div>
        ) : filteredContent().length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-xl">
            <Activity className="h-12 w-12 mx-auto mb-3 text-[var(--muted-foreground)]" />
            <h3 className="font-semibold mb-1">No activity yet</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Start by sharing a post or app with your team
            </p>
          </div>
        ) : (
          filteredContent().map((item) => {
            if (item.type === 'post' || (!item.type && item.content)) {
              // Post item
              return (
                <div
                  key={`post-${item.id}`}
                  className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background-darkest)] hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="flex gap-4">
                    {item.user?.avatar_url ? (
                      <img
                        src={item.user.avatar_url}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--border)]"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-[var(--border)]">
                        {(item.user?.first_name?.[0] || item.user?.id?.[0] || '?').toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {item.user?.first_name && item.user?.last_name
                            ? `${item.user.first_name} ${item.user.last_name}`
                            : item.user?.id || 'Anonymous'}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                    </div>
                  </div>
                </div>
              )
            } else {
              // Activity item
              const iconData = getActivityIcon(item.action_type)
              const Icon = iconData.icon
              return (
                <div
                  key={`activity-${item.id}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                >
                  <div className={`h-10 w-10 rounded-full ${iconData.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${iconData.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{getActivityText(item)}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            }
          })
        )}
      </div>
    </div>
  )
}

// Settings Tab Component
function SettingsTab({ team, myRole, canManage, isOwner, navigate }) {
  const [teamName, setTeamName] = useState(team.name)
  const [teamDescription, setTeamDescription] = useState(team.description || '')
  const [saving, setSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  async function updateSettings() {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('teams')
        .update({ name: teamName, description: teamDescription })
        .eq('id', team.id)

      if (error) throw error
      alert('Settings updated!')
    } catch (error) {
      alert('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  async function deleteTeam() {
    try {
      const { error } = await supabase.from('teams').delete().eq('id', team.id)
      if (error) throw error
      navigate('/dashboard?tab=teams')
    } catch (error) {
      alert('Failed to delete team')
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background-darkest)]">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              disabled={!canManage}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Description</label>
            <textarea
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              disabled={!canManage}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] disabled:opacity-50"
            />
          </div>
          {canManage && (
            <button
              onClick={updateSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      {isOwner && (
        <div className="p-6 rounded-xl border-2 border-red-500/20 bg-red-50 dark:bg-red-950/10">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Delete this team permanently. This action cannot be undone.
          </p>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Team
          </button>
        </div>
      )}

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsDeleteDialogOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Delete Team?</h3>
            <p className="text-sm mb-6">All data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={deleteTeam} className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold">Delete</button>
              <button onClick={() => setIsDeleteDialogOpen(false)} className="px-6 py-3 rounded-xl border-2 font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
