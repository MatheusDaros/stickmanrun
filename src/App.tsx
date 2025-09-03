import React, { useEffect, useRef, useState } from 'react';
import { Game } from './game/Game';
import { GameUI } from './components/GameUI';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !gameRef.current) {
      gameRef.current = new Game(canvasRef.current, {
        onScoreUpdate: setScore,
        onGameOver: () => {
          setIsGameOver(true);
          setIsPlaying(false);
        }
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.dispose();
      }
    };
  }, []);

  const startGame = () => {
    if (gameRef.current) {
      gameRef.current.start();
      setIsPlaying(true);
      setIsGameOver(false);
      setScore(0);
    }
  };

  const restartGame = () => {
    if (gameRef.current) {
      gameRef.current.restart();
      setIsPlaying(true);
      setIsGameOver(false);
      setScore(0);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-400 to-sky-600 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
      
      <GameUI
        score={score}
        isGameOver={isGameOver}
        isPlaying={isPlaying}
        onStart={startGame}
        onRestart={restartGame}
      />
    </div>
  );
}

export default App;