import React, { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/auth/AuthContext.jsx'
import PageMeta from '@/components/PageMeta'
import FooterGlow from '@/components/FooterGlow'
import { Link } from 'react-router-dom'
import { 
  Ticket, 
  Send, 
  Loader2, 
  CheckCircle,
  Clock,
  MessageSquare,
  AlertCircle,
  Bug,
  Lightbulb,
  Wrench,
  CreditCard,
  User,
  HelpCircle,
  ArrowRight
} from 'lucide-react'

const categoryIcons = {
  bug_report: Bug,
  feature_request: Lightbulb,
  technical_support: Wrench,
  billing: CreditCard,
  account: User,
  other: HelpCircle
}

const categoryLabels = {
  bug_report: 'Bug Report',
  feature_request: 'Feature Request',
  technical_support: 'Technical Support',
  billing: 'Billing',
  account: 'Account',
  other: 'Other'
}

const statusColors = {
  open: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  in_progress: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  waiting_for_user: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  resolved: 'bg-green-500/10 text-green-600 dark:text-green-400',
  closed: 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
}

export default function Support() {
  const { user } = useAuth()
  const [view, setView] = useState('submit') // 'submit' or 'tickets'
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketMessages, setTicketMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'other',
    priority: 'medium'
  })
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    if (user && view === 'tickets') {
      fetchTickets()
    }
  }, [user, view])

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketMessages(selectedTicket.id)
    }
  }, [selectedTicket])

  const fetchTickets = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTickets(data)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please log in to submit a support ticket')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: formData.subject,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          source: 'web'
        })
        .select()
        .single()

      if (error) throw error

      setSubmitSuccess(true)
      setFormData({ subject: '', description: '', category: 'other', priority: 'medium' })
      
      setTimeout(() => {
        setView('tickets')
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Error submitting ticket:', error)
      alert('Failed to submit ticket. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedTicket) return

    try {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: user.id,
          message: newMessage,
          is_staff_reply: false
        })

      if (error) throw error

      setNewMessage('')
      fetchTicketMessages(selectedTicket.id)
      
      // Update ticket status to 'open' if it was 'waiting_for_user'
      if (selectedTicket.status === 'waiting_for_user') {
        await supabase
          .from('support_tickets')
          .update({ status: 'open' })
          .eq('id', selectedTicket.id)
        fetchTickets()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  return (
    <>
      <PageMeta
        title="Support | Nati.dev"
        description="Get help with Nati.dev - Submit a support ticket"
      />

      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <div className="relative border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-darkest)] overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />
          
          <div className="relative max-w-6xl mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Ticket className="h-7 w-7 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Support Center
                  </h1>
                </div>
                <p className="text-lg text-[var(--muted-foreground)] mb-6 max-w-2xl">
                  Get help from our team. We typically respond within 24 hours.
                </p>
                <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                  <Link 
                    to="/docs" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Documentation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link 
                    to="/blog" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Knowledge Base
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
                  <div className="text-2xl font-bold text-blue-600">24h</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Avg Response</div>
                </div>
                <div className="text-center p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Tabs */}
          {user && (
            <div className="flex gap-4 mb-8 border-b border-[var(--border)]">
              <button
                onClick={() => setView('submit')}
                className={`pb-3 px-1 font-medium transition-colors ${
                  view === 'submit'
                    ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                Submit Ticket
              </button>
              <button
                onClick={() => setView('tickets')}
                className={`pb-3 px-1 font-medium transition-colors ${
                  view === 'tickets'
                    ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                My Tickets
              </button>
            </div>
          )}

          {/* Submit Ticket Form */}
          {view === 'submit' && (
            <div className="max-w-2xl">
              {submitSuccess && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-semibold text-green-600 dark:text-green-400">Ticket Submitted!</div>
                    <div className="text-sm text-[var(--muted-foreground)]">We'll get back to you soon.</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                    placeholder="Please provide as much detail as possible..."
                  />
                </div>

                {!user && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="h-5 w-5 text-amber-500 inline mr-2" />
                    <span className="text-sm">Please <Link to="/login" className="text-[var(--primary)] hover:underline">log in</Link> to submit a support ticket.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !user}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Submit Ticket
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* My Tickets View */}
          {view === 'tickets' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tickets List */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-12 text-[var(--muted-foreground)]">
                    <Ticket className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No tickets yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => {
                      const Icon = categoryIcons[ticket.category]
                      return (
                        <button
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedTicket?.id === ticket.id
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                              : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span className="font-medium text-sm">#{ticket.ticket_number}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="font-semibold text-sm mb-1 truncate">{ticket.subject}</div>
                          <div className="text-xs text-[var(--muted-foreground)]">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Ticket Detail */}
              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                    {/* Ticket Header */}
                    <div className="p-6 border-b border-[var(--border)] bg-[var(--background-darkest)]">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-sm text-[var(--muted-foreground)] mb-1">
                            Ticket #{selectedTicket.ticket_number}
                          </div>
                          <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColors[selectedTicket.status]}`}>
                          {selectedTicket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-[var(--muted-foreground)]">
                        <span>{categoryLabels[selectedTicket.category]}</span>
                        <span>•</span>
                        <span className="capitalize">{selectedTicket.priority} Priority</span>
                        <span>•</span>
                        <span>{new Date(selectedTicket.created_at).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                      {/* Original ticket description */}
                      <div className="p-4 rounded-lg bg-[var(--muted)]/30">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-sm">You</span>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {new Date(selectedTicket.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{selectedTicket.description}</div>
                      </div>

                      {/* Thread messages */}
                      {ticketMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-lg ${
                            msg.is_staff_reply
                              ? 'bg-blue-500/10 border border-blue-500/20'
                              : 'bg-[var(--muted)]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {msg.is_staff_reply ? (
                              <>
                                <Wrench className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-sm text-blue-600 dark:text-blue-400">
                                  Support Team
                                </span>
                              </>
                            ) : (
                              <>
                                <User className="h-4 w-4" />
                                <span className="font-medium text-sm">You</span>
                              </>
                            )}
                            <span className="text-xs text-[var(--muted-foreground)]">
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Form */}
                    {selectedTicket.status !== 'closed' && (
                      <div className="p-6 border-t border-[var(--border)]">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          />
                          <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Send
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center text-[var(--muted-foreground)]">
                    <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
                    <p>Select a ticket to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <FooterGlow />
    </>
  )
}
