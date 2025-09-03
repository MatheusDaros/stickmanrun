import * as THREE from 'three';

export class Bull {
  private group: THREE.Group;
  private body: THREE.Group;
  private isCharging = false;
  private chargePower = 0;
  private maxChargePower = 100;
  private position = { x: 0, y: 1.5, z: 0 };
  private velocity = { x: 0, y: 0, z: 0 };
  private animationTime = 0;
  private powerUps = {
    speed: false,
    strength: false,
    shield: false
  };
  private shieldMesh?: THREE.Mesh;

  constructor() {
    this.group = new THREE.Group();
    this.createBull();
    this.group.position.set(0, 1.5, 0);
  }

  private createBull() {
    this.body = new THREE.Group();
    
    // Materials
    const bullMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const hornMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFF0 });
    const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.8, 1.5, 4, 8);
    const bodyMesh = new THREE.Mesh(bodyGeometry, bullMaterial);
    bodyMesh.rotation.z = Math.PI / 2;
    bodyMesh.castShadow = true;
    this.body.add(bodyMesh);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.6, 12, 8);
    const head = new THREE.Mesh(headGeometry, bullMaterial);
    head.position.set(1.2, 0, 0);
    head.scale.set(1, 0.8, 1.2);
    head.castShadow = true;
    this.body.add(head);

    // Horns
    const hornGeometry = new THREE.ConeGeometry(0.08, 0.5, 6);
    
    const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
    leftHorn.position.set(1.6, 0.3, -0.3);
    leftHorn.rotation.x = -0.3;
    leftHorn.rotation.z = -0.2;
    leftHorn.castShadow = true;
    this.body.add(leftHorn);

    const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
    rightHorn.position.set(1.6, 0.3, 0.3);
    rightHorn.rotation.x = -0.3;
    rightHorn.rotation.z = 0.2;
    rightHorn.castShadow = true;
    this.body.add(rightHorn);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(1.7, 0.1, -0.2);
    this.body.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(1.7, 0.1, 0.2);
    this.body.add(rightEye);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.8, 8);
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    
    const positions = [
      { x: 0.5, z: -0.4 },
      { x: 0.5, z: 0.4 },
      { x: -0.5, z: -0.4 },
      { x: -0.5, z: 0.4 }
    ];

    positions.forEach((pos, index) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(pos.x, -0.8, pos.z);
      leg.castShadow = true;
      this.body.add(leg);
    });

    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.05, 0.15, 0.8, 6);
    const tail = new THREE.Mesh(tailGeometry, bullMaterial);
    tail.position.set(-1.2, 0.2, 0);
    tail.rotation.z = 0.5;
    tail.castShadow = true;
    this.body.add(tail);

    this.group.add(this.body);
  }

  startCharging() {
    this.isCharging = true;
    this.chargePower = 0;
  }

  stopCharging() {
    if (this.isCharging && this.chargePower > 20) {
      // Release charge with power based on charge time
      const chargeMultiplier = this.chargePower / this.maxChargePower;
      this.velocity.z = -0.3 * (1 + chargeMultiplier);
      
      // Add some screen shake effect by slightly moving the bull
      this.body.rotation.x = -0.1;
    }
    this.isCharging = false;
    this.chargePower = 0;
  }

  moveLeft() {
    this.velocity.x = Math.max(this.velocity.x - 0.02, -0.2);
  }

  moveRight() {
    this.velocity.x = Math.min(this.velocity.x + 0.02, 0.2);
  }

  activatePowerUp(type: 'speed' | 'strength' | 'shield') {
    this.powerUps[type] = true;
    
    if (type === 'shield' && !this.shieldMesh) {
      const shieldGeometry = new THREE.SphereGeometry(1.2, 16, 16);
      const shieldMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x00FFFF, 
        transparent: true, 
        opacity: 0.3 
      });
      this.shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
      this.group.add(this.shieldMesh);
    }
    
    // Auto-deactivate after duration
    setTimeout(() => {
      this.powerUps[type] = false;
      if (type === 'shield' && this.shieldMesh) {
        this.group.remove(this.shieldMesh);
        this.shieldMesh = undefined;
      }
    }, 5000);
  }

  update() {
    // Update charging
    if (this.isCharging) {
      this.chargePower = Math.min(this.chargePower + 2, this.maxChargePower);
      
      // Charging animation
      const chargeIntensity = this.chargePower / this.maxChargePower;
      this.body.rotation.y = Math.sin(this.animationTime * 10) * 0.05 * chargeIntensity;
    }

    // Apply velocity with power-up modifiers
    const speedMultiplier = this.powerUps.speed ? 1.5 : 1;
    this.position.x += this.velocity.x * speedMultiplier;
    this.position.z += this.velocity.z * speedMultiplier;

    // Apply damping
    this.velocity.x *= 0.9;
    this.velocity.z *= 0.95;

    // Keep bull within bounds
    this.position.x = Math.max(-6, Math.min(6, this.position.x));

    // Update position
    this.group.position.set(this.position.x, this.position.y, this.position.z);

    // Running animation
    this.animationTime += 0.1;
    if (!this.isCharging) {
      this.body.rotation.y = Math.sin(this.animationTime) * 0.02;
      this.body.rotation.x = Math.max(this.body.rotation.x - 0.02, 0);
    }

    // Shield animation
    if (this.shieldMesh) {
      this.shieldMesh.rotation.y += 0.05;
      this.shieldMesh.material.opacity = 0.3 + Math.sin(this.animationTime * 3) * 0.1;
    }
  }

  getChargePower(): number {
    return this.chargePower;
  }

  getMaxChargePower(): number {
    return this.maxChargePower;
  }

  isChargingActive(): boolean {
    return this.isCharging;
  }

  getBounds(): THREE.Box3 {
    return new THREE.Box3().setFromObject(this.group);
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  getPosition(): { x: number; y: number; z: number } {
    return { ...this.position };
  }

  getPowerUps() {
    return { ...this.powerUps };
  }

  reset() {
    this.position = { x: 0, y: 1.5, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.isCharging = false;
    this.chargePower = 0;
    this.animationTime = 0;
    this.group.position.set(0, 1.5, 0);
    this.body.rotation.set(0, 0, 0);
    
    // Clear power-ups
    Object.keys(this.powerUps).forEach(key => {
      this.powerUps[key as keyof typeof this.powerUps] = false;
    });
    
    if (this.shieldMesh) {
      this.group.remove(this.shieldMesh);
      this.shieldMesh = undefined;
    }
  }
}