import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user, activeRole } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (activeRole === 'performer') {
      navigate('/my-services');
    } else {
      navigate('/my-orders');
    }
  }, [user, activeRole, navigate]);

  return null; // This component doesn't render anything, just redirects
};

export default DashboardRedirect;