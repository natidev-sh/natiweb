import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './auth/AuthContext.jsx'
import { useSearchParams } from 'react-router-dom'
import ApiKeys from './components/ApiKeys.jsx'
import Usage from './components/Usage.jsx'
import ManageSubscription from './components/ManageSubscription.jsx'
import Sessions from './pages/Sessions.jsx'
import Analytics from './components/Analytics.jsx'
import RemoteControl from './pages/RemoteControl.jsx'
import MyApps from './pages/MyApps.jsx'
import { Key, User, Trash2, UserCircle, BarChart2, CreditCard, Edit, Lock, Link as LinkIcon, Github, Shield, TrendingUp, Monitor, Folder } from 'lucide-react'
import PageMeta from './components/PageMeta.jsx'
import AvatarUploadModal from './components/AvatarUploadModal.jsx'
import DeleteAccountModal from './components/DeleteAccountModal.jsx'
import ProfileEditModal from './components/ProfileEditModal.jsx'
import ChangePasswordModal from './components/ChangePasswordModal.jsx'
import TwoFactorAuth from './components/TwoFactorAuth.jsx'

function Settings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const isGoogleLinked = user?.identities?.some(id => id.provider === 'google');
  const isGithubLinked = user?.identities?.some(id => id.provider === 'github');

  const getProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select(`first_name, last_name, username, avatar_url`)
      .eq('id', user.id)
      .single()

    if (error) {
      console.warn(error)
    } else if (data) {
      setProfile(data)
    }
    setLoading(false)
  }, [user]);

  useEffect(() => {
    getProfile()
  }, [getProfile])

  const handleUploadSuccess = (newUrl) => {
    setProfile(prev => ({ ...prev, avatar_url: newUrl }));
  };

  const handleProfileSaveSuccess = () => {
    getProfile(); // Re-fetch profile to show updated data
  };

  const linkWithProvider = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      console.error(`Error linking ${provider} account:`, error);
    }
  };

  return (
    <>
      <AvatarUploadModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} onUploadSuccess={handleUploadSuccess} />
      <ProfileEditModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} onSaveSuccess={handleProfileSaveSuccess} />
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      
      <div className="space-y-8">
        {/* Profile Section */}
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="text-sm opacity-70 mt-1">This is how your profile appears to others.</p>
            </div>
            <button onClick={() => setIsProfileModalOpen(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
              <Edit className="h-4 w-4" /> Edit
            </button>
          </div>
          <div className="mt-6 flex items-center gap-6">
            <div className="relative group flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <UserCircle className="h-20 w-20 text-[var(--muted-foreground)]" />
              )}
              <button onClick={() => setIsAvatarModalOpen(true)} className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" aria-label="Change avatar">
                <Edit className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'New User'}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{user?.email}</p>
              <p className="text-sm text-[var(--muted-foreground)]">@{profile?.username || '...'}</p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Last changed: never</p>
              </div>
              <button onClick={() => setIsPasswordModalOpen(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                <Lock className="h-4 w-4" /> Change Password
              </button>
            </div>
            <div className="border-t border-[var(--border)] my-4" />
            <TwoFactorAuth />
          </div>
        </div>

        {/* Linked Accounts Section */}
        <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
          <h2 className="text-xl font-semibold mb-4">Linked Accounts</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Github className="h-6 w-6" />
                <div>
                  <h3 className="font-medium">GitHub</h3>
                  <p className={`text-sm ${isGithubLinked ? 'text-green-400' : 'text-[var(--muted-foreground)]'}`}>{isGithubLinked ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              {!isGithubLinked && (
                <button onClick={() => linkWithProvider('github')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                  <LinkIcon className="h-4 w-4" /> Connect
                </button>
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.73 0 6.34 1.61 7.8 2.96l5.32-5.2C33.97 4.2 29.41 2 24 2 14.88 2 6.98 7.34 3.38 15.02l6.83 5.29C11.62 14.4 17.29 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.2-.43-4.7H24v9h12.68c-.55 2.95-2.2 5.45-4.7 7.14l7.19 5.58C43.95 37.62 46.5 31.54 46.5 24.5z"/><path fill="#FBBC05" d="M10.21 20.31l-6.83-5.29C1.8 17.74 1 21.26 1 24.99c0 3.67.78 7.15 2.27 10.23l6.94-5.39C9.4 28.19 9 26.64 9 25s.4-3.19 1.21-4.69z"/><path fill="#34A853" d="M24 47c6.48 0 11.91-2.14 15.88-5.79l-7.19-5.58c-2.01 1.37-4.59 2.17-8.69 2.17-6.71 0-12.38-4.9-13.79-11.11l-6.94 5.39C6.88 40.53 14.79 47 24 47z"/></svg>
                <div>
                  <h3 className="font-medium">Google</h3>
                  <p className={`text-sm ${isGoogleLinked ? 'text-green-400' : 'text-[var(--muted-foreground)]'}`}>{isGoogleLinked ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              {!isGoogleLinked && (
                <button onClick={() => linkWithProvider('google')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                  <LinkIcon className="h-4 w-4" /> Connect
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="p-6 rounded-lg border border-rose-500/30 bg-rose-500/10">
          <h3 className="font-medium text-rose-400">Danger Zone</h3>
          <p className="text-sm opacity-80 mt-1 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button onClick={() => setIsDeleteModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-rose-500/50 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-sm">
            <Trash2 className="h-4 w-4" />
            Delete My Account
          </button>
        </div>
      </div>
    </>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get tab from URL params or default to 'settings'
  const initialTab = searchParams.get('tab') || 'settings'
  const [activeTab, setActiveTab] = useState(initialTab)

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  // Update tab if URL changes
  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab)
    }
  }, [searchParams])

  const tabs = [
    { id: 'settings', label: 'Settings', icon: User },
    { id: 'subscription', label: 'Manage Subscription', icon: CreditCard },
    { id: 'keys', label: 'API Keys', icon: Key },
    { id: 'myapps', label: 'My Apps', icon: Folder },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'remote', label: 'Remote Control', icon: Monitor },
    { id: 'sessions', label: 'Sessions', icon: Shield },
  ]

  return (
    <>
      <PageMeta
        title="Dashboard | Nati.dev"
        description="Your personal dashboard. Manage account settings, API keys, and monitor your usage."
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="opacity-80">Welcome back, {user?.email}.</p>
        </div>

        <div className="flex border-b border-[var(--border)] overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                  : 'border-b-2 border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-4">
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'subscription' && <ManageSubscription />}
          {activeTab === 'keys' && <ApiKeys />}
          {activeTab === 'myapps' && <MyApps />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'remote' && <RemoteControl />}
          {activeTab === 'sessions' && <Sessions />}
        </div>
      </div>
    </>
  )
}