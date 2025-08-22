import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLoading: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'nndp009@+-';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in on app start
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
    setAdminLoading(false);
  }, []);

  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const value = {
    isAdminAuthenticated,
    adminLoading,
    adminLogin,
    adminLogout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

// Hook to protect admin routes
export function useRequireAdminAuth() {
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminLoading && !isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, adminLoading, navigate]);

  return { isAdminAuthenticated, adminLoading };
}
