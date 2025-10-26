// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCurrentUser, signOut as localSignOut, refreshCurrentUser, LocalUser } from '@/lib/local-auth';

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
  signOut: () => Promise<void>;
  retryInit: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isReady: false,
  signOut: async () => {},
  retryInit: () => {},
  refreshUser: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize local authentication
  const initializeAuth = useCallback(() => {
    try {
      // Check for existing session
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsReady(true);
      setError(null);
      console.log('✅ Local auth initialized');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize local auth';
      setError(errorMessage);
      setIsReady(false);
      console.error('❌ AuthContext: Local auth initialization failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleSignOut = async () => {
    try {
      localSignOut();
      setUser(null);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
  };

  const retryInit = () => {
    console.log('🔄 Retrying local auth initialization...');
    initializeAuth();
  };

  // Method to refresh user from storage
  const refreshUser = useCallback(() => {
    const updatedUser = refreshCurrentUser();
    setUser(updatedUser);
  }, []);

  const value = {
    user,
    loading,
    error,
    isReady,
    signOut: handleSignOut,
    retryInit,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
