import Stats from "stats-gl";

import Experience from "../Experience";

export default class StatsMonitor {
  constructor() {
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    if (!this.renderer?.composer?.renderer) return;

    this.stats = new Stats({
      trackGPU: true,
      trackHz: true,
      trackCPT: true,
    });

    console.log(this.renderer);

    document.body.appendChild(this.stats.dom);

    this.stats.init(this.renderer.composer.renderer);
  }

  update() {
    if (!this.stats) return;

    this.stats.update();
  }
}
