import * as THREE from "three";
import { Tomato } from "./tomato";
import { GAME_CONFIG } from "./constants";

export class EnemyManager {
  private scene: THREE.Scene;
  private tomatoes: Tomato[] = [];
  private lastSpawnTime: number = 0;
  private spawnRate: number = GAME_CONFIG.TOMATO_SPAWN_RATE;
  private currentLevel: number = 1;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  updateDifficulty(level: number): void {
    this.currentLevel = level;
    
    // Increase spawn rate (decrease time between spawns)
    this.spawnRate = Math.max(
      GAME_CONFIG.TOMATO_SPAWN_RATE * (0.8 ** (level - 1)),
      500 // Minimum spawn rate of 0.5 seconds
    );
    
    console.log(`🔥 Difficulty updated! Level ${level}, Spawn rate: ${this.spawnRate}ms`);
  }

  private getRandomEdgePosition(): THREE.Vector3 {
    const mapBounds = GAME_CONFIG.MAP_SIZE / 2 - 2;
    const side = Math.floor(Math.random() * 4);

    let x: number, z: number;

    switch (side) {
      case 0: // North edge
        x = (Math.random() - 0.5) * GAME_CONFIG.MAP_SIZE;
        z = mapBounds;
        break;
      case 1: // East edge
        x = mapBounds;
        z = (Math.random() - 0.5) * GAME_CONFIG.MAP_SIZE;
        break;
      case 2: // South edge
        x = (Math.random() - 0.5) * GAME_CONFIG.MAP_SIZE;
        z = -mapBounds;
        break;
      case 3: // West edge
      default:
        x = -mapBounds;
        z = (Math.random() - 0.5) * GAME_CONFIG.MAP_SIZE;
        break;
    }

    return new THREE.Vector3(x, 0, z);
  }

  private spawnTomato(): void {
    // Spawn multiple tomatoes at higher levels
    const spawnCount = Math.min(Math.floor(this.currentLevel / 2) + 1, 4);
    
    for (let i = 0; i < spawnCount; i++) {
      const position = this.getRandomEdgePosition();
      const tomato = new Tomato(position);
      
      // Increase tomato speed based on level
      const speedMultiplier = 1 + (this.currentLevel - 1) * 0.3;
      tomato.setSpeedMultiplier(speedMultiplier);

      this.tomatoes.push(tomato);
      this.scene.add(tomato.getMesh());
    }

    console.log(`🍅 ${spawnCount} tomato(s) spawned at level ${this.currentLevel}`);
  }

  update(playerPosition: THREE.Vector3, delta: number): void {
    const currentTime = Date.now();

    if (currentTime - this.lastSpawnTime > this.spawnRate) {
      this.spawnTomato();
      this.lastSpawnTime = currentTime;
    }

    this.tomatoes.forEach((tomato) => {
      tomato.update(playerPosition, delta);
    });
  }

  getTomatoes(): Tomato[] {
    return [...this.tomatoes];
  }

  removeTomato(tomato: Tomato): void {
    const index = this.tomatoes.indexOf(tomato);
    if (index !== -1) {
      this.scene.remove(tomato.getMesh());
      tomato.dispose();
      this.tomatoes.splice(index, 1);
    }
  }

  setSpawnRate(rate: number): void {
    this.spawnRate = rate;
  }

  dispose(): void {
    this.tomatoes.forEach((tomato) => {
      this.scene.remove(tomato.getMesh());
      tomato.dispose();
    });
    this.tomatoes = [];
  }
}
