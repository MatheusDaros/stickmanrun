import * as THREE from 'three';

export type FenceType = 'wooden' | 'metal' | 'stone';

class Fence {
  private group: THREE.Group;
  private bounds: THREE.Box3;
  private type: FenceType;
  private health: number;
  private maxHealth: number;
  private destroyed = false;
  private particles: THREE.Points[] = [];

  constructor(x: number, z: number, type: FenceType) {
    this.type = type;
    this.group = new THREE.Group();
    this.setHealthByType();
    this.createFence();
    this.group.position.set(x, 0, z);
    this.bounds = new THREE.Box3().setFromObject(this.group);
  }

  private setHealthByType() {
    switch (this.type) {
      case 'wooden':
        this.health = this.maxHealth = 1;
        break;
      case 'metal':
        this.health = this.maxHealth = 2;
        break;
      case 'stone':
        this.health = this.maxHealth = 3;
        break;
    }
  }

  private createFence() {
    const materials = {
      wooden: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
      metal: new THREE.MeshLambertMaterial({ color: 0x708090 }),
      stone: new THREE.MeshLambertMaterial({ color: 0x696969 })
    };

    const material = materials[this.type];
    
    // Fence posts
    const postGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 8);
    
    const leftPost = new THREE.Mesh(postGeometry, material);
    leftPost.position.set(-1.2, 1.25, 0);
    leftPost.castShadow = true;
    this.group.add(leftPost);

    const rightPost = new THREE.Mesh(postGeometry, material);
    rightPost.position.set(1.2, 1.25, 0);
    rightPost.castShadow = true;
    this.group.add(rightPost);

    // Fence rails - more for stronger materials
    const railGeometry = new THREE.BoxGeometry(2.6, 0.15, 0.15);
    const railCount = this.type === 'wooden' ? 3 : this.type === 'metal' ? 4 : 5;
    
    for (let i = 0; i < railCount; i++) {
      const rail = new THREE.Mesh(railGeometry, material);
      const height = 0.5 + (i * (1.8 / (railCount - 1)));
      rail.position.set(0, height, 0);
      rail.castShadow = true;
      this.group.add(rail);
    }

    // Add type-specific details
    if (this.type === 'metal') {
      // Add metal rivets
      const rivetGeometry = new THREE.SphereGeometry(0.03, 6, 6);
      const rivetMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F4F });
      
      for (let i = 0; i < 8; i++) {
        const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial);
        rivet.position.set(
          (Math.random() - 0.5) * 2,
          0.5 + Math.random() * 1.5,
          0.08
        );
        this.group.add(rivet);
      }
    } else if (this.type === 'stone') {
      // Add stone texture variation
      const stoneDetailGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.1);
      const stoneDetailMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
      
      for (let i = 0; i < 6; i++) {
        const detail = new THREE.Mesh(stoneDetailGeometry, stoneDetailMaterial);
        detail.position.set(
          (Math.random() - 0.5) * 2,
          0.5 + Math.random() * 1.5,
          0.1
        );
        detail.rotation.set(
          Math.random() * 0.5,
          Math.random() * 0.5,
          Math.random() * 0.5
        );
        this.group.add(detail);
      }
    }
  }

  takeDamage(damage: number): boolean {
    this.health -= damage;
    
    // Visual damage feedback
    const damageRatio = 1 - (this.health / this.maxHealth);
    this.group.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshLambertMaterial;
        material.color.multiplyScalar(1 - damageRatio * 0.3);
      }
    });

    if (this.health <= 0 && !this.destroyed) {
      this.destroy();
      return true; // Fence destroyed
    }
    
    return false; // Fence damaged but not destroyed
  }

  private destroy() {
    this.destroyed = true;
    this.createDestructionEffect();
    
    // Make fence invisible but keep for particle effects
    this.group.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child.visible = false;
      }
    });
  }

  private createDestructionEffect() {
    const particleCount = this.type === 'wooden' ? 50 : this.type === 'metal' ? 30 : 80;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Starting positions around the fence
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = Math.random() * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
      
      // Random velocities for explosion effect
      velocities[i3] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 1] = Math.random() * 0.15;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleColors = {
      wooden: 0x8B4513,
      metal: 0x708090,
      stone: 0x696969
    };

    const particleMaterial = new THREE.PointsMaterial({
      color: particleColors[this.type],
      size: this.type === 'stone' ? 0.08 : 0.05,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.position.copy(this.group.position);
    this.particles.push(particles);
  }

  updateParticles() {
    this.particles.forEach((particleSystem, index) => {
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      const velocities = particleSystem.geometry.attributes.velocity.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Update positions
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        // Apply gravity to Y velocity
        velocities[i + 1] -= 0.005;
      }
      
      particleSystem.geometry.attributes.position.needsUpdate = true;
      
      // Fade out particles
      const material = particleSystem.material as THREE.PointsMaterial;
      material.opacity *= 0.98;
      
      // Remove when fully faded
      if (material.opacity < 0.01) {
        this.particles.splice(index, 1);
      }
    });
  }

  getParticles(): THREE.Points[] {
    return this.particles;
  }

  getBounds(): THREE.Box3 {
    if (this.destroyed) {
      return new THREE.Box3(); // Empty bounds for destroyed fence
    }
    this.bounds.setFromObject(this.group);
    return this.bounds;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  getType(): FenceType {
    return this.type;
  }

  getHealth(): number {
    return this.health;
  }

  getMaxHealth(): number {
    return this.maxHealth;
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }

  getPosition(): THREE.Vector3 {
    return this.group.position;
  }
}

