import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { 
  Users, TrendingUp, Mail, Calendar, Sparkles, 
  Activity, BarChart3, RefreshCw, ArrowUpRight, ArrowDownRight,
  UserPlus, Globe, Zap
} from 'lucide-react';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    waitlist: {
      total: 0,
      last24h: 0,
      last7days: 0,
      last30days: 0,
      growth: 0,
      previousMonth: 0,
    },
    users: {
      total: 0,
      active: 0,
      last30days: 0,
    },
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchWaitlistStats(),
        fetchUserStats(),
      ]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaitlistStats = async () => {
    const { data, error } = await supabase
      .from('waitlist')
      .select('created_at');

    if (error) {
      console.error('Error fetching waitlist:', error);
      return;
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const last24h = data.filter(entry => new Date(entry.created_at) > oneDayAgo).length;
    const last7days = data.filter(entry => new Date(entry.created_at) > sevenDaysAgo).length;
    const last30days = data.filter(entry => new Date(entry.created_at) > thirtyDaysAgo).length;
    const previous30days = data.filter(entry => {
      const date = new Date(entry.created_at);
      return date > sixtyDaysAgo && date <= thirtyDaysAgo;
    }).length;

    const growth = previous30days > 0 
      ? ((last30days - previous30days) / previous30days * 100).toFixed(1)
      : last30days > 0 ? 100 : 0;

    setStats(prev => ({
      ...prev,
      waitlist: {
        total: data.length,
        last24h,
        last7days,
        last30days,
        previousMonth: previous30days,
        growth: parseFloat(growth),
      },
    }));
  };

  const fetchUserStats = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('created_at, updated_at');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const last30days = data.filter(entry => new Date(entry.created_at) > thirtyDaysAgo).length;
    const activeUsers = data.filter(entry => new Date(entry.updated_at) > sevenDaysAgo).length;

    setStats(prev => ({
      ...prev,
      users: {
        total: data.length,
        active: activeUsers,
        last30days,
      },
    }));
  };

  const StatCard = ({ title, value, change, icon: Icon, color, badge, trend, subtitle }) => (
    <div className={`bg-gradient-to-br ${color} border rounded-xl p-6 transition-all hover:shadow-lg hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${color.replace('from-', 'bg-').replace('/10', '/20').split(' ')[0]}`}>
          <Icon className={`h-5 w-5 ${color.replace('from-', 'text-').replace('/10', '').split(' ')[0]}`} />
        </div>
        {badge && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${color.replace('from-', 'bg-').replace('/10', '/20').split(' ')[0]} ${color.replace('from-', 'text-').replace('/10', '').split(' ')[0]}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-sm text-[var(--muted-foreground)] font-medium">{title}</p>
        <p className="text-4xl font-bold">{value.toLocaleString()}</p>
        {subtitle && (
          <p className="text-xs text-[var(--muted-foreground)]">{subtitle}</p>
        )}
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            ) : null}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-[var(--muted-foreground)]'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <PageMeta title="Analytics | Admin Dashboard" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Analytics Dashboard
            </h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              Real-time insights into your Nati.dev growth
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-[var(--primary)]" />
              <p className="text-[var(--muted-foreground)]">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Waitlist Statistics */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Waitlist Performance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Subscribers"
                  value={stats.waitlist.total}
                  icon={Users}
                  color="from-blue-500/10 to-blue-600/10 border-blue-500/20"
                  badge="All Time"
                  subtitle="Total email signups"
                />
                <StatCard
                  title="Last 24 Hours"
                  value={stats.waitlist.last24h}
                  icon={Zap}
                  color="from-green-500/10 to-green-600/10 border-green-500/20"
                  badge="24h"
                  subtitle="New signups today"
                />
                <StatCard
                  title="Last 7 Days"
                  value={stats.waitlist.last7days}
                  icon={TrendingUp}
                  color="from-purple-500/10 to-purple-600/10 border-purple-500/20"
                  badge="7d"
                  subtitle="Weekly growth"
                />
                <StatCard
                  title="Last 30 Days"
                  value={stats.waitlist.last30days}
                  icon={Calendar}
                  color="from-rose-500/10 to-rose-600/10 border-rose-500/20"
                  badge="30d"
                  change={stats.waitlist.growth}
                  trend={stats.waitlist.growth > 0 ? 'up' : stats.waitlist.growth < 0 ? 'down' : 'neutral'}
                />
              </div>
            </div>

            {/* Growth Insights */}
            <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[var(--primary)]/20 rounded-xl">
                  <Activity className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Growth Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--muted-foreground)] mb-1">Monthly Growth</p>
                      <p className="text-2xl font-bold">
                        {stats.waitlist.growth > 0 ? '+' : ''}{stats.waitlist.growth}%
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {stats.waitlist.last30days} new vs {stats.waitlist.previousMonth} last month
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)] mb-1">Daily Average</p>
                      <p className="text-2xl font-bold">
                        {Math.round(stats.waitlist.last30days / 30)}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        signups per day (30d avg)
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)] mb-1">Projected Monthly</p>
                      <p className="text-2xl font-bold">
                        {Math.round((stats.waitlist.last7days / 7) * 30)}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        based on 7-day trend
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Metrics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  title="Total Users"
                  value={stats.users.total}
                  icon={Globe}
                  color="from-indigo-500/10 to-indigo-600/10 border-indigo-500/20"
                  subtitle="Registered accounts"
                />
                <StatCard
                  title="Active Users"
                  value={stats.users.active}
                  icon={Activity}
                  color="from-emerald-500/10 to-emerald-600/10 border-emerald-500/20"
                  subtitle="Active in last 7 days"
                />
                <StatCard
                  title="New Users (30d)"
                  value={stats.users.last30days}
                  icon={UserPlus}
                  color="from-orange-500/10 to-orange-600/10 border-orange-500/20"
                  subtitle="Joined last month"
                />
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-[var(--accent)] border border-[var(--border)] rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                Quick Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--primary)]/10 rounded-lg mt-0.5">
                    <TrendingUp className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-medium">Conversion Rate</p>
                    <p className="text-[var(--muted-foreground)]">
                      {stats.waitlist.total > 0 
                        ? ((stats.users.total / stats.waitlist.total) * 100).toFixed(1)
                        : 0}% of waitlist converted to users
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg mt-0.5">
                    <Activity className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Engagement Rate</p>
                    <p className="text-[var(--muted-foreground)]">
                      {stats.users.total > 0
                        ? ((stats.users.active / stats.users.total) * 100).toFixed(1)
                        : 0}% of users are active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
