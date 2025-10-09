import { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'client' | 'performer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isPerformer?: boolean;
  avatar?: string;
  bio?: string;
  rating?: number;
  telegramId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  activeRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  telegramLogin: (telegramData: any) => Promise<void>;
  fetchUser: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  activatePerformerMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<UserRole>('client');
  const API_BASE = '/v1';

  // Встановлюємо activeRole при зміні користувача
  useEffect(() => {
    if (user) {
      // Якщо є збережений activeRole в localStorage, використовуємо його
      const savedRole = localStorage.getItem('activeRole') as UserRole;
      if (savedRole && (savedRole === 'client' || savedRole === 'performer' || savedRole === 'admin')) {
        setActiveRole(savedRole);
      } else {
        setActiveRole(user.role);
      }
    }
  }, [user]);

  const switchRole = (role: UserRole) => {
    console.log('AuthContext: Switching role to', role);
    setActiveRole(role);
    localStorage.setItem('activeRole', role);
    console.log('AuthContext: Role switched, new activeRole:', role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('activeRole');
    setActiveRole('client');
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401) logout();
        return;
      }
      const userData: User = await res.json();
      const updatedUser = { ...userData, telegramId: userData.telegramId || undefined };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }
      const data = await res.json();
      const token = data.token;
      localStorage.setItem('token', token);
      await fetchUser();
    } catch (error: any) {
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      const data = await res.json();
      const token = data.token;
      localStorage.setItem('token', token);
      await fetchUser();
    } catch (error: any) {
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const telegramLogin = async (telegramData: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login-with-telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: telegramData.id }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Telegram login failed');
      }
      const data = await res.json();
      const token = data.token;
      localStorage.setItem('token', token);
      await fetchUser();
    } catch (error) {
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const activatePerformerMode = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const res = await fetch(`${API_BASE}/users/activate-performer`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to activate performer mode');
      }

      const { user: updatedUser } = await res.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Automatically switch to performer mode
      if (updatedUser.isPerformer) {
        switchRole('performer');
      }
    } catch (error) {
      console.error('Failed to activate performer mode:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, activeRole, login, register, logout, telegramLogin, fetchUser, switchRole, activatePerformerMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}