import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Send, Loader2, Mail, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { Link } from 'react-router-dom';

export default function AdminEmailBroadcast() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipientGroup, setRecipientGroup] = useState('waitlist');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('marketing_emails')
      .select('id, subject, recipient_group, status, sent_at, created_at')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching email history:', error);
    else setHistory(data);
    setLoadingHistory(false);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !content) {
      setError('Subject and content are required.');
      return;
    }
    setSending(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: functionError } = await supabase.functions.invoke('send-broadcast-email', {
        body: { subject, content, recipientGroup },
      });

      if (functionError) throw functionError;
      if (data.error) throw new Error(data.error);

      setSuccess(data.message || 'Email sent successfully!');
      setSubject('');
      setContent('');
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const easymdeOptions = useMemo(() => ({
    spellChecker: false,
  }), []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-rose-400" />;
      case 'sending': return <Loader2 className="h-4 w-4 animate-spin" />;
      default: return <Mail className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <>
      <PageMeta title="Email Broadcast | Admin" />
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Email Broadcast Tool</h1>
          <p className="text-[var(--muted-foreground)]">Send emails to your users and waitlist subscribers.</p>
        </div>

        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Important Setup</h3>
            <p className="text-sm opacity-90">
              This tool uses Resend for email delivery. Please go to the <Link to="/admin/integrations" className="font-bold underline">Integrations</Link> page and add your Resend API key. You must also have a verified domain with Resend to send emails.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full input-style"
                required
              />
            </div>
            <div>
              <label htmlFor="recipientGroup" className="block text-sm font-medium mb-1">Recipient Group</label>
              <select
                id="recipientGroup"
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
                className="w-full input-style"
              >
                <option value="waitlist">Waitlist Subscribers</option>
                <option value="all_users">All Registered Users</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content (HTML supported)</label>
            <div className="prose-editor-wrapper">
              <SimpleMdeReact
                id="content"
                value={content}
                onChange={handleContentChange}
                options={easymdeOptions}
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-rose-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}

          <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-60">
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span>{sending ? 'Sending...' : 'Send Broadcast'}</span>
          </button>
        </form>

        <div>
          <h2 className="text-xl font-bold mb-4">Broadcast History</h2>
          {loadingHistory ? <p>Loading history...</p> : (
            <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
              <table className="w-full text-sm text-left">
                <thead className="bg-[var(--background-darkest)]">
                  <tr>
                    <th className="p-3 font-medium">Subject</th>
                    <th className="p-3 font-medium">Recipients</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id} className="border-t border-[var(--border)]">
                      <td className="p-3 font-medium">{item.subject}</td>
                      <td className="p-3 capitalize">{item.recipient_group.replace('_', ' ')}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5">
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>
                      <td className="p-3 opacity-70">{item.sent_at ? new Date(item.sent_at).toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>{`.input-style { background-color: var(--background); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.5rem 0.75rem; width: 100%; font-size: 0.875rem; } .input-style:focus { border-color: var(--primary); outline: 2px solid transparent; box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--primary); } .prose-editor-wrapper .editor-toolbar, .prose-editor-wrapper .cm-s-easymde, .prose-editor-wrapper .editor-statusbar { background-color: var(--background-darkest); border-color: var(--border); color: var(--foreground); } .prose-editor-wrapper .editor-toolbar button:hover, .prose-editor-wrapper .editor-toolbar button.active { background-color: var(--muted); border-color: var(--border); } .prose-editor-wrapper .editor-toolbar button { color: var(--muted-foreground); } .prose-editor-wrapper .editor-toolbar button.active, .prose-editor-wrapper .editor-toolbar button:hover { color: var(--foreground); } .prose-editor-wrapper .cm-s-easymde .CodeMirror { background-color: var(--background-darkest); color: var(--foreground); border-color: var(--border); } .prose-editor-wrapper .cm-s-easymde .CodeMirror-cursor { border-left: 1px solid var(--foreground); } .prose-editor-wrapper .cm-s-easymde .CodeMirror-selected { background: color-mix(in oklab, var(--primary) 30%, transparent); }`}</style>
    </>
  );
}