import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { VINTAGE_COLORS, GAME_CONFIG } from "./constants";

export class GameScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: PointerLockControls;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();
    this.controls = this.createControls();
    this.setupEventListeners();
  }

  private createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  private createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(VINTAGE_COLORS.WHEAT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const app = document.querySelector("#app");
    if (app) {
      app.appendChild(renderer.domElement);
    } else {
      document.body.appendChild(renderer.domElement);
    }

    console.log("🖥️ Renderer created and canvas attached");
    return renderer;
  }

  private createControls(): PointerLockControls {
    const controls = new PointerLockControls(
      this.camera,
      this.renderer.domElement
    );
    this.scene.add(controls.object);
    return controls;
  }

  private setupEventListeners(): void {
    window.addEventListener("resize", this.handleResize.bind(this));
    document.addEventListener("click", this.handleClick.bind(this));
  }

  private handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private handleClick(): void {
    if (!this.controls.isLocked) {
      this.controls.lock();
    }
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getControls(): PointerLockControls {
    return this.controls;
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
