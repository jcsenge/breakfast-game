import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GAME_CONFIG } from "./constants";

export type ShootCallback = (
  position: THREE.Vector3,
  direction: THREE.Vector3
) => void;

export class PlayerController {
  private controls: PointerLockControls;
  private moveForward: boolean = false;
  private moveBackward: boolean = false;
  private moveLeft: boolean = false;
  private moveRight: boolean = false;
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private direction: THREE.Vector3 = new THREE.Vector3();
  private prevTime: number = performance.now();
  private shootCallback?: ShootCallback;

  constructor(controls: PointerLockControls) {
    this.controls = controls;
    this.setupEventListeners();
  }

  setShootCallback(callback: ShootCallback): void {
    this.shootCallback = callback;
  }

  private setupEventListeners(): void {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("click", this.handleClick.bind(this));
  }

  private handleClick(event: MouseEvent): void {
    if (!this.controls.isLocked) return;

    if (event.button === 0 && this.shootCallback) {
      // Left click
      const camera = this.controls.object;
      const position = camera.position.clone();
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);

      this.shootCallback(position, direction);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this.moveForward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.moveLeft = true;
        break;
      case "ArrowDown":
      case "KeyS":
        this.moveBackward = true;
        break;
      case "ArrowRight":
      case "KeyD":
        this.moveRight = true;
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this.moveForward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        this.moveLeft = false;
        break;
      case "ArrowDown":
      case "KeyS":
        this.moveBackward = false;
        break;
      case "ArrowRight":
      case "KeyD":
        this.moveRight = false;
        break;
    }
  }

  private constrainToMap(position: THREE.Vector3): THREE.Vector3 {
    const mapBounds = GAME_CONFIG.MAP_SIZE / 2 - 2;

    return new THREE.Vector3(
      Math.max(-mapBounds, Math.min(mapBounds, position.x)),
      position.y,
      Math.max(-mapBounds, Math.min(mapBounds, position.z))
    );
  }

  update(): void {
    if (!this.controls.isLocked) return;

    const time = performance.now();
    const delta = (time - this.prevTime) / 1000;

    // Apply friction
    this.velocity.x -= this.velocity.x * 5.0 * delta;
    this.velocity.z -= this.velocity.z * 5.0 * delta;

    // Get the camera's forward and right vectors
    const camera = this.controls.object;
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(forward);
    right.crossVectors(forward, camera.up).normalize();
    forward.y = 0; // Keep movement on the ground plane
    right.y = 0;
    forward.normalize();

    // Apply movement based on input
    if (this.moveForward) {
      this.velocity.x += forward.x * GAME_CONFIG.PLAYER_SPEED * delta;
      this.velocity.z += forward.z * GAME_CONFIG.PLAYER_SPEED * delta;
    }
    if (this.moveBackward) {
      this.velocity.x -= forward.x * GAME_CONFIG.PLAYER_SPEED * delta;
      this.velocity.z -= forward.z * GAME_CONFIG.PLAYER_SPEED * delta;
    }
    if (this.moveLeft) {
      this.velocity.x -= right.x * GAME_CONFIG.PLAYER_SPEED * delta;
      this.velocity.z -= right.z * GAME_CONFIG.PLAYER_SPEED * delta;
    }
    if (this.moveRight) {
      this.velocity.x += right.x * GAME_CONFIG.PLAYER_SPEED * delta;
      this.velocity.z += right.z * GAME_CONFIG.PLAYER_SPEED * delta;
    }

    // Update position
    const currentPosition = this.controls.object.position;
    const newPosition = currentPosition.clone();
    newPosition.x += this.velocity.x * delta;
    newPosition.z += this.velocity.z * delta;

    const constrainedPosition = this.constrainToMap(newPosition);
    this.controls.object.position.copy(constrainedPosition);

    this.prevTime = time;
  }

  getPosition(): THREE.Vector3 {
    return this.controls.object.position;
  }

  isLocked(): boolean {
    return this.controls.isLocked;
  }
}
