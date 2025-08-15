import * as THREE from "three";
import { Tomato } from "./tomato";
import { Projectile } from "./projectile";
import { GAME_CONFIG } from "./constants";

export interface CollisionResult {
  projectileHits: Array<{ projectile: Projectile; tomato: Tomato }>;
  playerHits: Tomato[];
  playerOutOfBounds: boolean;
}

export class CollisionDetector {
  static checkCollisions(
    projectiles: Projectile[],
    tomatoes: Tomato[],
    playerPosition: THREE.Vector3
  ): CollisionResult {
    const result: CollisionResult = {
      projectileHits: [],
      playerHits: [],
      playerOutOfBounds: false,
    };

    // Check if player is out of bounds
    const mapBounds = GAME_CONFIG.MAP_SIZE / 2;
    if (
      Math.abs(playerPosition.x) > mapBounds ||
      Math.abs(playerPosition.z) > mapBounds
    ) {
      result.playerOutOfBounds = true;
    }

    // Check projectile-tomato collisions
    projectiles.forEach((projectile) => {
      tomatoes.forEach((tomato) => {
        const distance = projectile
          .getPosition()
          .distanceTo(tomato.getPosition());
        const collisionDistance = projectile.getRadius() + tomato.getRadius();

        if (distance < collisionDistance) {
          result.projectileHits.push({ projectile, tomato });
        }
      });
    });

    // Check player-tomato collisions (only check horizontal distance)
    tomatoes.forEach((tomato) => {
      const playerPos2D = new THREE.Vector2(playerPosition.x, playerPosition.z);
      const tomatoPos2D = new THREE.Vector2(tomato.getPosition().x, tomato.getPosition().z);
      const distance = playerPos2D.distanceTo(tomatoPos2D);
      const collisionDistance = 2 + tomato.getRadius(); // Player collision radius

      if (distance < collisionDistance) {
        console.log(`🚨 Player collision detected! Distance: ${distance.toFixed(2)}, Required: ${collisionDistance.toFixed(2)}`);
        console.log(`Player pos: (${playerPosition.x.toFixed(1)}, ${playerPosition.z.toFixed(1)})`);
        console.log(`Tomato pos: (${tomato.getPosition().x.toFixed(1)}, ${tomato.getPosition().z.toFixed(1)})`);
        result.playerHits.push(tomato);
      }
    });

    return result;
  }
}
