import * as THREE from "three";

import Debug from "./Utils/Debug";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import StatsMonitor from "./Utils/StatsMonitor";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World";
import Resources from "./Utils/Resources";
import sources from "./sources";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = _canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.resources = new Resources(sources);
    this.renderer = new Renderer();
    this.world = new World();
    this.statsMonitor = new StatsMonitor();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    if (!this.camera || !this.renderer) {
      return;
    }

    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    if (!this.camera || !this.world || !this.renderer || !this.statsMonitor)
      return;

    this.camera.update();
    this.renderer.update();
    this.statsMonitor.update();
    this.world.update();
  }

  destroy() {
    if (!this.camera || !this.renderer || !this.world || !this.time) {
      return;
    }

    this.camera.destroy();
    this.renderer.destroy();
    this.time.destroy();
    this.world.destroy();

    this.instance = null;
    this.scene = null;
  }
}
