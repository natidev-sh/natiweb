import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';

export function useSubscriptionStatus() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState('Free'); // Default to Free
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setStatus('Free');
      setLoading(false);
      setProfile(null);
      return;
    }

    let isMounted = true;

    async function checkStatus() {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('role, subscription_status, plan_id')
        .eq('id', user.id)
        .single();

      if (!isMounted) return;

      if (error) {
        console.error('Error fetching user profile:', error);
        setStatus('Free');
        setProfile(null);
      } else {
        setProfile(data);
        if (data.role === 'admin') {
          setStatus('Admin');
        } else if (data.subscription_status === 'active') {
          // For now, any active subscription is considered "Pro".
          // This can be expanded later to check plan_id for "Max" status.
          setStatus('Pro');
        } else {
          setStatus('Free');
        }
      }
      setLoading(false);
    }

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  return { status, profile, loading };
}