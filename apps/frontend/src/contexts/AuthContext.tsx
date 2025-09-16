'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { jwtDecode } from 'jwt-decode';

interface User {
  userId: number;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>; // Updated login signature
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = (accessToken: string) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    const decodedUser: User = jwtDecode(accessToken);
    setUser(decodedUser);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.post('/auth/refresh');
        const { accessToken } = response.data.data;
        if (accessToken) {
          handleLogin(accessToken);
        }
      } catch (error) {
        // FIXED: Use the error variable to provide more context when debugging.
        console.error('No active session found or refresh failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    // API call is now handled inside the context
    const response = await apiClient.post('/auth/login', { email, password: pass });
    const { accessToken } = response.data.data;
    if (accessToken) {
      handleLogin(accessToken);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

