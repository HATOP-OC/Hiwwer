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

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Helper to generate UUID (v4)
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Retrieve users list from localStorage
      const stored = localStorage.getItem('users') || '[]';
      const usersList: Array<User & { password: string }> = JSON.parse(stored);
      const found = usersList.find(u => u.email === email && u.password === password);
      if (!found) {
        throw new Error('Invalid email or password');
      }
      // Remove password before storing in context
      const { password: _, ...userData } = found;
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
      // Retrieve existing users
      const stored = localStorage.getItem('users') || '[]';
      const usersList: Array<User & { password: string }> = JSON.parse(stored);
      if (usersList.find(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      // Create new user entry
      const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
        role,
        avatar: '/placeholder.svg',
        rating: 0,
      };
      usersList.push(newUser);
      localStorage.setItem('users', JSON.stringify(usersList));
      // Store user in context without password
      const { password: _, ...userData } = newUser;
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
