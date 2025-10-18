import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, CheckCircle, ArrowRight, Ticket, Clock, TrendingUp } from 'lucide-react';
import PageMeta from '@/components/PageMeta';
import { Link } from 'react-router-dom';
import { SimpleLineChart, SimpleBarChart } from '@/components/SimpleChart';

function StatCard({ title, value, icon, loading, href, trend }) {
  const CardContent = (
    <div className={`rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] p-5 ${href ? 'cursor-pointer hover:border-[var(--primary)] transition-all hover:shadow-lg' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--muted-foreground)]">{title}</p>
        {icon}
      </div>
      <div className="mt-2 flex items-end justify-between">
        {loading ? (
          <div className="h-8 w-16 bg-[var(--muted)] rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
        {trend && !loading && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{CardContent}</Link>;
  }
  
  return CardContent;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, posts: 0, publishedPosts: 0, openTickets: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [ticketStatusData, setTicketStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7); // 1, 7, 30, 365 days

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [
          { count: userCount, error: userError },
          { count: postCount, error: postError },
          { count: publishedPostCount, error: publishedPostError },
          { count: openTicketCount, error: ticketError },
          { data: usersData, error: usersError },
          { data: postsData, error: postsError },
          { data: ticketsData, error: ticketsError }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('posts').select('*', { count: 'exact', head: true }),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('published', true),
          supabase.from('support_tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
          supabase.from('profiles').select('id, first_name, last_name, username, updated_at').order('updated_at', { ascending: false }).limit(5),
          supabase.from('posts').select('id, title, slug, published, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('support_tickets').select('id, ticket_number, subject, status, priority, user_email, created_at').order('created_at', { ascending: false }).limit(5)
        ]);

        if (userError || postError || publishedPostError || ticketError || usersError || postsError || ticketsError) {
          throw new Error('Failed to fetch some dashboard data.');
        }

        setStats({
          users: userCount,
          posts: postCount,
          publishedPosts: publishedPostCount,
          openTickets: openTicketCount || 0,
        });
        setRecentUsers(usersData);
        setRecentPosts(postsData);
        setRecentTickets(ticketsData || []);

        // Fetch user growth data (last 7 days)
        const userGrowth = await fetchUserGrowthData();
        console.log('User Growth Data:', userGrowth);
        setUserGrowthData(userGrowth);

        // Fetch ticket status breakdown
        const ticketStats = await fetchTicketStatusData();
        console.log('Ticket Status Data:', ticketStats);
        setTicketStatusData(ticketStats);

      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [timeRange]);

  async function fetchUserGrowthData() {
    try {
      const data = [];
      const daysToFetch = timeRange === 1 ? 1 : timeRange === 7 ? 7 : timeRange === 30 ? 30 : 365;
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = daysToFetch - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        // Try updated_at first since profiles might not have created_at
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', date.toISOString())
          .lt('updated_at', nextDate.toISOString());
        
        // Create label based on time range
        let label;
        if (timeRange === 1) {
          label = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (timeRange === 7) {
          label = days[date.getDay()];
        } else if (timeRange === 30) {
          label = `${months[date.getMonth()]} ${date.getDate()}`;
        } else {
          label = `${months[date.getMonth()]}`;
        }
        
        if (error) {
          console.error('Error fetching user count for day:', error);
          data.push({ label, value: 0 });
        } else {
          data.push({ label, value: count || 0 });
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchUserGrowthData:', error);
      return [];
    }
  }

  async function fetchTicketStatusData() {
    try {
      const statuses = [
        { key: 'open', label: 'Open' },
        { key: 'in_progress', label: 'Progress' },
        { key: 'waiting_for_user', label: 'Waiting' },
        { key: 'resolved', label: 'Resolved' },
        { key: 'closed', label: 'Closed' }
      ];
      
      const data = [];
      
      for (const status of statuses) {
        const { count, error } = await supabase
          .from('support_tickets')
          .select('*', { count: 'exact', head: true })
          .eq('status', status.key);
        
        if (error) console.error(`Error fetching ${status.key} tickets:`, error);
        
        data.push({
          label: status.label,
          value: count || 0
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchTicketStatusData:', error);
      return [];
    }
  }

  return (
    <>
      <PageMeta title="Admin Dashboard | Nati.dev" />
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--muted-foreground)]">An overview of your application's activity.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Users" 
            value={stats.users} 
            icon={<Users className="h-5 w-5 text-[var(--muted-foreground)]" />} 
            loading={loading}
            href="/admin/users"
            trend={12}
          />
          <StatCard 
            title="Total Posts" 
            value={stats.posts} 
            icon={<FileText className="h-5 w-5 text-[var(--muted-foreground)]" />} 
            loading={loading}
            href="/admin/posts"
            trend={5}
          />
          <StatCard 
            title="Published Posts" 
            value={stats.publishedPosts} 
            icon={<CheckCircle className="h-5 w-5 text-[var(--muted-foreground)]" />} 
            loading={loading}
            href="/admin/posts"
            trend={8}
          />
          <StatCard 
            title="Open Tickets" 
            value={stats.openTickets} 
            icon={<Ticket className="h-5 w-5 text-[var(--muted-foreground)]" />} 
            loading={loading}
            href="/admin/tickets"
            trend={-3}
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                User Growth
              </h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
              >
                <option value={1}>Last 24 Hours</option>
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={365}>Last Year</option>
              </select>
            </div>
            {loading ? (
              <div className="h-[180px] bg-muted/30 rounded animate-pulse" />
            ) : (
              <>
                <SimpleLineChart 
                  data={userGrowthData}
                />
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {timeRange === 1 ? 'Last 24 hours' : 
                     timeRange === 7 ? 'Last 7 days' : 
                     timeRange === 30 ? 'Last 30 days' : 'Last year'}
                  </span>
                  <span className="font-semibold text-primary">
                    {userGrowthData.reduce((sum, d) => sum + d.value, 0)} users
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Support Tickets (By Status)
              </h3>
            </div>
            {loading ? (
              <div className="h-[230px] bg-muted/30 rounded animate-pulse" />
            ) : (
              <>
                <SimpleBarChart 
                  data={ticketStatusData}
                />
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between text-sm">
                  <span className="text-muted-foreground">Resolution rate</span>
                  <span className="font-semibold text-green-500">
                    {(() => {
                      const total = ticketStatusData.reduce((sum, d) => sum + d.value, 0);
                      const resolved = ticketStatusData.find(d => d.label === 'Resolved')?.value || 0;
                      const closed = ticketStatusData.find(d => d.label === 'Closed')?.value || 0;
                      const rate = total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0;
                      return `${rate}%`;
                    })()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-semibold">Recent Signups</h3>
              <Link to="/admin/users" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-[var(--muted)] rounded animate-pulse" />)
              ) : recentUsers.map(user => (
                <div key={user.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'New User'}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">@{user.username || '...'}</p>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">{new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-semibold">Recent Posts</h3>
              <Link to="/admin/posts" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-[var(--muted)] rounded animate-pulse" />)
              ) : recentPosts.map(post => (
                <div key={post.id} className="flex justify-between items-center">
                  <div>
                    <Link to={`/admin/posts/edit/${post.slug}`} className="font-medium hover:text-[var(--primary)] transition-colors">{post.title}</Link>
                    <p className="text-xs text-[var(--muted-foreground)]">Created {new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  {post.published ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">Published</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-500/10 text-gray-400">Draft</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-semibold">Recent Tickets</h3>
              <Link to="/admin/tickets" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-[var(--muted)] rounded animate-pulse" />)
              ) : recentTickets.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)] text-center py-4">No tickets yet</p>
              ) : recentTickets.map(ticket => (
                <div key={ticket.id} className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <Link to="/admin/tickets" className="font-medium hover:text-[var(--primary)] transition-colors text-sm line-clamp-1">
                      #{ticket.ticket_number} {ticket.subject}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400' :
                      ticket.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="truncate">{ticket.user_email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}