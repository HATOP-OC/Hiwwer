import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Компонент для захисту адмін-панелі, дозволяє доступ лише адмінам
const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="text-center py-12">Завантаження...</div>;
  }

  if (!user) {
    // Якщо неавторизований, перенаправити на логін
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    // Якщо не адмін, перенаправити на головну
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
