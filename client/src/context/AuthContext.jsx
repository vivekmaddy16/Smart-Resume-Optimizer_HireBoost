import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  TOKEN: 'hireboost_auth_token',
  USER: 'hireboost_auth_user',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setLoading(false);
  }, []);

  const signup = useCallback(async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Registration failed');
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Login failed');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  }, []);

  // OTP password recovery integrations
  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Password reset request failed');
    }
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'OTP verification failed');
    }
  }, []);

  const resetPassword = useCallback(async (email, otp, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { email, otp, newPassword });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Password reset failed');
    }
  }, []);

  const hasUsedFreeTrial = user?.freeAnalysisUsed ?? false;
  const isSubscribed = user?.subscriptionActive ?? false;

  const canAnalyze = isSubscribed || !hasUsedFreeTrial;

  const markFreeTrialUsed = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.post('/auth/update-profile', { freeAnalysisUsed: true });
      const { user: updatedUser } = response.data;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to update free trial state on backend:', err);
      // Fallback
      setUser((prev) => ({ ...prev, freeAnalysisUsed: true }));
    }
  }, [user]);

  const activateSubscription = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.post('/auth/update-profile', { subscriptionActive: true });
      const { user: updatedUser } = response.data;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to activate subscription state on backend:', err);
      // Fallback
      setUser((prev) => ({ ...prev, subscriptionActive: true, subscribedAt: new Date().toISOString() }));
    }
  }, [user]);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword,
    hasUsedFreeTrial,
    isSubscribed,
    canAnalyze,
    markFreeTrialUsed,
    activateSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
