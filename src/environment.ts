import * as THREE from "three";
import { VINTAGE_COLORS, GAME_CONFIG } from "./constants";

export class Environment {
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    console.log("🌱 Creating ground...");
    this.createGround();
    console.log("🌌 Creating sky...");
    this.createSky();
    console.log("💡 Creating lighting...");
    this.createLighting();
    console.log("🌲 Creating trees...");
    this.createTrees();
    console.log("✅ Environment setup complete!");
  }

  private createGround(): void {
    const groundGeometry = new THREE.PlaneGeometry(
      GAME_CONFIG.MAP_SIZE,
      GAME_CONFIG.MAP_SIZE
    );
    const groundTexture = this.createGroundTexture();
    const groundMaterial = new THREE.MeshLambertMaterial({
      map: groundTexture,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;

    this.scene.add(ground);
  }

  private createGroundTexture(): THREE.Texture {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = 512;
    canvas.height = 512;

    context.fillStyle = VINTAGE_COLORS.WHEAT;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = VINTAGE_COLORS.SADDLE_BROWN;
    for (let i = 0; i < canvas.width; i += 32) {
      context.fillRect(i, 0, 2, canvas.height);
    }
    for (let i = 0; i < canvas.height; i += 32) {
      context.fillRect(0, i, canvas.width, 2);
    }

    context.fillStyle = VINTAGE_COLORS.GRAY;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      context.fillRect(x, y, 3, 3);
    }

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    return texture;
  }

  private createSky(): void {
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: VINTAGE_COLORS.SILVER,
      side: THREE.BackSide,
    });

    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
  }

  private createLighting(): void {
    const ambientLight = new THREE.AmbientLight(VINTAGE_COLORS.WHEAT, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      VINTAGE_COLORS.WHEAT,
      0.8
    );
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;

    this.scene.add(directionalLight);
  }

  private createTrees(): void {
    const treePositions = this.generateTreePositions(15);

    treePositions.forEach((position) => {
      const tree = this.createTree();
      tree.position.set(position.x, 0, position.z);
      this.scene.add(tree);
    });
  }

  private generateTreePositions(count: number): THREE.Vector3[] {
    const positions: THREE.Vector3[] = [];
    const mapBounds = GAME_CONFIG.MAP_SIZE / 2 - 5;

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * mapBounds * 2;
      const z = (Math.random() - 0.5) * mapBounds * 2;

      if (Math.abs(x) > 10 || Math.abs(z) > 10) {
        positions.push(new THREE.Vector3(x, 0, z));
      }
    }

    return positions;
  }

  private createTree(): THREE.Group {
    const tree = new THREE.Group();

    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({
      color: VINTAGE_COLORS.SADDLE_BROWN,
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 4;
    trunk.castShadow = true;

    const leavesGeometry = new THREE.SphereGeometry(3, 8, 6);
    const leavesMaterial = new THREE.MeshLambertMaterial({
      color: VINTAGE_COLORS.CHOCOLATE,
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 8;
    leaves.castShadow = true;

    tree.add(trunk);
    tree.add(leaves);

    return tree;
  }
}
