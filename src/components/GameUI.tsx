import React from 'react';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';

interface GameUIProps {
  score: number;
  isGameOver: boolean;
  isPlaying: boolean;
  onStart: () => void;
  onRestart: () => void;
}

export function GameUI({ score, isGameOver, isPlaying, onStart, onRestart }: GameUIProps) {
  return (
    <>
      {/* Score Display */}
      {isPlaying && (
        <div className="absolute top-6 left-6 z-10">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold text-lg">{Math.floor(score)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isPlaying && (
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">SPACE to Jump</span>
            </div>
          </div>
        </div>
      )}

      {/* Start Screen */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center max-w-md">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white mb-2">3D Stickman Runner</h1>
              <p className="text-blue-200">Jump over fences and run as far as you can!</p>
            </div>
            
            <div className="mb-6 space-y-2 text-left">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Press SPACE to jump over fences</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Use LEFT/RIGHT arrows to dodge</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Avoid hitting obstacles</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Score points for distance traveled</span>
              </div>
            </div>
            
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start Game</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center max-w-md">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">{Math.floor(score)}</span>
                <span className="text-white">points</span>
              </div>
              <p className="text-blue-200">
                {score < 20 ? "Keep practicing!" : 
                 score < 50 ? "Good effort!" : 
                 score < 100 ? "Great run!" : 
                 score < 200 ? "Amazing performance!" : "Legendary runner!"}
              </p>
            </div>
            
            <button
              onClick={onRestart}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}