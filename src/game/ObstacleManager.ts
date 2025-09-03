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
  private totalFences = 500;
  private fenceSpacing = 6;
  private lanes = [-3, 0, 3]; // Left, Middle, Right lanes

  constructor() {
    this.group = new THREE.Group();
    this.generateAllFences();
  }

  private generateAllFences() {
    // Generate all 500 fences at once across three lanes
    for (let i = 0; i < this.totalFences; i++) {
      const fenceZ = -15 - (i * this.fenceSpacing);
      
      // Randomly choose 1-3 lanes to place fences, ensuring at least one lane is always open
      const availableLanes = [...this.lanes];
      const numFencesToPlace = Math.floor(Math.random() * 2) + 1; // 1 or 2 fences per row
      
      // Always leave at least one lane open for the player to pass through
      const lanesToBlock = [];
      for (let j = 0; j < numFencesToPlace && lanesToBlock.length < 2; j++) {
        const randomIndex = Math.floor(Math.random() * availableLanes.length);
        lanesToBlock.push(availableLanes.splice(randomIndex, 1)[0]);
      }
      
      // Create fences in the selected lanes
      lanesToBlock.forEach(laneX => {
        const fence = new Fence(laneX, fenceZ);
        this.fences.push(fence);
        this.group.add(fence.getGroup());
      });
    }
  }

  private generateSingleFenceRow(i: number) {
    const fenceZ = -15 - (i * this.fenceSpacing);
    
    // Randomly choose 1-3 lanes to place fences, ensuring at least one lane is always open
    const availableLanes = [...this.lanes];
    const numFencesToPlace = Math.floor(Math.random() * 2) + 1; // 1 or 2 fences per row
    
    // Always leave at least one lane open for the player to pass through
    const lanesToBlock = [];
    for (let j = 0; j < numFencesToPlace && lanesToBlock.length < 2; j++) {
      const randomIndex = Math.floor(Math.random() * availableLanes.length);
      lanesToBlock.push(availableLanes.splice(randomIndex, 1)[0]);
    }
    
    // Create fences in the selected lanes
    lanesToBlock.forEach(laneX => {
      
      const fence = new Fence(fenceX, fenceZ);
      this.fences.push(fence);
      this.group.add(fence.getGroup());
    });
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