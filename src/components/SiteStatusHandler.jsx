import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/auth/AuthContext';

export default function SiteStatusHandler({ children }) {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const loading = settingsLoading || adminLoading || authLoading;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const isMaintenance = settings?.maintenance_mode || false;
  const isWaitlist = settings?.waitlist_mode || false;
  const allowedPaths = ['/waitlist', '/login'];

  // Admins can access admin pages even in maintenance mode
  if (isAdmin && location.pathname.startsWith('/admin')) {
    return children;
  }
  
  const isAllowedPath = allowedPaths.some(path => location.pathname.startsWith(path));

  if ((isMaintenance || isWaitlist) && !isAdmin && !isAllowedPath) {
    return <Navigate to="/waitlist" replace />;
  }

  return children;
}