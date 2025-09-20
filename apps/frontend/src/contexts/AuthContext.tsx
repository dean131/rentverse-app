// File Path: apps/frontend/src/contexts/AuthContext.tsx
'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode'; // Import JwtPayload
import apiClient, { setAuthHeader } from '@/lib/apiClient';
import { User, LoginCredentials, RegisterCredentials } from '@/lib/definitions';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

// Define a more specific type for our decoded token
interface AppJwtPayload extends JwtPayload {
    userId: number;
    role: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'rentverse_access_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const initializeAuth = useCallback(async () => {
    const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (token) {
        const decoded = jwtDecode<AppJwtPayload>(token);
        const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : true;

        if (!isExpired) {
            // Token is valid, set user and header
            // We need user email, which is not in the token. We'll set what we have.
            setUser({ userId: decoded.userId, role: decoded.role, email: '...' }); // Email will be updated on refresh
            setAuthHeader(token);
            setIsLoading(false);
            return;
        }
    }

    // If no valid token in storage, try to refresh using the httpOnly cookie
    try {
      const response = await apiClient.post('/auth/refresh');
      const { user: refreshedUser, accessToken } = response.data.data;
      
      const decodedToken = jwtDecode<AppJwtPayload>(accessToken);
      const userPayload: User = {
          userId: decodedToken.userId,
          email: refreshedUser.email,
          role: decodedToken.role,
      };

      setUser(userPayload);
      setAuthHeader(accessToken);
      sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } catch (error) {
      console.log('No active session found or refresh failed.');
      setUser(null);
      setAuthHeader(null);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { user: loggedInUser, accessToken } = response.data.data;
    
    const decodedToken = jwtDecode<AppJwtPayload>(accessToken);
    const userPayload: User = {
        userId: decodedToken.userId,
        email: loggedInUser.email,
        role: decodedToken.role,
    };

    setUser(userPayload);
    setAuthHeader(accessToken);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    
    router.push('/dashboard');
  };

  const register = async (credentials: RegisterCredentials) => {
    await apiClient.post('/auth/register', credentials);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      setAuthHeader(null);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

