import * as THREE from "three";
import { Projectile } from "./projectile";

export class ProjectileManager {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private projectiles: Projectile[] = [];

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
  }

  shootProjectile(position: THREE.Vector3, direction: THREE.Vector3): void {
    const projectile = new Projectile(position, direction, this.camera);
    this.projectiles.push(projectile);
    this.scene.add(projectile.getMesh());
    console.log("💥 Binary projectile fired!");
  }

  update(delta: number): void {
    this.projectiles = this.projectiles.filter((projectile) => {
      const isAlive = projectile.update(delta);

      if (!isAlive) {
        this.scene.remove(projectile.getMesh());
        projectile.dispose();
      }

      return isAlive;
    });
  }

  getProjectiles(): Projectile[] {
    return [...this.projectiles];
  }

  removeProjectile(projectile: Projectile): void {
    const index = this.projectiles.indexOf(projectile);
    if (index !== -1) {
      this.scene.remove(projectile.getMesh());
      projectile.dispose();
      this.projectiles.splice(index, 1);
    }
  }

  dispose(): void {
    this.projectiles.forEach((projectile) => {
      this.scene.remove(projectile.getMesh());
      projectile.dispose();
    });
    this.projectiles = [];
  }
}
