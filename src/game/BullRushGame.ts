import * as THREE from 'three';
import { Bull } from './Bull';
import { Environment } from './Environment';
import { FenceManager } from './FenceManager';
import { PowerUpManager } from './PowerUpManager';
import { GameStats } from '../types/game';

interface GameCallbacks {
  onScoreUpdate: (stats: GameStats) => void;
  onFenceDestroyed: (fenceType: string, combo: number) => void;
  onPowerUpCollected: (type: string) => void;
  onGameOver: (finalStats: GameStats) => void;
}

export class BullRushGame {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private bull: Bull;
  private environment: Environment;
  private fenceManager: FenceManager;
  private powerUpManager: PowerUpManager;
  private isRunning = false;
  private gameStats: GameStats;
  private gameSpeed = 0.04;
  private callbacks: GameCallbacks;
  private keys: { [key: string]: boolean } = {};
  private comboTimer = 0;
  private maxComboTime = 2000; // 2 seconds to maintain combo

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.callbacks = callbacks;
    this.canvas = canvas;
    this.gameStats = {
      score: 0,
      fencesDestroyed: 0,
      combo: 0,
      level: 1,
      totalFencesDestroyed: parseInt(localStorage.getItem('totalFencesDestroyed') || '0'),
      highScore: parseInt(localStorage.getItem('highScore') || '0')
    };
    
    // Initialize Three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    
    this.setupRenderer();
    this.setupCamera();
    this.setupLighting();
    this.setupEventListeners();
    
    // Initialize game objects
    this.bull = new Bull();
    this.environment = new Environment();
    this.fenceManager = new FenceManager();
    this.powerUpManager = new PowerUpManager();
    
    // Add objects to scene
    this.scene.add(this.bull.getGroup());
    this.scene.add(this.environment.getGroup());
    this.scene.add(this.fenceManager.getGroup());
    this.scene.add(this.fenceManager.getParticleGroup());
    this.scene.add(this.powerUpManager.getGroup());
    
    this.animate();
  }

  private setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x87CEEB);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private setupCamera() {
    this.camera.position.set(0, 12, 15);
    this.camera.lookAt(0, 2, 0);
  }

  private setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(15, 25, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 60;
    directionalLight.shadow.camera.left = -25;
    directionalLight.shadow.camera.right = 25;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -25;
    this.scene.add(directionalLight);
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (event) => {
      this.keys[event.code] = true;
      
      if (this.isRunning) {
        if (event.code === 'Space') {
          event.preventDefault();
          this.bull.startCharging();
        }
        if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
          event.preventDefault();
        }
      }
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
      
      if (event.code === 'Space' && this.isRunning) {
        this.bull.stopCharging();
      }
    });

    // Touch controls for mobile
    this.canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      if (this.isRunning) {
        this.bull.startCharging();
      }
    });

    this.canvas.addEventListener('touchend', (event) => {
      event.preventDefault();
      if (this.isRunning) {
        this.bull.stopCharging();
      }
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  start() {
    this.isRunning = true;
    this.gameStats.score = 0;
    this.gameStats.fencesDestroyed = 0;
    this.gameStats.combo = 0;
    this.gameStats.level = 1;
    this.gameSpeed = 0.04;
    this.comboTimer = 0;
    
    this.bull.reset();
    this.fenceManager.reset();
    this.powerUpManager.reset();
    
    this.callbacks.onScoreUpdate(this.gameStats);
  }

  restart() {
    this.start();
  }

  private updateCombo() {
    if (this.gameStats.combo > 0) {
      this.comboTimer -= 16; // Assuming 60fps
      if (this.comboTimer <= 0) {
        this.gameStats.combo = 0;
      }
    }
  }

  private addScore(basePoints: number, fenceType: string) {
    // Base points for fence type
    const typeMultiplier = {
      wooden: 1,
      metal: 2,
      stone: 3
    }[fenceType] || 1;

    // Combo multiplier
    const comboMultiplier = Math.min(1 + (this.gameStats.combo * 0.1), 3);
    
    const points = Math.floor(basePoints * typeMultiplier * comboMultiplier);
    this.gameStats.score += points;
    
    // Update combo
    this.gameStats.combo++;
    this.comboTimer = this.maxComboTime;
    
    // Level progression
    const newLevel = Math.floor(this.gameStats.fencesDestroyed / 50) + 1;
    if (newLevel > this.gameStats.level) {
      this.gameStats.level = newLevel;
      this.gameSpeed = Math.min(0.12, 0.04 + (this.gameStats.level - 1) * 0.01);
    }
  }

  private checkCollisions() {
    const bullBounds = this.bull.getBounds();
    const bullPowerUps = this.bull.getPowerUps();

    // Check fence collisions
    const fenceCollision = this.fenceManager.checkCollisions(bullBounds, bullPowerUps);
    if (fenceCollision) {
      if (fenceCollision.destroyed) {
        this.gameStats.fencesDestroyed++;
        this.gameStats.totalFencesDestroyed++;
        this.addScore(1, fenceCollision.fenceType);
        
        this.callbacks.onFenceDestroyed(fenceCollision.fenceType, this.gameStats.combo);
        this.callbacks.onScoreUpdate(this.gameStats);
        
        // Save progress
        localStorage.setItem('totalFencesDestroyed', this.gameStats.totalFencesDestroyed.toString());
      } else if (!bullPowerUps.shield) {
        // Bull hits fence but doesn't destroy it (and no shield) - game over
        this.gameOver();
        return;
      }
    }

    // Check power-up collisions
    const powerUpType = this.powerUpManager.checkCollisions(bullBounds);
    if (powerUpType) {
      this.bull.activatePowerUp(powerUpType);
      this.callbacks.onPowerUpCollected(powerUpType);
    }
  }

  private gameOver() {
    this.isRunning = false;
    
    // Update high score
    if (this.gameStats.score > this.gameStats.highScore) {
      this.gameStats.highScore = this.gameStats.score;
      localStorage.setItem('highScore', this.gameStats.highScore.toString());
    }
    
    this.callbacks.onGameOver(this.gameStats);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    if (this.isRunning) {
      // Handle continuous movement
      if (this.keys['ArrowLeft']) {
        this.bull.moveLeft();
      }
      if (this.keys['ArrowRight']) {
        this.bull.moveRight();
      }
      
      // Update game objects
      this.bull.update();
      this.environment.update(this.gameSpeed);
      this.fenceManager.update(this.gameSpeed);
      this.powerUpManager.update(this.gameSpeed);
      
      // Update combo timer
      this.updateCombo();
      
      // Check collisions
      this.checkCollisions();
      
      // Update score continuously for distance
      this.gameStats.score += 0.05;
      
      // Update camera to follow bull slightly
      const bullPos = this.bull.getPosition();
      this.camera.position.x = bullPos.x * 0.3;
      this.camera.lookAt(bullPos.x * 0.2, 2, bullPos.z - 5);
    }

    this.renderer.render(this.scene, this.camera);
  };

  getGameStats(): GameStats {
    return { ...this.gameStats };
  }

  dispose() {
    this.renderer.dispose();
  }
}