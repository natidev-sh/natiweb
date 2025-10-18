import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { 
  Ticket, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  User,
  Send,
  Loader2
} from 'lucide-react'

const statusColors = {
  open: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  waiting_for_user: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  resolved: 'bg-green-500/10 text-green-600 border-green-500/20',
  closed: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
}

const priorityColors = {
  low: 'text-gray-500',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500'
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketMessages, setTicketMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchTickets()
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('support_tickets_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'support_tickets' }, 
        () => {
          fetchTickets()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketMessages(selectedTicket.id)
    }
  }, [selectedTicket])

  const fetchTickets = async () => {
    setLoading(true)
    let query = supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus)
    }

    const { data, error } = await query

    if (!error && data) {
      // Fetch user profiles separately to avoid join issues
      const ticketsWithProfiles = await Promise.all(
        data.map(async (ticket) => {
          if (ticket.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, username, first_name, last_name')
              .eq('id', ticket.user_id)
              .single()
            return { ...ticket, profiles: profile }
          }
          return ticket
        })
      )
      setTickets(ticketsWithProfiles)
    }
    setLoading(false)
  }

  const fetchTicketMessages = async (ticketId) => {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setTicketMessages(data)
    }
  }

  const updateTicketStatus = async (ticketId, newStatus) => {
    const updates = { status: newStatus }
    
    if (newStatus === 'resolved') {
      updates.resolved_at = new Date().toISOString()
    } else if (newStatus === 'closed') {
      updates.closed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)

    if (!error) {
      fetchTickets()
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, ...updates })
      }
    }
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyMessage.trim() || !selectedTicket) return

    setSending(true)
    try {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: (await supabase.auth.getUser()).data.user.id,
          message: replyMessage,
          is_staff_reply: true
        })

      if (error) throw error

      setReplyMessage('')
      fetchTicketMessages(selectedTicket.id)
      
      // Update ticket status to in_progress if it's open
      if (selectedTicket.status === 'open') {
        await updateTicketStatus(selectedTicket.id, 'in_progress')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticket_number.toString().includes(searchQuery) ||
    ticket.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    waiting: tickets.filter(t => t.status === 'waiting_for_user').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Support Tickets</h1>
        <p className="text-muted-foreground">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Open</div>
              <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
            </div>
            <Clock className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>
        
        <div className="p-4 rounded-lg border bg-yellow-500/5 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.in_progress}</div>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-purple-500/5 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Waiting</div>
              <div className="text-2xl font-bold text-purple-600">{stats.waiting}</div>
            </div>
            <User className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Resolved</div>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value)
            fetchTickets()
          }}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting_for_user">Waiting for User</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted/30 border-b">
            <h2 className="font-semibold">Tickets ({filteredTickets.length})</h2>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Ticket className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tickets found</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-sm text-muted-foreground">#{ticket.ticket_number}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[ticket.status]}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-medium mb-1 truncate">{ticket.subject}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={priorityColors[ticket.priority]}>● {ticket.priority}</span>
                    <span>•</span>
                    <span>{ticket.user_email}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-muted/30 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Ticket #{selectedTicket.ticket_number}</div>
                    <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                      className={`px-4 py-2 text-sm rounded-lg border font-medium cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${statusColors[selectedTicket.status]}`}
                      style={{ minWidth: '160px' }}
                    >
                      <option value="open" className="bg-background">🔵 Open</option>
                      <option value="in_progress" className="bg-background">🟡 In Progress</option>
                      <option value="waiting_for_user" className="bg-background">🟣 Waiting for User</option>
                      <option value="resolved" className="bg-background">🟢 Resolved</option>
                      <option value="closed" className="bg-background">⚫ Closed</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <span className="text-muted-foreground">User:</span>
                    {selectedTicket.user_id ? (
                      <Link 
                        to={`/admin/users/${selectedTicket.user_id}`}
                        className="ml-2 font-medium text-primary hover:underline inline-flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        {selectedTicket.profiles ? 
                          `${selectedTicket.profiles.first_name || ''} ${selectedTicket.profiles.last_name || ''}`.trim() || 
                          selectedTicket.profiles.username || 
                          selectedTicket.user_email :
                          selectedTicket.user_email}
                      </Link>
                    ) : (
                      <span className="ml-2 font-medium text-muted-foreground">
                        {selectedTicket.user_email || 'Anonymous'}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <span className={`ml-2 font-medium capitalize ${priorityColors[selectedTicket.priority]}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 font-medium">{selectedTicket.category.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <span className="ml-2 font-medium capitalize">{selectedTicket.source}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                  </div>
                  {selectedTicket.desktop_logs_url && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Desktop Logs:</span>
                      <a 
                        href={selectedTicket.desktop_logs_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-primary hover:underline"
                      >
                        View Logs
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 max-h-96 overflow-y-auto space-y-4 bg-background">
                {/* Original Description */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-sm">{selectedTicket.user_email}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedTicket.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{selectedTicket.description}</div>
                </div>

                {/* Messages */}
                {ticketMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${
                      msg.is_staff_reply
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        {msg.is_staff_reply ? 'Support Team' : selectedTicket.user_email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {selectedTicket.status !== 'closed' && (
                <div className="p-6 border-t bg-muted/30">
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={4}
                      className="w-full px-4 py-3 border rounded-lg bg-background resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={!replyMessage.trim() || sending}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {sending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Reply
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateTicketStatus(selectedTicket.id, 'waiting_for_user')}
                        className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                      >
                        Mark Waiting
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-24 text-center text-muted-foreground border rounded-lg">
              <Ticket className="h-16 w-16 mb-4 opacity-50" />
              <p>Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
