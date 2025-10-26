// src/hooks/useFirestore.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  savePurchaseHistory,
  getUserPurchaseHistory,
  saveFinancialProfile,
  getFinancialProfile,
  saveChatMessage,
  getChatHistory,
  saveProModeAnalysis,
  getUserProModeAnalyses,
  clearAllUserData,
  initDatabase,
  type PurchaseHistoryItem,
  type FinancialProfileData,
  type ChatHistoryData,
  type ProModeAnalysis,
} from '@/lib/local-db';

interface UseFirestoreReturn {
  isLoading: boolean;
  error: string | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  isFirestoreReady: boolean;
  user: any;
  // Purchase History
  savePurchase: (purchaseData: Omit<PurchaseHistoryItem, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  getPurchaseHistory: (limitCount?: number) => Promise<PurchaseHistoryItem[]>;
  getAllPurchaseHistory: () => Promise<PurchaseHistoryItem[]>;
  // Financial Profile
  saveProfile: (profileData: Omit<FinancialProfileData, 'userId' | 'createdAt' | 'lastUpdated'>) => Promise<void>;
  getProfile: () => Promise<FinancialProfileData | null>;
  // Chat History
  saveChat: (role: 'user' | 'assistant', content: string) => Promise<void>;
  getChat: () => Promise<ChatHistoryData[]>;
  // Pro Mode Analysis
  saveProAnalysis: (analysisData: Omit<ProModeAnalysis, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  getProAnalyses: () => Promise<ProModeAnalysis[]>;
  // Real-time listeners (simplified for local storage)
  subscribeToProfile: (callback: (profile: FinancialProfileData | null) => void) => (() => void) | null;
  subscribeToPurchaseHistory: (callback: (purchases: PurchaseHistoryItem[]) => void, limitCount?: number) => (() => void) | null;
  subscribeToChatHistory: (callback: (chat: ChatHistoryData[]) => void) => (() => void) | null;
  // Data management
  clearAllData: () => Promise<{ success: boolean; clearedItems: any }>;
}

export const useFirestore = (): UseFirestoreReturn => {
  const { user, loading: authLoading, isReady } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirestoreReady, setIsFirestoreReady] = useState(false);

  // Initialize database and check if ready
  useEffect(() => {
    const initialize = async () => {
      await initDatabase();
      setIsFirestoreReady(isReady && !!user);
    };
    initialize();
  }, [isReady, user]);

  // Purchase History
  const savePurchase = useCallback(async (purchaseData: Omit<PurchaseHistoryItem, 'id' | 'userId' | 'timestamp'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      await savePurchaseHistory({ ...purchaseData, userId: user.uid });
    } catch (err: any) {
      const errorMsg = 'Failed to save purchase history';
      setError(errorMsg);
      console.error(errorMsg, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getPurchaseHistory = useCallback(async (limitCount?: number): Promise<PurchaseHistoryItem[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      const allHistory = await getUserPurchaseHistory(user.uid);
      if (limitCount) {
        return allHistory.slice(0, limitCount);
      }
      return allHistory;
    } catch (err) {
      const errorMsg = 'Failed to load purchase history';
      setError(errorMsg);
      console.error(errorMsg, err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getAllPurchaseHistory = useCallback(async (): Promise<PurchaseHistoryItem[]> => {
    return getPurchaseHistory();
  }, [getPurchaseHistory]);

  // Financial Profile
  const saveProfile = useCallback(async (profileData: Omit<FinancialProfileData, 'userId' | 'createdAt' | 'lastUpdated'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      await saveFinancialProfile(user.uid, profileData);
    } catch (err) {
      const errorMsg = 'Failed to save financial profile';
      setError(errorMsg);
      console.error(errorMsg, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getProfile = useCallback(async (): Promise<FinancialProfileData | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      return await getFinancialProfile(user.uid);
    } catch (err) {
      const errorMsg = 'Failed to load financial profile';
      setError(errorMsg);
      console.error(errorMsg, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Chat History
  const saveChat = useCallback(async (role: 'user' | 'assistant', content: string) => {
    if (!user) {
      console.warn('Cannot save chat: User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await saveChatMessage(user.uid, role, content);
    } catch (err) {
      const errorMsg = 'Failed to save chat history';
      setError(errorMsg);
      console.error(errorMsg, err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getChat = useCallback(async (): Promise<ChatHistoryData[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      return await getChatHistory(user.uid);
    } catch (err) {
      const errorMsg = 'Failed to load chat history';
      setError(errorMsg);
      console.error(errorMsg, err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Pro Mode Analysis
  const saveProAnalysis = useCallback(async (analysisData: Omit<ProModeAnalysis, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      console.warn('Cannot save pro analysis: User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await saveProModeAnalysis(user.uid, analysisData);
    } catch (err) {
      const errorMsg = 'Failed to save pro mode analysis';
      setError(errorMsg);
      console.error(errorMsg, err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getProAnalyses = useCallback(async (): Promise<ProModeAnalysis[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      return await getUserProModeAnalyses(user.uid);
    } catch (err) {
      const errorMsg = 'Failed to load pro mode analyses';
      setError(errorMsg);
      console.error(errorMsg, err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Simplified real-time listeners (polling-based)
  const subscribeToProfile = useCallback((callback: (profile: FinancialProfileData | null) => void): (() => void) | null => {
    if (!user) return null;

    const intervalId = setInterval(async () => {
      try {
        const profile = await getFinancialProfile(user.uid);
        callback(profile);
      } catch (err) {
        console.error('Error in profile subscription:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  const subscribeToPurchaseHistory = useCallback((
    callback: (purchases: PurchaseHistoryItem[]) => void,
    limitCount: number = 50
  ): (() => void) | null => {
    if (!user) return null;

    const intervalId = setInterval(async () => {
      try {
        const purchases = await getUserPurchaseHistory(user.uid);
        if (limitCount) {
          callback(purchases.slice(0, limitCount));
        } else {
          callback(purchases);
        }
      } catch (err) {
        console.error('Error in purchase history subscription:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  const subscribeToChatHistory = useCallback((callback: (chat: ChatHistoryData[]) => void): (() => void) | null => {
    if (!user) return null;

    const intervalId = setInterval(async () => {
      try {
        const chat = await getChatHistory(user.uid);
        callback(chat);
      } catch (err) {
        console.error('Error in chat history subscription:', err);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  return {
    isLoading,
    error,
    authLoading,
    isAuthenticated: !!user && !!user.uid && !authLoading,
    isFirestoreReady,
    user,
    savePurchase,
    getPurchaseHistory,
    getAllPurchaseHistory,
    saveProfile,
    getProfile,
    saveChat,
    getChat,
    saveProAnalysis,
    getProAnalyses,
    subscribeToProfile,
    subscribeToPurchaseHistory,
    subscribeToChatHistory,
    clearAllData: async () => {
      if (!user) {
        return { success: true, clearedItems: { localStorage: true } };
      }
      await clearAllUserData(user.uid);
      return { success: true, clearedItems: { all: true } };
    }
  };
};
