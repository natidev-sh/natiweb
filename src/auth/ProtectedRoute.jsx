import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchProfile() {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (isMounted) {
        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
        setLoading(false);
      }
    }
    fetchProfile();

    return () => { isMounted = false; };
  }, [user, authLoading, location.pathname]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile?.username && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding/profile" replace />;
  }

  return children;
}