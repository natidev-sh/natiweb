import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function PublicRouteOnly({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setIsFullyAuthenticated(false);
      return;
    }

    let isMounted = true;
    supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          console.error("Error getting AAL:", error);
          setIsFullyAuthenticated(false);
        } else if (data) {
          // Fully authenticated if current level is the highest possible level
          setIsFullyAuthenticated(data.currentLevel === data.nextLevel);
        }
        setLoading(false);
      });
    
    return () => { isMounted = false; };
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isFullyAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}