import * as THREE from 'three';

export class Environment {
  private group: THREE.Group;
  private groundTiles: THREE.Mesh[] = [];
  private tileSize = 10;

  constructor() {
    this.group = new THREE.Group();
    this.createGround();
    this.createSkybox();
  }

  private createGround() {
    const groundGeometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4a5d23,
      side: THREE.DoubleSide 
    });

    // Create multiple ground tiles for infinite scrolling effect
    for (let i = 0; i < 10; i++) {
      const groundTile = new THREE.Mesh(groundGeometry, groundMaterial);
      groundTile.rotation.x = -Math.PI / 2;
      groundTile.position.set(0, 0, i * this.tileSize - 20);
      groundTile.receiveShadow = true;
      
      this.groundTiles.push(groundTile);
      this.group.add(groundTile);
    }

    // Add some grass texture variation
    this.addGrassDetails();
  }

  private addGrassDetails() {
    const grassGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });

    for (let i = 0; i < 100; i++) {
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.position.set(
        (Math.random() - 0.5) * 20,
        0.15,
        Math.random() * 50 - 20
      );
      grass.rotation.y = Math.random() * Math.PI;
      grass.castShadow = true;
      this.group.add(grass);
    }
  }

  private createSkybox() {
    // Create a simple gradient sky
    const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x87CEEB,
      side: THREE.BackSide 
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.group.add(sky);

    // Add some clouds
    this.addClouds();
  }

  private addClouds() {
    const cloudGeometry = new THREE.SphereGeometry(2, 8, 8);
    const cloudMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.8 
    });

    for (let i = 0; i < 8; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloud.position.set(
        (Math.random() - 0.5) * 60,
        15 + Math.random() * 10,
        (Math.random() - 0.5) * 60
      );
      cloud.scale.set(
        1 + Math.random(),
        0.5 + Math.random() * 0.5,
        1 + Math.random()
      );
      this.group.add(cloud);
    }
  }

  update(speed: number) {
    // Move ground tiles
    this.groundTiles.forEach(tile => {
      tile.position.z += speed * 10;
      
      // Reset tile position when it goes too far
      if (tile.position.z > 30) {
        tile.position.z -= this.tileSize * this.groundTiles.length;
      }
    });
  }

  getGroup(): THREE.Group {
    return this.group;
  }
}