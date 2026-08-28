import { createContext, useContext, useState, type ReactNode } from 'react';

type AdminUser = { email: string; display_name: string; role: string };

type AdminContextType = {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const SESSION_KEY = 'wapac_admin_session';
const TOKEN_KEY = 'wapac_admin_token';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true' && !!sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('wapac_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
      setIsAuthenticated(true);
      setUser(data.user);
      sessionStorage.setItem(SESSION_KEY, 'true');
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem('wapac_admin_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem('wapac_admin_user');
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
