import { useState } from 'react';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
    name: string;
    role: string;
    token?: string;
  };
  error?: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (userData: SignInData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://rapid8-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || 'Failed to sign in');
        return { success: false, message: data.message, error: data.message };
      }
      
      // Store token and user data in localStorage for authentication
      if (data.data) {
        localStorage.setItem('authToken', data.data.token || '');
        localStorage.setItem('userRole', data.data.role || '');
        localStorage.setItem('userId', data.data.userId || '');
        localStorage.setItem('userEmail', data.data.email || '');
        localStorage.setItem('userName', data.data.name || '');
        
        // Force a refresh of the page to update the navbar
        window.dispatchEvent(new Event('storage')); // This triggers storage event listeners
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      return { success: false, message: errorMessage, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: SignUpData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://rapid8-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || 'Failed to sign up');
        return { success: false, message: data.message, error: data.message };
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      return { success: false, message: errorMessage, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    // Additional cleanup if needed
  };

  return {
    signIn,
    signUp,
    signOut,
    loading,
    error,
  };
};
