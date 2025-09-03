import * as THREE from 'three';

export type PowerUpType = 'speed' | 'strength' | 'shield';

class PowerUp {
  private group: THREE.Group;
  private type: PowerUpType;
  private collected = false;
  private rotationSpeed = 0.05;
  private bobOffset = 0;

  constructor(x: number, z: number, type: PowerUpType) {
    this.type = type;
    this.group = new THREE.Group();
    this.createPowerUp();
    this.group.position.set(x, 2, z);
    this.bobOffset = Math.random() * Math.PI * 2;
  }

  private createPowerUp() {
    const colors = {
      speed: 0x00FF00,    // Green
      strength: 0xFF4500, // Red-Orange
      shield: 0x00BFFF    // Blue
    };

    const geometry = new THREE.OctahedronGeometry(0.4, 0);
    const material = new THREE.MeshLambertMaterial({ 
      color: colors[this.type],
      transparent: true,
      opacity: 0.8
    });

    const powerUpMesh = new THREE.Mesh(geometry, material);
    powerUpMesh.castShadow = true;
    this.group.add(powerUpMesh);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: colors[this.type],
      transparent: true,
      opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.group.add(glow);

    // Add floating particles
    this.createFloatingParticles();
  }

  private createFloatingParticles() {
    const particleCount = 20;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 1.5;
      positions[i3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 1.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const colors = {
      speed: 0x00FF00,
      strength: 0xFF4500,
      shield: 0x00BFFF
    };

    const particleMaterial = new THREE.PointsMaterial({
      color: colors[this.type],
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    this.group.add(particles);
  }

  update() {
    if (this.collected) return;

    // Rotation animation
    this.group.rotation.y += this.rotationSpeed;
    
    // Bobbing animation
    const bobAmount = Math.sin(Date.now() * 0.005 + this.bobOffset) * 0.3;
    this.group.position.y = 2 + bobAmount;

    // Pulsing glow effect
    const glowMesh = this.group.children[1] as THREE.Mesh;
    if (glowMesh) {
      const material = glowMesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(Date.now() * 0.008) * 0.1;
    }
  }

  collect(): PowerUpType {
    this.collected = true;
    this.group.visible = false;
    return this.type;
  }

  getBounds(): THREE.Box3 {
    if (this.collected) return new THREE.Box3();
    return new THREE.Box3().setFromObject(this.group);
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  isCollected(): boolean {
    return this.collected;
  }

  getPosition(): THREE.Vector3 {
    return this.group.position;
  }
}

export class PowerUpManager {
  private group: THREE.Group;
  private powerUps: PowerUp[] = [];
  private spawnInterval = 15; // Every 15 fence rows

  constructor() {
    this.group = new THREE.Group();
    this.generatePowerUps();
  }

  private generatePowerUps() {
    const types: PowerUpType[] = ['speed', 'strength', 'shield'];
    
    // Generate power-ups at regular intervals
    for (let i = 0; i < 30; i++) { // 30 power-ups total
      const z = -30 - (i * this.spawnInterval * 8); // Align with fence spacing
      const x = (Math.random() - 0.5) * 8; // Random X position
      const type = types[Math.floor(Math.random() * types.length)];
      
      const powerUp = new PowerUp(x, z, type);
      this.powerUps.push(powerUp);
      this.group.add(powerUp.getGroup());
    }
  }

  update(speed: number) {
    this.powerUps.forEach(powerUp => {
      powerUp.getGroup().position.z += speed * 15;
      powerUp.update();
    });

    // Remove power-ups that are too far behind
    this.powerUps = this.powerUps.filter(powerUp => {
      if (powerUp.getPosition().z > 25) {
        this.group.remove(powerUp.getGroup());
        return false;
      }
      return true;
    });
  }

  checkCollisions(bullBounds: THREE.Box3): PowerUpType | null {
    for (const powerUp of this.powerUps) {
      if (!powerUp.isCollected() && powerUp.getBounds().intersectsBox(bullBounds)) {
        return powerUp.collect();
      }
    }
    return null;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  reset() {
    this.powerUps.forEach(powerUp => {
      this.group.remove(powerUp.getGroup());
    });
    this.powerUps = [];
    this.generatePowerUps();
  }
}