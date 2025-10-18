import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { ArrowLeft, User, Mail, Clock, Key, Shield, Edit, Ban, Trash2, Save, Loader2, ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react';
import AdminActionModal from '@/components/AdminActionModal';

export default function AdminUserDetails() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editableProfile, setEditableProfile] = useState({ role: '', subscription_status: '' });
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: functionError } = await supabase.functions.invoke('get-user-details', {
        body: { userId },
      });
      if (functionError) throw functionError;
      if (data.error) throw new Error(data.error);
      setUserData(data);
      setEditableProfile({
        role: data.profile.role,
        subscription_status: data.profile.subscription_status || 'none'
      });
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError('');
    try {
      const { error: functionError } = await supabase.functions.invoke('update-user-details', {
        body: {
          userId,
          role: editableProfile.role,
          subscription_status: editableProfile.subscription_status,
        },
      });
      if (functionError) throw functionError;
      
      await fetchUserDetails();
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleActionConfirm = async () => {
    if (!modalConfig?.action) return;
    setIsSaving(true);
    setError('');
    try {
      const { error: functionError } = await supabase.functions.invoke('manage-user-status', {
        body: modalConfig.action,
      });
      if (functionError) throw functionError;
      
      // Re-fetch all user details to ensure UI is up-to-date
      await fetchUserDetails();
      setIsActionModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openActionModal = (config) => {
    setModalConfig(config);
    setIsActionModalOpen(true);
  };

  const getUserStatus = (bannedUntil) => {
    if (!bannedUntil || new Date(bannedUntil) < new Date() || bannedUntil === 'none') {
      return { text: 'Active', color: 'text-green-400', icon: ShieldCheck };
    }
    if (bannedUntil.startsWith('9999')) {
      return { text: 'Banned', color: 'text-rose-400', icon: Ban };
    }
    return { 
      text: `Suspended until ${new Date(bannedUntil).toLocaleDateString()}`, 
      color: 'text-amber-400',
      icon: ShieldAlert,
    };
  };

  if (loading) return <div>Loading user details...</div>;
  if (error && !userData) return <div className="text-rose-400">Error: {error}</div>;
  if (!userData) return <div>User not found.</div>;

  const { authUser, profile, apiKeys } = userData;
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const status = getUserStatus(authUser.banned_until);
  const isBannedOrSuspended = authUser.banned_until && authUser.banned_until !== 'none' && new Date(authUser.banned_until) > new Date();

  return (
    <>
      <PageMeta title={`User: ${fullName || authUser.email} | Admin`} />
      <AdminActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onConfirm={handleActionConfirm}
        config={modalConfig}
        isLoading={isSaving}
      />
      <div className="space-y-6">
        <div>
          <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Link>
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="h-16 w-16 rounded-full" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-[var(--muted)] flex items-center justify-center">
                <User className="h-8 w-8 text-[var(--muted-foreground)]" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{fullName || 'No Name Provided'}</h1>
              <p className="text-[var(--muted-foreground)]">@{profile.username || '...'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <h3 className="font-semibold text-lg mb-4">API Keys ({apiKeys.length})</h3>
              {apiKeys.length > 0 ? (
                <ul className="divide-y divide-[var(--border)]">
                  {apiKeys.map(key => (
                    <li key={key.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-mono text-sm">nati-••••••••{key.api_key.slice(-4)}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">Created: {new Date(key.created_at).toLocaleDateString()}</p>
                      </div>
                      <button className="p-2 text-rose-500 hover:bg-[var(--muted)] rounded-md" title="Revoke Key (coming soon)">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">This user has not generated any API keys.</p>
              )}
            </div>
            <div className="p-6 rounded-lg border border-rose-500/30 bg-rose-500/10">
              <h3 className="font-semibold text-lg text-rose-400 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                {isBannedOrSuspended ? (
                  <div className="flex justify-between items-center">
                    <div><p className="font-medium">Unban / Unsuspend User</p><p className="text-sm text-rose-300/70">Restore access for this user.</p></div>
                    <button onClick={() => openActionModal({ title: 'Confirm Unban', body: `Are you sure you want to restore access for ${fullName || authUser.email}?`, actionLabel: 'Confirm', color: 'primary', action: { userId, action: 'unban' } })} className="px-4 py-2 rounded-md border border-green-500/50 bg-green-500/20 text-green-300 hover:bg-green-500/30 text-sm">Unban User</button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div><p className="font-medium">Suspend User</p><p className="text-sm text-rose-300/70">Temporarily block access for 7 days.</p></div>
                      <button onClick={() => openActionModal({ title: 'Confirm Suspension', body: `Are you sure you want to suspend ${fullName || authUser.email} for 7 days?`, actionLabel: 'Suspend', color: 'amber', action: { userId, action: 'suspend', durationDays: 7 } })} className="px-4 py-2 rounded-md border border-amber-500/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-sm">Suspend User</button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div><p className="font-medium">Ban User</p><p className="text-sm text-rose-300/70">Permanently block access.</p></div>
                      <button onClick={() => openActionModal({ title: 'Confirm Ban', body: `Are you sure you want to permanently ban ${fullName || authUser.email}? This is a strong action.`, actionLabel: 'Ban User', color: 'rose', action: { userId, action: 'ban' } })} className="px-4 py-2 rounded-md border border-rose-500/50 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-sm">Ban User</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Details</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)]"><Edit className="h-3 w-3" /> Edit</button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setIsEditing(false); setEditableProfile({ role: profile.role, subscription_status: profile.subscription_status || 'none' }); }} className="px-3 py-1 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)]">Cancel</button>
                    <button onClick={handleSaveChanges} disabled={isSaving} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm disabled:opacity-60">{isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save</button>
                  </div>
                )}
              </div>
              {error && <p className="text-sm text-rose-400 mb-4">{error}</p>}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--muted-foreground)]" /><span>{authUser.email}</span></div>
                <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-[var(--muted-foreground)]" /><span>Joined: {new Date(authUser.created_at).toLocaleDateString()}</span></div>
                <div className="flex items-center gap-3"><status.icon className={`h-4 w-4 ${status.color}`} /> <span className={status.color}>{status.text}</span></div>
                <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-[var(--muted-foreground)]" /><select name="role" value={editableProfile.role} onChange={handleProfileChange} disabled={!isEditing} className="bg-transparent border-none p-0 focus:ring-0 disabled:opacity-70"><option value="user">User</option><option value="admin">Admin</option></select></div>
                <div className="flex items-center gap-3"><Key className="h-4 w-4 text-[var(--muted-foreground)]" /><select name="subscription_status" value={editableProfile.subscription_status} onChange={handleProfileChange} disabled={!isEditing} className="bg-transparent border-none p-0 focus:ring-0 disabled:opacity-70"><option value="none">No Subscription</option><option value="active">Pro Subscription</option></select></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}