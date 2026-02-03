import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const RaffleContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRaffle = () => {
  const context = useContext(RaffleContext);
  if (!context) {
    throw new Error('useRaffle must be used within a RaffleProvider');
  }
  return context;
};

// Helper to create a history entry
const createHistoryEntry = (number) => ({
  id: Date.now(),
  number,
  timestamp: new Date().toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
});

export const RaffleProvider = ({ children }) => {
  // Persisted state via custom hook
  const [digitCount, setDigitCount] = useLocalStorage('raffle_digitCount', 3);
  const [isManualRevealEnabled, setIsManualRevealEnabled] = useLocalStorage('raffle_isManualRevealEnabled', false);
  const [isCountdownEnabled, setIsCountdownEnabled] = useLocalStorage('raffle_isCountdownEnabled', true);
  const [countdownDuration, setCountdownDuration] = useLocalStorage('raffle_countdownDuration', 3);
  const [history, setHistory] = useLocalStorage('raffle_history', []);

  // Transient state (not persisted)
  const [isRaffling, setIsRaffling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(null);

  // Ref to track countdown interval for cleanup
  const countdownIntervalRef = useRef(null);

  /**
   * Generates a random number with the length based on digitCount
   */
  const generateWinner = useCallback(() => {
    const max = Math.pow(10, digitCount);
    const winningNumber = Math.floor(Math.random() * max);
    return winningNumber.toString().padStart(digitCount, '0');
  }, [digitCount]);

  /**
   * Adds winner to history
   */
  const addToHistory = useCallback((number) => {
    setHistory(prev => [createHistoryEntry(number), ...prev]);
  }, [setHistory]);

  /**
   * Executes the actual raffle after any countdown
   */
  const executeRaffle = useCallback(() => {
    setIsRaffling(true);
    setWinner(null);
    setRevealedCount(0);

    setTimeout(() => {
      const newWinner = generateWinner();
      setWinner(newWinner);
      setRevealedCount(digitCount);
      setIsRaffling(false);
      addToHistory(newWinner);
    }, 800);
  }, [digitCount, generateWinner, addToHistory]);

  /**
   * Helper to run a callback with or without countdown
   */
  const runWithCountdown = useCallback((callback) => {
    // Cleanup any existing countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (isCountdownEnabled) {
      let count = countdownDuration;
      setCurrentCount(count);

      countdownIntervalRef.current = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCurrentCount(count);
        } else {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          setCurrentCount('¡YA!');
          setTimeout(() => {
            setCurrentCount(null);
            callback();
          }, 800);
        }
      }, 1000);
    } else {
      callback();
    }
  }, [isCountdownEnabled, countdownDuration]);

  /**
   * Traditional raffle: everything is revealed after a short delay
   */
  const runTraditionalRaffle = useCallback(() => {
    if (isRaffling || currentCount !== null) return;
    runWithCountdown(executeRaffle);
  }, [isRaffling, currentCount, runWithCountdown, executeRaffle]);

  /**
   * Digit by digit raffle: each step reveals one more digit
   */
  const runDigitRaffleStep = useCallback(() => {
    if (isRaffling || currentCount !== null) return;

    // Start a new raffle if none exists or if the previous one is finished
    if (!winner || revealedCount >= digitCount) {

      const startNewDigitRaffle = () => {
        setIsRaffling(true);
        setRevealedCount(0);
        setWinner(null);

        setTimeout(() => {
          const newWinner = generateWinner();
          setWinner(newWinner);
          setRevealedCount(1);
          setIsRaffling(false);
        }, 500);
      };

      runWithCountdown(startNewDigitRaffle);

    } else if (revealedCount < digitCount) {
      // Reveal the next digit

      const revealNextDigit = () => {
        setIsRaffling(true);

        setTimeout(() => {
          const newCount = revealedCount + 1;
          setRevealedCount(newCount);

          // If this was the last digit, add it to the history
          if (newCount === digitCount) {
            addToHistory(winner);
          }
          setIsRaffling(false);
        }, 500);
      };

      runWithCountdown(revealNextDigit);
    }
  }, [isRaffling, currentCount, winner, revealedCount, digitCount, generateWinner, addToHistory, runWithCountdown]);

  const resetRaffle = useCallback(() => {
    // Cleanup countdown if running
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCurrentCount(null);
    setWinner(null);
    setIsRaffling(false);
    setRevealedCount(0);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    resetRaffle();
  }, [setHistory, resetRaffle]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    digitCount,
    setDigitCount,
    isRaffling,
    runTraditionalRaffle,
    runDigitRaffleStep,
    resetRaffle,
    winner,
    revealedCount,
    isManualRevealEnabled,
    setIsManualRevealEnabled,
    history,
    currentCount,
    isCountdownEnabled,
    setIsCountdownEnabled,
    countdownDuration,
    setCountdownDuration,
    clearHistory
  }), [
    digitCount, setDigitCount,
    isRaffling,
    runTraditionalRaffle, runDigitRaffleStep, resetRaffle,
    winner, revealedCount,
    isManualRevealEnabled, setIsManualRevealEnabled,
    history, currentCount,
    isCountdownEnabled, setIsCountdownEnabled,
    countdownDuration, setCountdownDuration,
    clearHistory
  ]);

  return (
    <RaffleContext.Provider value={value}>
      {children}
    </RaffleContext.Provider>
  );
};
