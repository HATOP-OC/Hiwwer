import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

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
  refetchUser: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  activatePerformerMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<UserRole>('client');
  const initRef = useRef(false);
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

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('activeRole');
    setActiveRole('client');
  }, []);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    console.log('fetchUser called, token exists:', !!token);
    
    if (!token) {
      setIsLoading(false);
      initRef.current = true;
      return;
    }
    
    // Don't fetch if already loading to prevent race conditions
    setIsLoading(true);
    
    try {
      console.log('Fetching user profile from API...');
      const res = await fetch(`${API_BASE}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('API response status:', res.status);
      
      if (!res.ok) {
        // Only logout on 401, don't logout on network errors
        if (res.status === 401) {
          console.warn('Token expired or invalid (401), logging out');
          logout();
        } else {
          console.error('Failed to fetch user profile:', res.status);
        }
        setIsLoading(false);
        initRef.current = true;
        return;
      }
      
      const userData: User = await res.json();
      console.log('User data fetched successfully:', userData.id, userData.name);
      const updatedUser = { ...userData, telegramId: userData.telegramId || undefined };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      initRef.current = true;
    } catch (error) {
      console.error("Network error while fetching user", error);
      // Don't logout on network errors, only on 401
      // Try to load user from localStorage as fallback
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          console.log('Using cached user data:', parsedUser.id, parsedUser.name);
          setUser(parsedUser);
          initRef.current = true;
        } catch (e) {
          console.error('Failed to parse cached user');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE, logout]);

  useEffect(() => {
    // Only fetch user once on mount
    if (!initRef.current) {
      fetchUser();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      initRef.current = false; // Reset init flag to allow fetchUser to run
      await fetchUser();
    } catch (error: any) {
      setIsLoading(false);
      throw error;
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
      initRef.current = false; // Reset init flag to allow fetchUser to run
      await fetchUser();
    } catch (error: any) {
      setIsLoading(false);
      throw error;
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
      initRef.current = false; // Reset init flag to allow fetchUser to run
      await fetchUser();
    } catch (error) {
      setIsLoading(false);
      throw error;
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

  // Force refetch user (ignores initRef)
  const refetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    console.log('refetchUser called (force), token exists:', !!token);
    
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Force fetching user profile from API...');
      const res = await fetch(`${API_BASE}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('API response status:', res.status);
      
      if (!res.ok) {
        if (res.status === 401) {
          console.warn('Token expired or invalid (401), logging out');
          logout();
        } else {
          console.error('Failed to fetch user profile:', res.status);
        }
        setIsLoading(false);
        return;
      }
      
      const userData: User = await res.json();
      console.log('User data refetched successfully:', userData.id, userData.name);
      const updatedUser = { ...userData, telegramId: userData.telegramId || undefined };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Network error while refetching user", error);
      // Try to load user from localStorage as fallback
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          console.log('Using cached user data:', parsedUser.id, parsedUser.name);
          setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse cached user');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE, logout]);

  return (
    <AuthContext.Provider value={{ user, isLoading, activeRole, login, register, logout, telegramLogin, fetchUser, refetchUser, switchRole, activatePerformerMode }}>
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