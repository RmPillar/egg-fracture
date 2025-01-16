import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Experience from "./Experience";
import gsap from "gsap";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.renderer = this.experience.renderer;
    this.mouse = this.experience.mouse;

    this.setInstance();
  }

  getInstance() {
    return this.instance;
  }

  setInstance() {
    if (!this.scene || !this.sizes) {
      return;
    }

    this.instance = new THREE.PerspectiveCamera(
      70,
      this.sizes.width / this.sizes.height,
      0.01,
      10
    );
    this.instance.position.set(Math.sin(0) * 1, 0.75, Math.cos(0) * 1);

    this.cameraGroup = new THREE.Group();
    this.cameraGroup.add(this.instance);

    this.scene.add(this.cameraGroup);

    this.cameraXTween = gsap.quickTo(this.cameraGroup.position, "x", {
      duration: 0.5,
    });
    this.cameraYTween = gsap.quickTo(this.cameraGroup.position, "y", {
      duration: 0.5,
    });
  }

  getVisibleHeightAtZDepth(depth) {
    const vFOV = (this.camera.instance.fov * Math.PI) / 180;

    return 2 * Math.abs(depth) * Math.tan(vFOV / 2);
  }

  getVisibleWidthAtZDepth(depth) {
    const height = this.getVisibleHeightAtZDepth(depth, this.camera.instance);
    return height * this.camera.instance.aspect;
  }

  getViewportDimensionsAtZDepth(depth) {
    return {
      height: this.getVisibleHeightAtZDepth(depth),
      width: this.getVisibleWidthAtZDepth(depth),
    };
  }

  normalisePosition(position) {
    let normalizedX, normalizedY;

    if (this.sizes.aspectRatio > 1) {
      // Wider screen - normalize X movement
      normalizedX = position.x / this.sizes.aspectRatio;
      normalizedY = position.y;
    } else {
      // Taller screen - normalize Y movement
      normalizedX = position.x;
      normalizedY = position.y * this.sizes.aspectRatio;
    }

    return {
      x: normalizedX,
      y: normalizedY,
    };
  }

  resize() {
    if (!this.sizes || !this.instance) {
      return;
    }

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (!this.cameraGroup || !this.mouse) return;

    const { x, y } = this.normalisePosition(this.mouse.worldPosition);

    this.cameraXTween(x / 10);
    this.cameraYTween(y / 15);

    this.instance.lookAt(0, 0, 0);
  }

  destroy() {
    this.scene.remove(this.instance);

    this.instance = null;
  }
}
