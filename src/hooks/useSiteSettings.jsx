import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (isMounted) {
        if (error) {
          console.error("Could not fetch site settings:", error.message);
          // Fallback to default settings if table doesn't exist or fails to load
          setSettings({ maintenance_mode: false, allow_registration: true, primary_color: '#ed3279', logo_url: null });
        } else {
          setSettings(data);
        }
        setLoading(false);
      }
    }
    fetchSettings();

    return () => { isMounted = false; };
  }, []);

  return { settings, loading };
}