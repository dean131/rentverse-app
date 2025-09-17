// File Path: apps/frontend/src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import apiClient, { setAuthHeader } from '@/lib/apiClient';
import { jwtDecode } from 'jwt-decode';
import { User, LoginCredentials, RegisterCredentials } from '@/lib/definitions'; // Import RegisterCredentials

// Update the context type to include the register function
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (credentials: Omit<RegisterCredentials, 'confirmPassword'>) => Promise<void>; // Add register function
}

// Export context so it can be used in the useAuth hook
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to handle session updates
  const updateUserSession = (accessToken: string) => {
    setAuthHeader(accessToken);
    const decodedUser: User = jwtDecode(accessToken);
    setUser(decodedUser);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiClient.post('/auth/refresh');
        const { accessToken } = response.data.data;
        if (accessToken) {
          updateUserSession(accessToken);
        }
      } catch (error) {
        console.error('No active session found or refresh failed.');
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { accessToken } = response.data.data;
    if (accessToken) {
      updateUserSession(accessToken);
    }
  };

  // New register function
  const register = async (credentials: Omit<RegisterCredentials, 'confirmPassword'>) => {
    await apiClient.post('/auth/register', credentials);
    // After successful registration, we don't automatically log in.
    // The user will be redirected to the login page.
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      setAuthHeader(null);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register, // Expose the register function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

