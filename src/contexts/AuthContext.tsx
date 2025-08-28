import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import ApiService from '../services/api';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<unknown>;
  register: (userData: RegisterData) => Promise<unknown>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userData = await ApiService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (token) {
        await loadUser();
      } else {
        setLoading(false);
      }
    };
    
    initializeUser();
  }, [token, loadUser]);

  const login = async (credentials: LoginCredentials) => {
    const response = await ApiService.login(credentials);
    const { token, email, firstName, lastName } = response;

    localStorage.setItem('token', token);
    setToken(token);
    setUser({ email, firstName, lastName });

    return response;
  };

  const register = async (userData: RegisterData) => {
    const response = await ApiService.register(userData);
    const { token, email, firstName, lastName } = response;

    localStorage.setItem('token', token);
    setToken(token);
    setUser({ email, firstName, lastName, phone: userData.phone });

    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};