import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredLanguage: 'en' | 'hi';
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean }>;
  signup: (name: string, email: string, phone: string, password: string, language: 'en' | 'hi') => Promise<boolean>;
  verifyPhone: (phone: string, otp: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string): Promise<{ success: boolean; needsVerification?: boolean }> => {
    setIsLoading(true);
    try {
      const result = await apiService.login({ phone, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        toast.success('Login successful!');
        return { success: true };
      } else if (result.needsVerification) {
        toast.error(result.message);
        return { success: false, needsVerification: true };
      } else {
        toast.error(result.message);
        return { success: false };
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string, language: 'en' | 'hi'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await apiService.signup({ name, email, phone, password, language });
      
      if (result.success) {
        toast.success(result.message);
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhone = async (phone: string, otp: string): Promise<{ success: boolean; user?: User }> => {
    setIsLoading(true);
    try {
      const result = await apiService.verifyOTP({ phone, otp });
      
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyPhone, logout, isLoading }}>
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