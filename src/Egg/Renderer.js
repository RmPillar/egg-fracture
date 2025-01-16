import * as THREE from "three";
import {
  SelectiveBloomEffect,
  GodRaysEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";

import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;

    this.setRenderer();
    this.setComposer();
    this.setBloom();
  }

  setRenderer() {
    if (!this.canvas || !this.sizes) {
      return;
    }

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    this.instance.setClearColor(0x000000);
  }

  setComposer() {
    if (!this.instance || !this.scene || !this.camera?.instance) return;

    this.composer = new EffectComposer(this.instance);
    this.composer.addPass(new RenderPass(this.scene, this.camera.instance));
  }

  setBloom() {
    if (!this.scene || !this.camera?.instance || !this.composer) return;

    this.bloomParams = {
      mipmapBlur: true,
      intensity: 3.0,
    };

    this.bloomEffect = new SelectiveBloomEffect(
      this.scene,
      this.camera.instance,
      this.bloomParams
    );

    this.bloomEffect.luminancePass.enabled = true;

    this.bloomPass = new EffectPass(this.camera.instance, this.bloomEffect);
    this.composer.addPass(this.bloomPass);
  }

  addBloomObject(object) {
    if (!this.bloomEffect) return;

    this.bloomEffect.selection.add(object);
  }

  resize() {
    if (!this.instance || !this.sizes) {
      return;
    }

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    this.composerUpdate();
  }

  composerUpdate() {
    if (!this.composer) {
      return;
    }

    this.composer.render();
  }

  destroy() {
    if (!this.instance || !this.renderTarget || !this.composer) {
      return;
    }

    this.instance.dispose();
    this.renderTarget.dispose();
    this.composer.dispose();

    this.instance = null;
    this.renderTarget = null;
    this.composer = null;
  }
}
