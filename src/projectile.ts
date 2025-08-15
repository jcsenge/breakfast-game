import * as THREE from "three";
import { VINTAGE_COLORS, GAME_CONFIG } from "./constants";

export class Projectile {
  private mesh: THREE.Mesh;
  private velocity: THREE.Vector3;
  private creationTime: number;
  private camera: THREE.Camera;

  constructor(
    position: THREE.Vector3,
    direction: THREE.Vector3,
    camera: THREE.Camera
  ) {
    this.camera = camera;
    this.creationTime = Date.now();
    this.velocity = direction
      .clone()
      .multiplyScalar(GAME_CONFIG.PROJECTILE_SPEED);
    this.mesh = this.createProjectileMesh();
    this.mesh.position.copy(position);
  }

  private createProjectileMesh(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(
      GAME_CONFIG.PROJECTILE_SIZE,
      GAME_CONFIG.PROJECTILE_SIZE,
      GAME_CONFIG.PROJECTILE_SIZE
    );

    const texture = this.createBinaryTexture();
    const material = new THREE.MeshLambertMaterial({
      color: VINTAGE_COLORS.CHOCOLATE,
      map: texture,
      transparent: true,
      opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    return mesh;
  }

  private createBinaryTexture(): THREE.Texture {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = 64;
    canvas.height = 64;

    context.fillStyle = VINTAGE_COLORS.CHOCOLATE;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = VINTAGE_COLORS.WHEAT;
    context.font = 'bold 48px "Press Start 2P", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";

    const binaryChar = Math.random() < 0.5 ? "0" : "1";
    context.fillText(binaryChar, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    return texture;
  }

  update(delta: number): boolean {
    this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));

    this.mesh.lookAt(this.camera.position);

    this.mesh.rotation.z += 2 * delta;

    return Date.now() - this.creationTime < GAME_CONFIG.PROJECTILE_LIFETIME;
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  getRadius(): number {
    return GAME_CONFIG.PROJECTILE_SIZE;
  }

  dispose(): void {
    if (this.mesh.geometry) this.mesh.geometry.dispose();
    if (this.mesh.material) {
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach((material) => material.dispose());
      } else {
        this.mesh.material.dispose();
      }
    }
  }
}
