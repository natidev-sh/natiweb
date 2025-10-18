import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Search, Mail, Clock } from 'lucide-react';

export default function AdminWaitlist() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWaitlist = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('waitlist')
      .select('email, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching waitlist:', error);
    } else {
      setEntries(data);
    }
    setLoading(false);
  }, []);

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

  return (
    <>
      <PageMeta title="Waitlist Management | Admin" />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Waitlist Management</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
          />
        </div>

        {loading ? (
          <p>Loading waitlist...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--background-darkest)]">
                <tr>
                  <th className="p-3 font-medium flex items-center gap-2"><Mail className="h-4 w-4" /> Email</th>
                  <th className="p-3 font-medium flex items-center gap-2"><Clock className="h-4 w-4" /> Signed Up On</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length > 0 ? (
                  filteredEntries.map(entry => (
                    <tr key={entry.email} className="border-t border-[var(--border)]">
                      <td className="p-3 font-medium">{entry.email}</td>
                      <td className="p-3 opacity-70">{new Date(entry.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-[var(--border)]">
                    <td colSpan="2" className="p-3 text-center opacity-70">
                      {searchQuery ? 'No matching emails found.' : 'The waitlist is empty.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}