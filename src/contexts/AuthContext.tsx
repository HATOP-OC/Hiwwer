
import { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'client' | 'performer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would call your API
      // For now, we'll simulate a successful login with mock data
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        role: 'client',
        avatar: '/placeholder.svg',
        rating: 4.5
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // In a real app, this would call your API
      // For now, we'll simulate a successful registration with mock data
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        role: role,
        avatar: '/placeholder.svg',
        rating: 0
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
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
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
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
