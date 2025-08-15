import "./style.css";
import * as THREE from "three";

const initialize = (): void => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  document.getElementById("app")?.appendChild(renderer.domElement);

  camera.position.z = 5;

  const animate = (): void => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  const handleResize = (): void => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);
  animate();
};

initialize();
