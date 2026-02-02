import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RaffleProvider, useRaffle } from './context/RaffleContext';
import Layout from './components/Layout';
import RaffleDisplay from './components/RaffleDisplay';
import RaffleHistory from './components/RaffleHistory';

const RaffleContent = () => {
  const {
    runTraditionalRaffle,
    runDigitRaffleStep,
    isRaffling,
    winner,
    revealedCount,
    digitCount,
    isManualRevealEnabled
  } = useRaffle();

  const isFinished = winner && revealedCount === digitCount;

  useEffect(() => {
    if (isFinished) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const goldColors = ['#fbbf24', '#f59e0b', '#b45309', '#ffffff', '#eab308'];

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const frame = () => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return;

        // 1. Powerful Side Cannons (continuous stream)
        confetti({
          particleCount: 4,
          angle: 50,
          spread: 80,
          origin: { x: 0, y: 0.6 },
          colors: goldColors,
          scalar: 1.2,
          drift: 1,
        });
        confetti({
          particleCount: 4,
          angle: 130,
          spread: 80,
          origin: { x: 1, y: 0.6 },
          colors: goldColors,
          scalar: 1.2,
          drift: -1,
        });

        // 2. Rising Balloons (Gold & White) - Variable Size & Reduced Density
        if (Math.random() < 0.2) {
          confetti({
            particleCount: 1,
            origin: { x: Math.random(), y: 1.2 },
            colors: goldColors,
            shapes: ['circle'],
            gravity: 0.25,
            scalar: randomInRange(1.0, 3.5), // Variable size: 1.0 to 3.5
            drift: (Math.random() - 0.5) * 0.5,
            ticks: 800,
            startVelocity: 80,
            decay: 0.98,
            angle: 90,
            spread: 40
          });
        }

        // 3. Random Firework Bursts (improved effect)
        if (Math.random() < 0.05) { // Slightly less frequent for better performance
          confetti({
            particleCount: 80,
            spread: 360, // Circular burst
            origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.5) },
            colors: goldColors,
            scalar: 0.7,
            gravity: 0.5,
            ticks: 60,
            startVelocity: 30,
            decay: 0.92,
            shapes: ['circle'],
          });
        }

        requestAnimationFrame(frame);
      };

      // Initial Massive Blast to kick it off
      confetti({
        particleCount: 250,
        spread: 100,
        origin: { y: 0.6 },
        colors: goldColors,
        scalar: 1.5,
        zIndex: 100
      });

      frame();
    }
  }, [isFinished]);

  const handleRaffleClick = () => {
    if (isManualRevealEnabled) {
      runDigitRaffleStep();
    } else {
      runTraditionalRaffle();
    }
  };

  const getButtonText = () => {
    if (isRaffling) return 'Rifando...';
    if (isFinished) return 'Rifar de Nuevo';
    if (isManualRevealEnabled) {
      return winner ? 'Revelar Siguiente' : 'Revelar Dígito';
    }
    return 'Iniciar Rifa';
  };

  return (
    <div className="cards-stack">
      <div className="card">
        <h2 className="card-title">
          {isFinished ? '¡Tenemos un Ganador!' : 'Próximo Ganador'}
        </h2>

        <RaffleDisplay />

        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleRaffleClick}
              disabled={isRaffling}
              aria-label={getButtonText()}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>

      {isFinished && (
        <div className="card" style={{ padding: '4rem', animation: 'slideIn 0.5s ease' }}>
          <div className="winner-announcement" style={{ marginTop: 0 }}>
            <div className="winner-result-box" style={{ width: '100%', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>🎉</span>
              <span className="winner-text">¡Felicidades al número {winner}!</span>
              <span style={{ fontSize: '1.5rem' }}>🎉</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <RaffleProvider>
      <Layout>
        <div className="main-content-container">
          <RaffleHistory />
          <div className="cards-wrapper">
            <RaffleContent />
          </div>
        </div>
      </Layout>
    </RaffleProvider>
  );
}

export default App;
