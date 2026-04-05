import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const FREE_CHAT_LIMIT = 30;
const PRO_CHAT_LIMIT = 100;
const FREE_OCR_LIMIT = 5;
const PRO_OCR_LIMIT = Infinity;

type SubscriptionContextType = {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
  chatCount: number;
  chatLimit: number;
  ocrCount: number;
  ocrLimit: number;
  incrementChatCount: () => void;
  incrementOcrCount: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [ocrCount, setOcrCount] = useState(0);

  const chatLimit = isPro ? PRO_CHAT_LIMIT : FREE_CHAT_LIMIT;
  const ocrLimit = isPro ? PRO_OCR_LIMIT : FREE_OCR_LIMIT;

  const incrementChatCount = useCallback(() => {
    setChatCount((prev) => prev + 1);
  }, []);

  const incrementOcrCount = useCallback(() => {
    setOcrCount((prev) => prev + 1);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        setIsPro,
        chatCount,
        chatLimit,
        ocrCount,
        ocrLimit,
        incrementChatCount,
        incrementOcrCount,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
