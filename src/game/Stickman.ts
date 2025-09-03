import * as THREE from 'three';

export class Stickman {
  private group: THREE.Group;
  private body: THREE.Group;
  private isJumping = false;
  private jumpVelocity = 0;
  private groundY = 1;
  private jumpHeight = 0;
  private runAnimation = 0;
  private horizontalVelocity = 0;
  private maxHorizontalSpeed = 0.15;
  private horizontalDamping = 0.85;

  constructor() {
    this.group = new THREE.Group();
    this.createStickman();
    this.group.position.set(-3, this.groundY, 0);
  }

  private createStickman() {
    this.body = new THREE.Group();
    
    // Materials
    const stickMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const jointMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const head = new THREE.Mesh(headGeometry, jointMaterial);
    head.position.y = 2.3;
    head.castShadow = true;
    this.body.add(head);

    // Torso
    const torsoGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.2, 8);
    const torso = new THREE.Mesh(torsoGeometry, stickMaterial);
    torso.position.y = 1.4;
    torso.castShadow = true;
    this.body.add(torso);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 6);
    
    const leftArm = new THREE.Mesh(armGeometry, stickMaterial);
    leftArm.position.set(-0.3, 1.8, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    this.body.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, stickMaterial);
    rightArm.position.set(0.3, 1.8, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    this.body.add(rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1, 6);
    
    const leftLeg = new THREE.Mesh(legGeometry, stickMaterial);
    leftLeg.position.set(-0.15, 0.3, 0);
    leftLeg.castShadow = true;
    this.body.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, stickMaterial);
    rightLeg.position.set(0.15, 0.3, 0);
    rightLeg.castShadow = true;
    this.body.add(rightLeg);

    // Store references for animation
    this.body.userData = {
      leftArm,
      rightArm,
      leftLeg,
      rightLeg
    };

    this.group.add(this.body);
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.jumpVelocity = 0.2;
    }
  }

  moveLeft() {
    this.horizontalVelocity = Math.max(this.horizontalVelocity - 0.02, -this.maxHorizontalSpeed);
  }

  moveRight() {
    this.horizontalVelocity = Math.min(this.horizontalVelocity + 0.02, this.maxHorizontalSpeed);
  }

  update() {
    // Handle horizontal movement
    this.group.position.x += this.horizontalVelocity;
    
    // Apply damping to horizontal movement
    this.horizontalVelocity *= this.horizontalDamping;
    
    // Keep stickman within bounds
    this.group.position.x = Math.max(-4, Math.min(4, this.group.position.x));
    
    // Handle jumping physics
    if (this.isJumping) {
      this.jumpHeight += this.jumpVelocity;
      this.jumpVelocity -= 0.012; // Gravity
      
      if (this.jumpHeight <= 0) {
        this.jumpHeight = 0;
        this.isJumping = false;
        this.jumpVelocity = 0;
      }
    }

    // Update position
    this.group.position.y = this.groundY + this.jumpHeight;

    // Running animation
    if (!this.isJumping) {
      this.runAnimation += 0.2;
      const { leftArm, rightArm, leftLeg, rightLeg } = this.body.userData;
      
      // Animate arms and legs for running motion
      leftArm.rotation.x = Math.sin(this.runAnimation) * 0.5;
      rightArm.rotation.x = -Math.sin(this.runAnimation) * 0.5;
      leftLeg.rotation.x = -Math.sin(this.runAnimation) * 0.3;
      rightLeg.rotation.x = Math.sin(this.runAnimation) * 0.3;
    }
  }

  getBounds(): THREE.Box3 {
    const box = new THREE.Box3().setFromObject(this.group);
    return box;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  reset() {
    this.group.position.set(0, this.groundY, 0);
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.jumpHeight = 0;
    this.runAnimation = 0;
    this.horizontalVelocity = 0;
  }
}