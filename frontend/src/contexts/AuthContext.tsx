import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { authAPI } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get redirect URL based on platform
  const getRedirectUrl = () => {
    if (Platform.OS === 'web') {
      // Use window.location.origin for proper OAuth redirect across all domains
      if (typeof window !== 'undefined' && window.location) {
        return window.location.origin + '/';
      }
      return `${BACKEND_URL}/`;
    }
    return Linking.createURL('/');
  };

  // Extract session_id from URL
  const extractSessionId = (url: string): string | null => {
    // Try hash first
    const hashMatch = url.match(/#session_id=([^&]+)/);
    if (hashMatch) return hashMatch[1];
    
    // Try query params
    const queryMatch = url.match(/[?&]session_id=([^&]+)/);
    if (queryMatch) return queryMatch[1];
    
    return null;
  };

  // Process session ID from auth callback
  const processSessionId = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const { user: userData, session_token } = await authAPI.exchangeSession(sessionId);
      await AsyncStorage.setItem('session_token', session_token);
      setUser(userData);
    } catch (error) {
      console.error('Failed to process session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('session_token');
        if (token) {
          const userData = await authAPI.getMe();
          setUser(userData);
        }
      } catch (error) {
        // Token invalid or expired
        await AsyncStorage.removeItem('session_token');
      } finally {
        setIsLoading(false);
      }
    };

    // Handle cold start (app opened from killed state)
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const sessionId = extractSessionId(initialUrl);
        if (sessionId) {
          await processSessionId(sessionId);
          return true;
        }
      }
      return false;
    };

    // Handle web platform hash
    const handleWebHash = async () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash.includes('session_id=')) {
          const sessionId = extractSessionId(hash);
          if (sessionId) {
            // Clear hash from URL
            window.history.replaceState(null, '', window.location.pathname);
            await processSessionId(sessionId);
            return true;
          }
        }
      }
      return false;
    };

    const init = async () => {
      const processedFromWeb = await handleWebHash();
      if (!processedFromWeb) {
        const processedFromInitial = await handleInitialUrl();
        if (!processedFromInitial) {
          await checkAuth();
        }
      }
    };

    init();

    // Handle hot links (app already running)
    const subscription = Linking.addEventListener('url', async (event) => {
      const sessionId = extractSessionId(event.url);
      if (sessionId) {
        await processSessionId(sessionId);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const login = async () => {
    const redirectUrl = getRedirectUrl();
    const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    
    if (Platform.OS === 'web') {
      window.location.href = authUrl;
    } else {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      
      if (result.type === 'success' && result.url) {
        const sessionId = extractSessionId(result.url);
        if (sessionId) {
          await processSessionId(sessionId);
        }
      }
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('session_token');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
