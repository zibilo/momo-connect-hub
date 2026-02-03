import React, { createContext, useContext, useEffect, useState } from 'react';

interface OnlineStatusContextType {
  isOnline: boolean;
  wasOffline: boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  isOnline: true,
  wasOffline: false,
});

export function useOnlineStatusContext() {
  return useContext(OnlineStatusContext);
}

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isOnline) {
        setWasOffline(true);
        setTimeout(() => setWasOffline(false), 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  return (
    <OnlineStatusContext.Provider value={{ isOnline, wasOffline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}
