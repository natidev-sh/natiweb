import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/auth/AuthContext.jsx'
import PageMeta from '@/components/PageMeta.jsx'
import { Users, Check, X, Crown, Shield, Eye, Settings, Loader2, AlertCircle } from 'lucide-react'

export default function AcceptInvite() {
  const { token } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [invite, setInvite] = useState(null)
  const [team, setTeam] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      // Redirect to login, then back here
      const returnUrl = `/invite/${token}`
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`)
      return
    }
    
    fetchInvite()
  }, [token, user])

  async function fetchInvite() {
    try {
      setLoading(true)
      
      // Fetch invite with team info
      const { data: inviteData, error: inviteError } = await supabase
        .from('team_invites')
        .select(`
          *,
          team:teams(*),
          inviter:profiles!team_invites_invited_by_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .single()
      
      // Add email from invited_by field as fallback
      if (inviteData && inviteData.inviter) {
        inviteData.inviter.email = inviteData.invited_by
      }

      if (inviteError || !inviteData) {
        setError('Invalid or expired invite link')
        return
      }

      // Check if invite is expired
      const expiresAt = new Date(inviteData.expires_at)
      if (expiresAt < new Date()) {
        setError('This invite has expired')
        return
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', inviteData.team_id)
        .eq('user_id', user.id)
        .single()

      if (existingMember) {
        setError('You are already a member of this team')
        setTimeout(() => navigate('/dashboard?tab=teams'), 2000)
        return
      }

      setInvite(inviteData)
      setTeam(inviteData.team)
    } catch (error) {
      console.error('Error fetching invite:', error)
      setError('Failed to load invite')
    } finally {
      setLoading(false)
    }
  }

  async function acceptInvite() {
    if (!invite || !user) return
    
    setAccepting(true)
    try {
      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: invite.team_id,
          user_id: user.id,
          role: invite.role,
          joined_at: new Date().toISOString()
        })

      if (memberError) throw memberError

      // Update invite status
      await supabase
        .from('team_invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id)

      // Success! Redirect to teams
      navigate('/dashboard?tab=teams')
    } catch (error) {
      console.error('Error accepting invite:', error)
      alert('Failed to accept invite: ' + error.message)
    } finally {
      setAccepting(false)
    }
  }

  async function declineInvite() {
    if (!invite) return
    
    try {
      // Update invite status
      await supabase
        .from('team_invites')
        .update({ status: 'declined' })
        .eq('id', invite.id)

      navigate('/')
    } catch (error) {
      console.error('Error declining invite:', error)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="h-5 w-5 text-blue-500" />
      case 'editor': return <Settings className="h-5 w-5 text-green-500" />
      case 'viewer': return <Eye className="h-5 w-5 text-gray-500" />
      default: return null
    }
  }

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin': return 'Full access to manage team settings and members'
      case 'editor': return 'Can create and edit shared resources'
      case 'viewer': return 'Read-only access to team resources'
      default: return ''
    }
  }

  if (loading) {
    return (
      <>
        <PageMeta title="Loading Invite..." />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading invitation...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <PageMeta title="Invalid Invite" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-16 w-16 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Invite Error</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
            >
              Go Home
            </button>
          </div>
        </div>
      </>
    )
  }

  if (!invite || !team) {
    return null
  }

  return (
    <>
      <PageMeta title={`Join ${team.name} - Team Invite`} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">Team Invitation</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You've been invited to join a team
              </p>
            </div>
          </div>

          {/* Team Info */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-bold mb-2">{team.name}</h2>
            {team.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {team.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0">
                {getRoleIcon(invite.role)}
              </div>
              <div className="flex-1">
                <p className="font-semibold capitalize">{invite.role}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {getRoleDescription(invite.role)}
                </p>
              </div>
            </div>
          </div>

          {/* Inviter Info */}
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
              {invite.inviter?.first_name?.[0] || invite.inviter?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-medium">
                Invited by {invite.inviter?.first_name && invite.inviter?.last_name 
                  ? `${invite.inviter.first_name} ${invite.inviter.last_name}`
                  : invite.inviter?.email || 'Team Admin'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {new Date(invite.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={acceptInvite}
              disabled={accepting}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {accepting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Accept & Join
                </>
              )}
            </button>
            <button
              onClick={declineInvite}
              disabled={accepting}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
              Decline
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            By accepting, you'll be able to access shared resources and collaborate with the team.
          </p>
        </div>
      </div>
    </>
  )
}
