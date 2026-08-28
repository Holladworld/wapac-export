import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, type SiteSettings } from '../lib/supabase';

type SettingsContextType = {
  settings: SiteSettings;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('key, value');
        if (cancelled) return;
        if (error) throw error;
        const map: SiteSettings = {};
        (data || []).forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value;
        });
        setSettings(map);
      } catch {
        // Settings will fall back to defaults throughout the app
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return <SettingsContext.Provider value={{ settings, loading }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
