import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { useAuth } from '@/auth/AuthContext';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'descending' });
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, username, role, updated_at, subscription_status, plan_id')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('Error updating role: ' + error.message);
    } else {
      fetchUsers();
    }
  };

  const handleSubscriptionChange = async (userId, newStatus) => {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: newStatus === 'none' ? null : newStatus })
      .eq('id', userId);

    if (error) {
      alert('Error updating subscription: ' + error.message);
    } else {
      fetchUsers();
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredUsers = useMemo(() => {
    let filtered = users;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = users.filter(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower) ||
          user.id.toLowerCase().includes(searchLower)
        );
      });
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [users, searchQuery, sortConfig]);

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return <span className="w-4 h-4" />;
    return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <>
      <PageMeta title="Manage Users | Admin" />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search by name, username, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
          />
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--background-darkest)]">
                <tr>
                  {['first_name', 'username', 'role', 'subscription_status', 'updated_at'].map(key => (
                    <th key={key} className="p-3 font-medium">
                      <button onClick={() => requestSort(key)} className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors">
                        {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {getSortIcon(key)}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredUsers.map(user => (
                  <tr key={user.id} className="border-t border-[var(--border)]">
                    <td className="p-3 font-medium">
                      <Link to={`/admin/users/${user.id}`} className="hover:text-[var(--primary)] hover:underline">
                        {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
                      </Link>
                    </td>
                    <td className="p-3 font-mono text-xs opacity-70">@{user.username || '...'}</td>
                    <td className="p-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === currentUser.id}
                        className="bg-[var(--background)] border border-[var(--border)] rounded-md px-2 py-1 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 disabled:opacity-70"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={user.subscription_status || 'none'}
                        onChange={(e) => handleSubscriptionChange(user.id, e.target.value)}
                        className="bg-[var(--background)] border border-[var(--border)] rounded-md px-2 py-1 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
                      >
                        <option value="none">None</option>
                        <option value="active">Active (Pro)</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </td>
                    <td className="p-3 opacity-70">{new Date(user.updated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}