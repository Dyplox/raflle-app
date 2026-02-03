import { createContext, useContext, useState, useCallback } from 'react';

const RaffleContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRaffle = () => {
  const context = useContext(RaffleContext);
  if (!context) {
    throw new Error('useRaffle must be used within a RaffleProvider');
  }
  return context;
};

export const RaffleProvider = ({ children }) => {
  const [digitCount, setDigitCount] = useState(3);
  const [isRaffling, setIsRaffling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isManualRevealEnabled, setIsManualRevealEnabled] = useState(false);
  const [history, setHistory] = useState([]);

  /**
   * Generates a random number with the length based on digitCount
   */
  const generateWinner = useCallback(() => {
    const max = Math.pow(10, digitCount);
    const winningNumber = Math.floor(Math.random() * max);
    return winningNumber.toString().padStart(digitCount, '0');
  }, [digitCount]);

  /**
   * Traditional raffle: everything is revealed after a short delay
   */
  const runTraditionalRaffle = useCallback(() => {
    if (isRaffling) return;

    setIsRaffling(true);
    setWinner(null);
    setRevealedCount(0);

    // Minimal delay to allow the shuffle animation to trigger visual excitement
    setTimeout(() => {
      const newWinner = generateWinner();
      setWinner(newWinner);
      setRevealedCount(digitCount);
      setIsRaffling(false);

      setHistory(prev => [{
        id: Date.now(),
        number: newWinner,
        timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      }, ...prev]);
    }, 800); // 800ms feels more "deliberate" for a raffle than 100ms
  }, [isRaffling, digitCount, generateWinner]);

  /**
   * Digit by digit raffle: each step reveals one more digit
   */
  const runDigitRaffleStep = useCallback(() => {
    if (isRaffling) return;

    // Start a new raffle if none exists or if the previous one is finished
    if (!winner || (winner && revealedCount >= digitCount)) {
      setIsRaffling(true);
      setRevealedCount(0);
      setWinner(null);

      setTimeout(() => {
        const newWinner = generateWinner();
        setWinner(newWinner);
        setRevealedCount(1);
        setIsRaffling(false);
      }, 500);
    } else if (revealedCount < digitCount) {
      // Reveal the next digit
      setIsRaffling(true);

      setTimeout(() => {
        const newCount = revealedCount + 1;
        setRevealedCount(newCount);

        // If this was the last digit, add it to the history
        if (newCount === digitCount) {
          setHistory(h => [{
            id: Date.now(),
            number: winner,
            timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
          }, ...h]);
        }
        setIsRaffling(false);
      }, 500);
    }
  }, [isRaffling, winner, revealedCount, digitCount, generateWinner]);

  const resetRaffle = useCallback(() => {
    setWinner(null);
    setIsRaffling(false);
    setRevealedCount(0);
  }, []);

  const value = {
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
    history
  };

  return (
    <RaffleContext.Provider value={value}>
      {children}
    </RaffleContext.Provider>
  );
};
