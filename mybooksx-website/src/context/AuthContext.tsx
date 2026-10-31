/**
 * Central Authentication & Experience Modal Context
 * Manages reactive user sessions and orchestrates modals across the MyBooksX website.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setClientAuthToken } from '../services/apiClient.ts';
import type { PublicUser } from '../server/authService.ts';

interface AuthContextType {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;

  // Modal State Controllers
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'verify' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'verify' | 'forgot') => void;
  closeAuthModal: () => void;

  isQuizModalOpen: boolean;
  quizMode: 'daily' | 'practice';
  openQuizModal: (mode?: 'daily' | 'practice') => void;
  closeQuizModal: () => void;

  isRewardsModalOpen: boolean;
  openRewardsModal: () => void;
  closeRewardsModal: () => void;

  isLeaderboardModalOpen: boolean;
  openLeaderboardModal: () => void;
  closeLeaderboardModal: () => void;

  isDashboardModalOpen: boolean;
  dashboardTab: 'overview' | 'wallet' | 'subscriptions' | 'history';
  openDashboardModal: (tab?: 'overview' | 'wallet' | 'subscriptions' | 'history') => void;
  closeDashboardModal: () => void;

  isLegalModalOpen: boolean;
  legalDoc: 'terms' | 'privacy' | 'rewards_policy';
  openLegalModal: (doc?: 'terms' | 'privacy' | 'rewards_policy') => void;
  closeLegalModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'verify' | 'forgot'>('login');

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizMode, setQuizMode] = useState<'daily' | 'practice'>('daily');

  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);

  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'wallet' | 'subscriptions' | 'history'>('overview');

  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalDoc, setLegalDoc] = useState<'terms' | 'privacy' | 'rewards_policy'>('terms');

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      setClientAuthToken(null);
      setUser(null);
    }
  };

  const openAuthModal = (tab: 'login' | 'register' | 'verify' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openQuizModal = (mode: 'daily' | 'practice' = 'daily') => {
    setQuizMode(mode);
    setIsQuizModalOpen(true);
  };

  const closeQuizModal = () => setIsQuizModalOpen(false);

  const openRewardsModal = () => setIsRewardsModalOpen(true);
  const closeRewardsModal = () => setIsRewardsModalOpen(false);

  const openLeaderboardModal = () => setIsLeaderboardModalOpen(true);
  const closeLeaderboardModal = () => setIsLeaderboardModalOpen(false);

  const openDashboardModal = (tab: 'overview' | 'wallet' | 'subscriptions' | 'history' = 'overview') => {
    setDashboardTab(tab);
    setIsDashboardModalOpen(true);
  };

  const closeDashboardModal = () => setIsDashboardModalOpen(false);

  const openLegalModal = (doc: 'terms' | 'privacy' | 'rewards_policy' = 'terms') => {
    setLegalDoc(doc);
    setIsLegalModalOpen(true);
  };

  const closeLegalModal = () => setIsLegalModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        refreshUser,
        logout,

        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,

        isQuizModalOpen,
        quizMode,
        openQuizModal,
        closeQuizModal,

        isRewardsModalOpen,
        openRewardsModal,
        closeRewardsModal,

        isLeaderboardModalOpen,
        openLeaderboardModal,
        closeLeaderboardModal,

        isDashboardModalOpen,
        dashboardTab,
        openDashboardModal,
        closeDashboardModal,

        isLegalModalOpen,
        legalDoc,
        openLegalModal,
        closeLegalModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

