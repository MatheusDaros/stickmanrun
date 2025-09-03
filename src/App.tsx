import React, { useEffect, useRef, useState } from 'react';
import { BullRushGame } from './game/BullRushGame';
import { BullGameUI } from './components/BullGameUI';
import { GameStats } from './types/game';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<BullRushGame | null>(null);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    fencesDestroyed: 0,
    combo: 0,
    level: 1,
    totalFencesDestroyed: 0,
    highScore: 0
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chargePower, setChargePower] = useState(0);
  const [maxChargePower, setMaxChargePower] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [powerUps, setPowerUps] = useState({
    speed: false,
    strength: false,
    shield: false
  });

  useEffect(() => {
    if (canvasRef.current && !gameRef.current) {
      gameRef.current = new BullRushGame(canvasRef.current, {
        onScoreUpdate: (newStats) => {
          setStats(newStats);
        },
        onFenceDestroyed: (fenceType, combo) => {
          // Could add sound effects or screen shake here
          console.log(`Destroyed ${fenceType} fence! Combo: ${combo}x`);
        },
        onPowerUpCollected: (type) => {
          setPowerUps(prev => ({ ...prev, [type]: true }));
          setTimeout(() => {
            setPowerUps(prev => ({ ...prev, [type]: false }));
          }, 5000);
        },
        onGameOver: (finalStats) => {
          setIsGameOver(true);
          setIsPlaying(false);
          setStats(finalStats);
        }
      });

      // Update charge power and bull state periodically
      const updateInterval = setInterval(() => {
        if (gameRef.current && isPlaying) {
          const bull = (gameRef.current as any).bull;
          if (bull) {
            setChargePower(bull.getChargePower());
            setMaxChargePower(bull.getMaxChargePower());
            setIsCharging(bull.isChargingActive());
            setPowerUps(bull.getPowerUps());
          }
        }
      }, 50);

      return () => {
        clearInterval(updateInterval);
      };
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.dispose();
      }
    };
  }, [isPlaying]);

  const startGame = () => {
    if (gameRef.current) {
      gameRef.current.start();
      setIsPlaying(true);
      setIsGameOver(false);
      setStats(gameRef.current.getGameStats());
    }
  };

  const restartGame = () => {
    if (gameRef.current) {
      gameRef.current.restart();
      setIsPlaying(true);
      setIsGameOver(false);
      setStats(gameRef.current.getGameStats());
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-orange-400 via-red-500 to-red-600 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
      
      <BullGameUI
        stats={stats}
        isGameOver={isGameOver}
        isPlaying={isPlaying}
        chargePower={chargePower}
        maxChargePower={maxChargePower}
        isCharging={isCharging}
        powerUps={powerUps}
        onStart={startGame}
        onRestart={restartGame}
      />
    </div>
  );
}

export default App;