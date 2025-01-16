import * as THREE from "three";
import gsap from "gsap";

import Experience from "./Experience";

export default class Canvas {
  constructor() {
    this.experience = new Experience();
    this.mouse = this.experience.mouse;
    this.resources = this.experience.resources;

    this.init();
  }

  init() {
    this.resources.on("ready", () => {
      this.addCanvas();
    });
  }

  addCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 128;
    this.canvas.height = 128;

    gsap.set(this.canvas, {
      position: "fixed",
      width: 256,
      height: 256,
      top: 0,
      left: 0,
      zIndex: 10,
    });

    document.body.append(this.canvas);

    this.context = this.canvas.getContext("2d");
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.glowImage = this.resources.items?.glow?.image;

    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  update() {
    if (!this.canvas || !this.context || !this.mouse || !this.glowImage) return;

    this.context.globalCompositeOperation = "source-over";
    this.context.globalAlpha = 0.05;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const cursor = {
      current: new THREE.Vector3(
        this.mouse.uv.current.x * this.canvas.width,
        this.mouse.uv.current.y * this.canvas.height,
        0
      ),
      previous: new THREE.Vector3(
        this.mouse.uv.previous.x * this.canvas.width,
        this.mouse.uv.previous.y * this.canvas.height,
        0
      ),
    };

    const cursorDistance = cursor.previous.distanceTo(cursor.current);

    const alpha = Math.min(cursorDistance * 0.1, 1);

    const glowSize = this.canvas.width * 0.1;
    this.context.globalCompositeOperation = "lighten";
    this.context.globalAlpha = alpha;

    this.context.drawImage(
      this.glowImage,
      cursor.current.x - glowSize * 0.5,
      cursor.current.y - glowSize * 0.5,
      glowSize,
      glowSize
    );

    // Texture
    this.texture.needsUpdate = true;
  }

  destroy() {
    // Remove canvas from the document if it was added
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    // Clear canvas context
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Dispose of Three.js texture
    if (this.texture) {
      this.texture.dispose();
    }

    // Clear image references
    if (this.glowImage) {
      this.glowImage.src = "";
      this.glowImage = null;
    }
  }
}
