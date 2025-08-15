import * as THREE from "three";
import { VINTAGE_COLORS, GAME_CONFIG } from "./constants";

export class Tomato {
  private mesh: THREE.Group;
  private targetPosition: THREE.Vector3 = new THREE.Vector3();
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private speedMultiplier: number = 1;

  constructor(position: THREE.Vector3) {
    this.mesh = this.createTomatoMesh();
    this.mesh.position.copy(position);
  }

  setSpeedMultiplier(multiplier: number): void {
    this.speedMultiplier = multiplier;
  }

  private createTomatoMesh(): THREE.Group {
    const tomatoGroup = new THREE.Group();

    const bodyGeometry = new THREE.SphereGeometry(
      GAME_CONFIG.TOMATO_SIZE,
      12,
      8
    );
    const bodyMaterial = new THREE.MeshLambertMaterial({
      color: VINTAGE_COLORS.SADDLE_BROWN,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = GAME_CONFIG.TOMATO_SIZE;
    body.castShadow = true;

    const leafGeometry = new THREE.ConeGeometry(0.8, 1.2, 6);
    const leafMaterial = new THREE.MeshLambertMaterial({
      color: VINTAGE_COLORS.GRAY,
    });
    const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
    leaves.position.y = GAME_CONFIG.TOMATO_SIZE * 1.8;
    leaves.rotation.y = Math.PI / 6;
    leaves.castShadow = true;

    tomatoGroup.add(body);
    tomatoGroup.add(leaves);

    return tomatoGroup;
  }

  update(playerPosition: THREE.Vector3, delta: number): void {
    this.targetPosition.copy(playerPosition);
    this.targetPosition.y = this.mesh.position.y;

    const direction = new THREE.Vector3();
    direction.subVectors(this.targetPosition, this.mesh.position);
    direction.normalize();

    this.velocity.copy(direction);
    this.velocity.multiplyScalar(GAME_CONFIG.TOMATO_SPEED * this.speedMultiplier * delta);

    this.mesh.position.add(this.velocity);

    this.mesh.lookAt(
      this.targetPosition.x,
      this.mesh.position.y,
      this.targetPosition.z
    );

    this.mesh.rotation.y += Math.sin(Date.now() * 0.01) * 0.1 * delta;
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  getMesh(): THREE.Group {
    return this.mesh;
  }

  getRadius(): number {
    return GAME_CONFIG.TOMATO_SIZE;
  }

  dispose(): void {
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }
}
