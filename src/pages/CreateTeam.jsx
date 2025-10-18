import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext.jsx'
import { supabase } from '@/integrations/supabase/client'
import PageMeta from '@/components/PageMeta.jsx'
import { 
  Users, ArrowLeft, Loader2, Sparkles, Crown, Check, 
  Building2, Shield, Zap, Lock
} from 'lucide-react'

const PRO_FEATURES = [
  { icon: Users, title: 'Unlimited Members', desc: 'Invite as many team members as you need' },
  { icon: Shield, title: 'Advanced Permissions', desc: 'Owner, Admin, Editor, and Viewer roles' },
  { icon: Zap, title: 'Real-time Collaboration', desc: 'Activity feed and team posts' },
  { icon: Building2, title: 'Multiple Teams', desc: 'Create and manage multiple teams' },
]

export default function CreateTeam() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  // Check if user is Pro - you can replace this with your actual Pro check
  const isPro = user?.user_metadata?.subscription_status === 'active' || 
                user?.user_metadata?.role === 'admin' ||
                user?.app_metadata?.subscription_status === 'active'

  async function handleCreateTeam(e) {
    e.preventDefault()
    if (!teamName.trim()) {
      setError('Team name is required')
      return
    }

    if (!isPro) {
      setError('Pro subscription required to create teams')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamName.trim(),
          description: description.trim() || null,
          owner_id: user.id
        })
        .select()
        .single()

      if (teamError) throw teamError

      // Add owner as team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'owner'
        })

      if (memberError) throw memberError

      // Navigate to the new team
      navigate(`/team/${team.id}`)
    } catch (err) {
      console.error('Error creating team:', err)
      setError(err.message || 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMeta title="Create Team" />
      <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-blue-50 dark:to-blue-950/20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard?tab=teams')}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Create a New Team
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Collaborate with your team members on projects
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Pro Badge */}
              {isPro ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Crown className="h-5 w-5" />
                    <span className="font-semibold">Pro Feature Unlocked</span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    You have access to team collaboration features
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Pro Required</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Upgrade to create teams
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/onboarding/pricing')}
                    className="w-full mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Upgrade to Pro</span>
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleCreateTeam} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Team Details</h2>
                
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Team Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g., Frontend Team, Marketing, Design Squad"
                      disabled={!isPro || loading}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                      maxLength={50}
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {teamName.length}/50 characters
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Description <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What is this team for? Who should join?"
                      disabled={!isPro || loading}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed resize-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                      maxLength={200}
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {description.length}/200 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!isPro || loading || !teamName.trim()}
                    className="w-full px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating Team...</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-5 w-5" />
                        <span>Create Team</span>
                      </>
                    )}
                  </button>

                  {!isPro && (
                    <p className="text-xs text-center text-[var(--muted-foreground)]">
                      <Lock className="h-3 w-3 inline mr-1" />
                      Upgrade to Pro to create teams
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column - Features */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  What's Included
                </h2>
                <div className="space-y-4">
                  {PRO_FEATURES.map((feature, idx) => {
                    const Icon = feature.icon
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-0.5">{feature.title}</h3>
                          <p className="text-xs text-[var(--muted-foreground)]">{feature.desc}</p>
                        </div>
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tips */}
              <div className="p-6 rounded-xl border border-[var(--border)] bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
                <h3 className="font-semibold mb-3 text-sm">💡 Tips for Success</h3>
                <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 shrink-0">•</span>
                    <span>Use clear, descriptive team names</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 shrink-0">•</span>
                    <span>Add a description to help new members understand the team's purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 shrink-0">•</span>
                    <span>Invite members after creating the team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 shrink-0">•</span>
                    <span>Share apps to collaborate on projects</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
