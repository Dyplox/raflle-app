import { memo } from 'react';
import { useRaffle } from '../context/RaffleContext';

const CountdownOverlay = memo(() => {
    const { currentCount, countdownDuration } = useRaffle();

    if (currentCount === null) return null;

    const isYa = currentCount === '¡MATRACA!';

    // Calculate total animation time (countdown numbers + "¡YA!" moment)
    const totalAnimationTime = countdownDuration + 0.5; // +1 for the "¡YA!" second

    return (
        <div
            className="countdown-overlay"
            style={{
                animationDuration: `0.2s, ${totalAnimationTime}s`
            }}
        >
            <div
                key={currentCount}
                className={`countdown-popup ${isYa ? 'countdown-ya' : ''}`}
            >
                {currentCount}
            </div>
        </div>
    );
});

CountdownOverlay.displayName = 'CountdownOverlay';

export default CountdownOverlay;
