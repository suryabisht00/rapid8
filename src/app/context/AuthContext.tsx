"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshNavbar: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { signIn, signOut } = useAuth();
  const router = useRouter();

  // Force a refresh of the navigation component
  const refreshNavbar = () => {
    // This will force a re-render of components that depend on this context
    setUser(prevUser => {
      if (prevUser) {
        return { ...prevUser };
      }
      return null;
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await signIn({ email, password });
      
      if (response.success && response.data) {
        setUser({
          userId: response.data.userId,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    signOut();
    setUser(null);
    // No need to redirect here as we're handling it in the Navbar component
  };

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userId = localStorage.getItem('userId') || '';
        const email = localStorage.getItem('userEmail') || '';
        const name = localStorage.getItem('userName') || '';
        const role = localStorage.getItem('userRole') || 'user';
        
        setUser({ userId, email, name, role });
      } catch (error) {
        console.error('Auth token validation error:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isLoading,
      login, 
      logout,
      refreshNavbar
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
