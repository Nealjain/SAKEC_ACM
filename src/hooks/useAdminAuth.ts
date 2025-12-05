import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    
    if (!adminSession) {
      navigate('/admin');
      return;
    }

    try {
      const session = JSON.parse(adminSession);
      if (session && session.username) {
        setIsAuthenticated(true);
      } else {
        navigate('/admin');
      }
    } catch (err) {
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { isAuthenticated, loading };
}
