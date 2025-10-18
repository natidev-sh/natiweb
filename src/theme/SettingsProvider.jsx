import React, { createContext, useContext, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (settings?.primary_color) {
      // Fallback to default if color is invalid
      const color = settings.primary_color.match(/^#[0-9a-f]{6}$/i) ? settings.primary_color : '#ed3279';
      document.documentElement.style.setProperty('--primary', color);
    }
  }, [settings]);

  const value = { settings, loading };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}