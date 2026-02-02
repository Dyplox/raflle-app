import { useEffect, useState, useMemo } from 'react';
import { useRaffle } from '../context/RaffleContext';

const RaffleDisplay = () => {
    const { digitCount, isRaffling, winner, revealedCount } = useRaffle();
    // State only for the shuffling animation
    const [shuffleDigits, setShuffleDigits] = useState('');

    // Handle shuffling animation
    useEffect(() => {
        let interval;
        if (isRaffling) {
            interval = setInterval(() => {
                let randomStr = '';
                for (let i = 0; i < digitCount; i++) {
                    randomStr += Math.floor(Math.random() * 10).toString();
                }
                setShuffleDigits(randomStr);
            }, 60);
        }
        return () => clearInterval(interval);
    }, [isRaffling, digitCount]);

    const getDigitContent = (idx) => {
        // 1. If winner is present and this digit is revealed, show it
        if (winner && idx < revealedCount) {
            return winner[idx];
        }

        // 2. If currently raffling (and not revealed yet), show random shuffle digit
        if (isRaffling) {
            return shuffleDigits[idx] || '*';
        }

        // 3. Otherwise (before raffle or unrevealed), show mask
        return '*';
    };

    const containerClassName = useMemo(() => {
        const isWinnerRevealed = winner && !isRaffling && revealedCount === digitCount;
        return `digit-container ${isWinnerRevealed ? 'winner' : ''}`;
    }, [winner, isRaffling, revealedCount, digitCount]);

    return (
        <div className={containerClassName}>
            {Array.from({ length: digitCount }).map((_, idx) => (
                <div
                    key={idx}
                    className="digit-box"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                >
                    {getDigitContent(idx)}
                </div>
            ))}
        </div>
    );
};

export default RaffleDisplay;
