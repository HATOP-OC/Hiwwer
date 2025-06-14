import { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'client' | 'performer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  rating?: number;
  telegramId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  telegramLogin: (telegramData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Використовуємо відносний шлях до API та проксі Vite
  const API_BASE = '/v1';

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      const parsed: User = JSON.parse(storedUser);
      // Використовуємо роль з токена
      setUser(parsed);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call API for login
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const { id, name, role: apiRole, token } = await res.json();
      // Store token and user data
      localStorage.setItem('token', token);
      const userData = { id, name, email, role: apiRole };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Використовуємо роль, яку передав бекенд
      const assignedRole = role;
      // Call API for register
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: assignedRole }),
      });
      if (!res.ok) throw new Error('Registration failed');
      const { id, role: apiRole, token } = await res.json();
      // Store token and user data
      localStorage.setItem('token', token);
      const userData = { id, name, email, role: apiRole };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const telegramLogin = async (telegramData: any) => {
    setIsLoading(true);
    try {
      // In a real app, this would verify the Telegram data with your API
      // For now, we'll simulate a successful login with mock data
      const mockUser: User = {
        id: '2',
        name: telegramData.first_name || 'Telegram User',
        email: `user_${telegramData.id}@telegram.org`,
        role: 'client',
        avatar: telegramData.photo_url || '/placeholder.svg',
        telegramId: telegramData.id.toString(),
        rating: 0
      };
      const userData = mockUser; // using mock role from data
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Telegram login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, telegramLogin }}>
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
