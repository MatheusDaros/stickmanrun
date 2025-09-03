import * as THREE from 'three';
import { Stickman } from './Stickman';
import { Environment } from './Environment';
import { ObstacleManager } from './ObstacleManager';

interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onGameOver: () => void;
}

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private stickman: Stickman;
  private environment: Environment;
  private obstacleManager: ObstacleManager;
  private isRunning = false;
  private score = 0;
  private gameSpeed = 0.06;
  private callbacks: GameCallbacks;
  private keys: { [key: string]: boolean } = {};

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.callbacks = callbacks;
    
    // Initialize Three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    
    this.setupRenderer();
    this.setupCamera();
    this.setupLighting();
    this.setupEventListeners();
    
    // Initialize game objects
    this.stickman = new Stickman();
    this.environment = new Environment();
    this.obstacleManager = new ObstacleManager();
    
    // Add objects to scene
    this.scene.add(this.stickman.getGroup());
    this.scene.add(this.environment.getGroup());
    this.scene.add(this.obstacleManager.getGroup());
    
    this.animate();
  }

  private setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x87CEEB);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private setupCamera() {
    this.camera.position.set(0, 8, 12);
    this.camera.lookAt(0, 2, 0);
  }

  private setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    this.scene.add(directionalLight);
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (event) => {
      this.keys[event.code] = true;
      if (event.code === 'Space') {
        event.preventDefault();
        if (this.isRunning) {
          this.stickman.jump();
        }
      }
      if (event.code === 'ArrowLeft') {
        event.preventDefault();
        if (this.isRunning) {
          this.stickman.moveLeft();
        }
      }
      if (event.code === 'ArrowRight') {
        event.preventDefault();
        if (this.isRunning) {
          this.stickman.moveRight();
        }
      }
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  start() {
    this.isRunning = true;
    this.score = 0;
    this.gameSpeed = 0.06;
    this.stickman.reset();
    this.obstacleManager.reset();
  }

  restart() {
    this.start();
  }

  private checkCollisions() {
    const stickmanBounds = this.stickman.getBounds();
    const obstacles = this.obstacleManager.getObstacles();

    for (const obstacle of obstacles) {
      const obstacleBounds = obstacle.getBounds();
      
      if (this.isColliding(stickmanBounds, obstacleBounds)) {
        this.gameOver();
        return;
      }
    }
  }

  private isColliding(bounds1: THREE.Box3, bounds2: THREE.Box3): boolean {
    return bounds1.intersectsBox(bounds2);
  }

  private gameOver() {
    this.isRunning = false;
    this.callbacks.onGameOver();
  }

  private updateScore() {
    if (this.isRunning) {
      this.score += 0.1;
      this.callbacks.onScoreUpdate(this.score);
      
      // Increase game speed gradually
      this.gameSpeed = Math.min(0.15, 0.06 + (this.score * 0.0003));
    }
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    if (this.isRunning) {
      this.stickman.update();
      this.environment.update(this.gameSpeed);
      this.obstacleManager.update(this.gameSpeed);
      
      this.checkCollisions();
      
      // Update score continuously
      this.updateScore();
    }

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.renderer.dispose();
    window.removeEventListener('keydown', this.setupEventListeners);
    window.removeEventListener('keyup', this.setupEventListeners);
    window.removeEventListener('resize', this.setupEventListeners);
  }
}