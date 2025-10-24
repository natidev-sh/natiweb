import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Search, Mail, Clock, Download, RefreshCw, Trash2, Users, TrendingUp, Calendar, Sparkles } from 'lucide-react';

export default function AdminWaitlist() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    last24h: 0,
    last7days: 0,
    last30days: 0,
  });

  const fetchWaitlist = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('waitlist')
      .select('id, email, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching waitlist:', error);
    } else {
      setEntries(data || []);
      calculateStats(data || []);
    }
    setLoading(false);
  }, []);

  const calculateStats = (data) => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const last24h = data.filter(entry => new Date(entry.created_at) > oneDayAgo).length;
    const last7days = data.filter(entry => new Date(entry.created_at) > sevenDaysAgo).length;
    const last30days = data.filter(entry => new Date(entry.created_at) > thirtyDaysAgo).length;

    setStats({
      total: data.length,
      last24h,
      last7days,
      last30days,
    });
  };

  useEffect(() => {
    fetchWaitlist();
  }, [fetchWaitlist]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery) {
      return entries;
    }
    const searchLower = searchQuery.toLowerCase();
    return entries.filter(entry =>
      entry.email.toLowerCase().includes(searchLower)
    );
  }, [entries, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    setExporting(true);
    
    try {
      // Create CSV content
      const headers = ['Email', 'Signed Up Date'];
      const rows = filteredEntries.map(entry => [
        entry.email,
        new Date(entry.created_at).toLocaleString()
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `nati-waitlist-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Exported ${filteredEntries.length} emails to CSV`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Delete entry
  const handleDelete = async (id, email) => {
    if (!confirm(`Are you sure you want to remove ${email} from the waitlist?`)) {
      return;
    }

    const { error } = await supabase
      .from('waitlist')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    } else {
      // Remove from local state
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <>
      <PageMeta title="Waitlist Management | Admin" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Waitlist Management</h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-1">
              Manage and export your waitlist subscribers
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={fetchWaitlist}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={handleExportCSV}
              disabled={exporting || filteredEntries.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Subscribers */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <Sparkles className="h-4 w-4 text-blue-500/50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[var(--muted-foreground)]">Total Subscribers</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </div>

          {/* Last 24 Hours */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded-full">24h</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[var(--muted-foreground)]">Last 24 Hours</p>
              <p className="text-3xl font-bold">{stats.last24h}</p>
            </div>
          </div>

          {/* Last 7 Days */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-xs font-medium text-purple-500 bg-purple-500/20 px-2 py-1 rounded-full">7d</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[var(--muted-foreground)]">Last 7 Days</p>
              <p className="text-3xl font-bold">{stats.last7days}</p>
            </div>
          </div>

          {/* Last 30 Days */}
          <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <Mail className="h-5 w-5 text-rose-500" />
              </div>
              <span className="text-xs font-medium text-rose-500 bg-rose-500/20 px-2 py-1 rounded-full">30d</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[var(--muted-foreground)]">Last 30 Days</p>
              <p className="text-3xl font-bold">{stats.last30days}</p>
            </div>
          </div>
        </div>

        {/* Growth Indicator */}
        {stats.total > 0 && (
          <div className="bg-[var(--accent)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Growth Rate</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {stats.last7days > 0 
                    ? `${stats.last7days} new subscribers in the last 7 days`
                    : 'No new subscribers in the last 7 days'}
                  {stats.last30days > 0 && ` • ${Math.round((stats.last7days / stats.last30days) * 100)}% of monthly growth`}
                </p>
              </div>
              {stats.last7days > 0 && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-[var(--primary)]">
                    {stats.last30days > 0 ? `${Math.round((stats.last7days / (stats.last30days / 4)) * 100)}%` : '0%'}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">vs last week</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
            />
          </div>
          {searchQuery && (
            <span className="text-sm text-[var(--muted-foreground)]">
              Found {filteredEntries.length} {filteredEntries.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading waitlist...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--accent)] border-b border-[var(--border)]">
                <tr>
                  <th className="p-3 font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </div>
                  </th>
                  <th className="p-3 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Signed Up On
                    </div>
                  </th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map(entry => (
                    <tr key={entry.id} className="border-t border-[var(--border)] hover:bg-[var(--accent)]/50 transition-colors">
                      <td className="p-3 font-medium">{entry.email}</td>
                      <td className="p-3 text-[var(--muted-foreground)]">
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDelete(entry.id, entry.email)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-[var(--border)]">
                    <td colSpan="3" className="p-8 text-center text-[var(--muted-foreground)]">
                      {searchQuery ? (
                        <>
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No emails found matching "{searchQuery}"</p>
                        </>
                      ) : (
                        <>
                          <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>The waitlist is empty</p>
                          <p className="text-sm mt-1">New sign-ups will appear here</p>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info */}
        {filteredEntries.length > 0 && (
          <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)] bg-[var(--accent)] p-4 rounded-lg">
            <span>
              Showing {filteredEntries.length} of {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </span>
            <span>
              Use the Export CSV button to download all emails for your email campaign
            </span>
          </div>
        )}
      </div>
    </>
  );
}