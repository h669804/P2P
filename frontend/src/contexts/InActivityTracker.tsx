// src/contexts/InactivityTracker.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './AuthService';

// Default timeout - 30 minutes in milliseconds
const DEFAULT_TIMEOUT = 30 * 60 * 1000;

interface InactivityContextType {
  resetTimer: () => void;
  setTimeout: (timeout: number) => void;
}

const InactivityContext = createContext<InactivityContextType | null>(null);

export const useInactivity = () => {
  const context = useContext(InactivityContext);
  if (!context) {
    throw new Error('useInactivity must be used within an InactivityProvider');
  }
  return context;
};

export const InactivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [timeout, setTimeoutValue] = useState(DEFAULT_TIMEOUT);
  const [timer, setTimer] = useState<number | null>(null);
  const navigate = useNavigate();

  const resetTimer = () => {
    if (timer) window.clearTimeout(timer);
    if (authService.isLoggedIn()) {
      const newTimer = window.setTimeout(() => {
        // Log out the user
        authService.logout();
        navigate('/login', { state: { message: 'You have been logged out due to inactivity' } });
      }, timeout);
      setTimer(newTimer);
    }
  };

  const setTimeout = (newTimeout: number) => {
    setTimeoutValue(newTimeout);
    resetTimer();
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Start the timer
    resetTimer();

    // Event handlers to reset the timer
    const resetTimerOnActivity = () => resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimerOnActivity);
    });

    // Cleanup
    return () => {
      if (timer) window.clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimerOnActivity);
      });
    };
  }, [timeout]); // Re-run effect when timeout changes

  return (
    <InactivityContext.Provider value={{ resetTimer, setTimeout }}>
      {children}
    </InactivityContext.Provider>
  );
};
