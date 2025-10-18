import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from './hooks/useAdmin';
import { useAuth } from './auth/AuthContext';

export default function AdminRoute({ children }) {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user, loading: authLoading } = useAuth();

  if (authLoading || adminLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
}