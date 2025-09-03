import React from 'react';
import { Play, RotateCcw, Trophy, Zap, Shield, Gauge, Sword, Target } from 'lucide-react';
import { GameStats } from '../types/game';

interface BullGameUIProps {
  stats: GameStats;
  isGameOver: boolean;
  isPlaying: boolean;
  chargePower: number;
  maxChargePower: number;
  isCharging: boolean;
  powerUps: { speed: boolean; strength: boolean; shield: boolean };
  onStart: () => void;
  onRestart: () => void;
}

export function BullGameUI({ 
  stats, 
  isGameOver, 
  isPlaying, 
  chargePower, 
  maxChargePower, 
  isCharging,
  powerUps,
  onStart, 
  onRestart 
}: BullGameUIProps) {
  const chargePercentage = (chargePower / maxChargePower) * 100;

  return (
    <>
      {/* Game HUD */}
      {isPlaying && (
        <>
          {/* Score and Stats */}
          <div className="absolute top-4 left-4 z-10 space-y-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold text-lg">{Math.floor(stats.score)}</span>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-red-400" />
                <span className="text-white text-sm">{stats.fencesDestroyed} Fences</span>
              </div>
            </div>

            {stats.combo > 1 && (
              <div className="bg-gradient-to-r from-orange-500/40 to-red-500/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-orange-400/30">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-200 text-sm font-bold">{stats.combo}x COMBO!</span>
                </div>
              </div>
            )}
          </div>

          {/* Charge Power Bar */}
          {isCharging && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-center mb-2">
                  <span className="text-white font-bold">CHARGE POWER</span>
                </div>
                <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-100 ${
                      chargePercentage < 30 ? 'bg-yellow-500' :
                      chargePercentage < 70 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${chargePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Power-ups */}
          <div className="absolute top-4 right-4 z-10 space-y-2">
            {powerUps.speed && (
              <div className="bg-green-500/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/30">
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-green-400" />
                  <span className="text-green-200 text-sm font-bold">SPEED</span>
                </div>
              </div>
            )}
            
            {powerUps.strength && (
              <div className="bg-red-500/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-red-400/30">
                <div className="flex items-center space-x-2">
                  <Sword className="w-4 h-4 text-red-400" />
                  <span className="text-red-200 text-sm font-bold">STRENGTH</span>
                </div>
              </div>
            )}
            
            {powerUps.shield && (
              <div className="bg-blue-500/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-400/30">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200 text-sm font-bold">SHIELD</span>
                </div>
              </div>
            )}
          </div>

          {/* Level Display */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <div className="text-center">
                <span className="text-purple-400 text-sm">Level</span>
                <div className="text-white font-bold text-xl">{stats.level}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Start Screen */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center max-w-lg">
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-white mb-2">🐂 Bull Rush</h1>
              <p className="text-blue-200 text-lg">Charge through 500 fences and become the ultimate bull!</p>
            </div>
            
            <div className="mb-6 space-y-3 text-left bg-white/10 rounded-lg p-4">
              <h3 className="text-white font-bold text-center mb-3">How to Play</h3>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span><strong>Hold SPACE</strong> to charge up power, release to smash fences</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span><strong>Arrow Keys</strong> to move left and right between lanes</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span><strong>Collect power-ups</strong> for speed, strength, and shields</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span><strong>Chain fence destruction</strong> for combo multipliers</span>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-400">{stats.highScore}</div>
                <div className="text-white text-sm">High Score</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-400">{stats.totalFencesDestroyed}</div>
                <div className="text-white text-sm">Total Destroyed</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">500</div>
                <div className="text-white text-sm">Fences to Destroy</div>
              </div>
            </div>
            
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto text-lg"
            >
              <Play className="w-6 h-6" />
              <span>Start Charging!</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center max-w-lg">
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-white mb-4">🏆 Bull Run Complete!</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">{Math.floor(stats.score)}</div>
                  <div className="text-white text-sm">Final Score</div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-400">{stats.fencesDestroyed}</div>
                  <div className="text-white text-sm">Fences Destroyed</div>
                </div>
              </div>

              {stats.score === stats.highScore && stats.score > 0 && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-3 mb-4">
                  <p className="text-yellow-300 font-bold">🎉 NEW HIGH SCORE!</p>
                </div>
              )}
              
              <p className="text-blue-200 text-lg">
                {stats.fencesDestroyed < 10 ? "Keep charging, bull!" : 
                 stats.fencesDestroyed < 50 ? "Good destruction!" : 
                 stats.fencesDestroyed < 150 ? "Impressive rampage!" : 
                 stats.fencesDestroyed < 300 ? "Unstoppable force!" : 
                 "Legendary bull destroyer!"}
              </p>
            </div>
            
            <button
              onClick={onRestart}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto text-lg"
            >
              <RotateCcw className="w-6 h-6" />
              <span>Charge Again!</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}