// Express types with user authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'performer' | 'admin';
  avatar?: string;
  bio?: string;
  rating?: number;
  telegramId?: string;
  createdAt: Date;
}