export class FenceManager {
  private group: THREE.Group;
  private fences: Fence[] = [];
  private particleGroup: THREE.Group;
  private totalFences = 500;
  private fenceSpacing = 8;
  private lanes = [-3, 0, 3];

  constructor() {
    this.group = new THREE.Group();
    this.particleGroup = new THREE.Group();
    this.generateAllFences();
  }

  private generateAllFences() {
    for (let i = 0; i < this.totalFences; i++) {
      const fenceZ = -20 - (i * this.fenceSpacing);
      
      // Determine fence pattern for this row
      const pattern = this.getFencePattern(i);
      
      pattern.forEach(laneIndex => {
        const laneX = this.lanes[laneIndex];
        const fenceType = this.getFenceType(i);
        const fence = new Fence(laneX, fenceZ, fenceType);
        
        this.fences.push(fence);
        this.group.add(fence.getGroup());
      });
    }
  }

  private getFencePattern(rowIndex: number): number[] {
    // Progressive difficulty - more fences as game progresses
    const difficulty = Math.min(rowIndex / 100, 1);
    
    if (Math.random() < 0.3 + difficulty * 0.3) {
      // 2 fences, leave one lane open
      const openLane = Math.floor(Math.random() * 3);
      return [0, 1, 2].filter(i => i !== openLane);
    } else {
      // 1 fence, random lane
      return [Math.floor(Math.random() * 3)];
    }
  }

  private getFenceType(rowIndex: number): FenceType {
    const difficulty = rowIndex / this.totalFences;
    
    if (difficulty < 0.3) {
      return 'wooden';
    } else if (difficulty < 0.7) {
      return Math.random() < 0.7 ? 'wooden' : 'metal';
    } else {
      const rand = Math.random();
      if (rand < 0.5) return 'wooden';
      if (rand < 0.8) return 'metal';
      return 'stone';
    }
  }

  update(speed: number) {
    // Update fence positions
    this.fences.forEach(fence => {
      fence.getGroup().position.z += speed * 15;
      fence.updateParticles();
      
      // Add particles to scene
      fence.getParticles().forEach(particle => {
        if (!this.particleGroup.children.includes(particle)) {
          this.particleGroup.add(particle);
        }
      });
    });

    // Remove fences that are too far behind
    this.fences = this.fences.filter(fence => {
      if (fence.getPosition().z > 25) {
        this.group.remove(fence.getGroup());
        
        // Remove associated particles
        fence.getParticles().forEach(particle => {
          this.particleGroup.remove(particle);
        });
        
        return false;
      }
      return true;
    });
  }

  checkCollisions(bullBounds: THREE.Box3, bullPowerUps: any): { destroyed: boolean; fenceType: FenceType } | null {
    for (const fence of this.fences) {
      if (!fence.isDestroyed() && fence.getBounds().intersectsBox(bullBounds)) {
        const damage = bullPowerUps.strength ? 2 : 1;
        const destroyed = fence.takeDamage(damage);
        
        return {
          destroyed,
          fenceType: fence.getType()
        };
      }
    }
    return null;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  getParticleGroup(): THREE.Group {
    return this.particleGroup;
  }

  getFences(): Fence[] {
    return this.fences;
  }

  reset() {
    // Remove all fences and particles
    this.fences.forEach(fence => {
      this.group.remove(fence.getGroup());
      fence.getParticles().forEach(particle => {
        this.particleGroup.remove(particle);
      });
    });
    this.fences = [];
    
    // Clear particle group
    this.particleGroup.clear();
    
    // Regenerate all fences
    this.generateAllFences();
  }
}