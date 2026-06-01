import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  CURRENT_USER: 'hireboost_current_user',
  USERS_DB: 'hireboost_users',
};

function getUsersDB() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_DB) || '{}');
  } catch {
    return {};
  }
}

function saveUsersDB(db) {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
}

function getCurrentUserEmail() {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || null;
}

function setCurrentUserEmail(email) {
  if (email) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const email = getCurrentUserEmail();
    if (email) {
      const db = getUsersDB();
      const userData = db[email];
      if (userData) {
        setUser(userData);
      } else {
        setCurrentUserEmail(null);
      }
    }
    setLoading(false);
  }, []);

  const signup = useCallback((name, email, password) => {
    const db = getUsersDB();
    const normalizedEmail = email.toLowerCase().trim();

    if (db[normalizedEmail]) {
      throw new Error('An account with this email already exists');
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password, // In a real app, this would be hashed
      freeAnalysisUsed: false,
      subscriptionActive: false,
      createdAt: new Date().toISOString(),
    };

    db[normalizedEmail] = newUser;
    saveUsersDB(db);
    setCurrentUserEmail(normalizedEmail);
    setUser(newUser);
    return newUser;
  }, []);

  const login = useCallback((email, password) => {
    const db = getUsersDB();
    const normalizedEmail = email.toLowerCase().trim();
    const userData = db[normalizedEmail];

    if (!userData) {
      throw new Error('No account found with this email');
    }

    if (userData.password !== password) {
      throw new Error('Incorrect password');
    }

    setCurrentUserEmail(normalizedEmail);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    setCurrentUserEmail(null);
    setUser(null);
  }, []);

  const hasUsedFreeTrial = user?.freeAnalysisUsed ?? false;
  const isSubscribed = user?.subscriptionActive ?? false;

  const canAnalyze = isSubscribed || !hasUsedFreeTrial;

  const markFreeTrialUsed = useCallback(() => {
    if (!user) return;
    const db = getUsersDB();
    db[user.email].freeAnalysisUsed = true;
    saveUsersDB(db);
    setUser((prev) => ({ ...prev, freeAnalysisUsed: true }));
  }, [user]);

  const activateSubscription = useCallback(() => {
    if (!user) return;
    const db = getUsersDB();
    db[user.email].subscriptionActive = true;
    db[user.email].subscribedAt = new Date().toISOString();
    saveUsersDB(db);
    setUser((prev) => ({ ...prev, subscriptionActive: true, subscribedAt: new Date().toISOString() }));
  }, [user]);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
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
