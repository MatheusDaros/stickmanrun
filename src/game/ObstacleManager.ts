import * as THREE from 'three';

class Fence {
  private group: THREE.Group;
  private bounds: THREE.Box3;

  constructor(x: number, z: number) {
    this.group = new THREE.Group();
    this.createFence();
    this.group.position.set(x, 0, z);
    this.bounds = new THREE.Box3().setFromObject(this.group);
  }

  private createFence() {
    const postMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const railMaterial = new THREE.MeshLambertMaterial({ color: 0xA0522D });

    // Fence posts
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(-1, 1, 0);
    leftPost.castShadow = true;
    this.group.add(leftPost);

    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(1, 1, 0);
    rightPost.castShadow = true;
    this.group.add(rightPost);

    // Fence rails
    const railGeometry = new THREE.BoxGeometry(2.2, 0.1, 0.1);
    
    const topRail = new THREE.Mesh(railGeometry, railMaterial);
    topRail.position.set(0, 1.7, 0);
    topRail.castShadow = true;
    this.group.add(topRail);

    const middleRail = new THREE.Mesh(railGeometry, railMaterial);
    middleRail.position.set(0, 1.2, 0);
    middleRail.castShadow = true;
    this.group.add(middleRail);

    const bottomRail = new THREE.Mesh(railGeometry, railMaterial);
    bottomRail.position.set(0, 0.7, 0);
    bottomRail.castShadow = true;
    this.group.add(bottomRail);
  }

  update(speed: number) {
    this.group.position.z += speed * 10;
    this.bounds.setFromObject(this.group);
  }

  getBounds(): THREE.Box3 {
    return this.bounds;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  getPosition(): THREE.Vector3 {
    return this.group.position;
  }
}

export class ObstacleManager {
  private group: THREE.Group;
  private fences: Fence[] = [];
  private totalFences = 100;
  private fenceSpacing = 6;

  constructor() {
    this.group = new THREE.Group();
    this.generateAllFences();
  }

  private generateAllFences() {
    // Generate all 100 fences at once
    for (let i = 0; i < this.totalFences; i++) {
      const fenceZ = -15 - (i * this.fenceSpacing);
      const fenceX = (Math.random() - 0.5) * 4; // Random X position for variety
      
      const fence = new Fence(fenceX, fenceZ);
      this.fences.push(fence);
      this.group.add(fence.getGroup());
    }
  }

  update(speed: number) {
    // Update existing fences
    this.fences.forEach(fence => {
      fence.update(speed);
    });

    // Remove fences that are too far behind
    this.fences = this.fences.filter(fence => {
      if (fence.getPosition().z > 20) {
        this.group.remove(fence.getGroup());
        return false;
      }
      return true;
    });
  }

  getObstacles(): Fence[] {
    return this.fences;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  reset() {
    // Remove all fences
    this.fences.forEach(fence => {
      this.group.remove(fence.getGroup());
    });
    this.fences = [];
    
    // Regenerate all fences
    this.generateAllFences();
  }
}