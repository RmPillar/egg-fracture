import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/src/ScrollTrigger";

import Experience from "./Experience";

import EggMaterial from "./materials/EggMaterial";

gsap.registerPlugin(ScrollTrigger);

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;
    this.time = this.experience.time;

    this.animationProgress = 0;

    this.resources.on("ready", () => {
      this.addEgg();
      this.addLighting();
      this.addAnimation();
      this.addDebug();
    });
  }

  addEgg() {
    this.egg = this.resources.items.egg.scene;
    this.eggFragments = [];
    this.eggGroup = new THREE.Group();

    this.eggMaterial = new EggMaterial();

    this.egg.children.forEach((child) => {
      const geometry = child.geometry;
      const mesh = new THREE.Mesh(geometry, this.eggMaterial);
      mesh.position.set(
        child.position.x * 0.333,
        child.position.y * 0.333 - 0.05,
        child.position.z * 0.333
      );
      mesh.scale.set(0.333, 0.333, 0.333);
      this.eggGroup.add(mesh);

      this.eggFragments.push({
        mesh,
        basePosition: new THREE.Vector3(
          mesh.position.x,
          mesh.position.y,
          mesh.position.z
        ),
        random: Math.random() - 0.5,
      });

      this.renderer.addBloomObject(mesh);
    });

    this.scene.add(this.eggGroup);

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      })
    );

    this.scene.add(this.cube);

    this.renderer.addBloomObject(this.cube);
  }

  addLighting() {
    this.directionalLight = new THREE.DirectionalLight(0xffedd5, 15);
    this.directionalLight.position.set(1, 3, 1);
    this.scene.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);
  }

  addAnimation() {
    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".scrollContainer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: ({ progress }) => {
          this.animationProgress = progress;
        },
      },
    });

    const fullCircle = Math.PI * 2;

    const cameraParams = {
      angle: 0,
      radius: 1,
    };

    this.camera.instance.lookAt(new THREE.Vector3(0, 0, 0));

    this.timeline
      .to(
        cameraParams,
        {
          angle: fullCircle,
          radius: 0.5,
          onUpdate: () => {
            this.camera.instance.position.x =
              Math.sin(cameraParams.angle) * cameraParams.radius;
            this.camera.instance.position.z =
              Math.cos(cameraParams.angle) * cameraParams.radius;

            this.camera.instance.lookAt(new THREE.Vector3(0, 0, 0));
          },
        },
        0
      )
      .to(
        this.camera.instance.position,
        {
          y: 0,
        },
        0
      );

    this.eggFragments.forEach((mesh) => {
      // this.timeline
      //   .to(
      //     mesh.position,
      //     {
      //       x: mesh.position.x * (3 + (Math.random() - 0.5) * 3),
      //       y: mesh.position.y * (3 + (Math.random() - 0.5) * 3) - 0.05,
      //       z: mesh.position.z * (3 + (Math.random() - 0.5) * 3),
      //     },
      //     Math.random() * 0.01
      //   )
      //   .to(
      //     mesh.rotation,
      //     {
      //       x: -Math.PI * (Math.random() - 0.5),
      //       y: -Math.PI * (Math.random() - 0.5),
      //       z: -Math.PI * (Math.random() - 0.5),
      //     },
      //     Math.random() * 0.01
      //   )
      //   .to(
      //     mesh.scale,
      //     {
      //       x: 0,
      //       y: 0,
      //       z: 0,
      //     },
      //     Math.random() * 0.01
      //   );
    });
  }

  addDebug() {
    this.debug = this.experience.debug;

    const colourFolder = this.debug.gui.addFolder({
      title: "Color",
    });

    colourFolder.addBinding(this.eggMaterial.uniforms.uColorOne, "value", {
      label: "Colour One",
      color: { type: "float" },
    });

    colourFolder.addBinding(this.eggMaterial.uniforms.uColorTwo, "value", {
      label: "Colour Two",
      color: { type: "float" },
    });

    colourFolder.addBinding(this.eggMaterial.uniforms.uColorThree, "value", {
      label: "Colour Three",
      color: { type: "float" },
    });

    colourFolder.addBinding(this.eggMaterial.uniforms.uColorBase, "value", {
      label: "Colour Base",
      color: { type: "float" },
    });
  }

  update() {
    if (!this.eggFragments) {
      return;
    }

    this.eggFragments.forEach(({ mesh, basePosition, random }) => {
      const time = this.time.elapsed / 1000;
      mesh.material.uniforms.uTime.value = time;

      const xPositionOscillate =
        Math.sin(time * 0.5 * (random + 0.5)) *
        basePosition.x *
        0.03 *
        (random + 0.5);
      const yPositionOscillate =
        Math.sin(time * 0.5 * (random + 0.5)) *
        basePosition.y *
        0.03 *
        (random + 0.5);
      const zPositionOscillate =
        Math.sin(time * 0.5 * (random + 0.5)) *
        basePosition.z *
        0.03 *
        (random + 0.5);

      const rotationOscillate =
        -Math.PI * Math.sin(time * 0.5 * random) * 0.025 * random;

      const xPosition =
        basePosition.x +
        basePosition.x * (3 + random * 3) * this.animationProgress;
      const yPosition =
        basePosition.y +
        basePosition.y * (3 + random * 3 - 0.05) * this.animationProgress;
      const zPosition =
        basePosition.z +
        basePosition.z * (3 + random * 3) * this.animationProgress;

      const xRotation = -Math.PI * random * this.animationProgress;
      const yRotation = -Math.PI * random * this.animationProgress;
      const zRotation = -Math.PI * random * this.animationProgress;

      const xScale = (1 - this.animationProgress) * 0.333;
      const yScale = (1 - this.animationProgress) * 0.333;
      const zScale = (1 - this.animationProgress) * 0.333;

      mesh.position.set(
        xPosition + xPositionOscillate,
        yPosition + yPositionOscillate,
        zPosition + zPositionOscillate
      );
      mesh.rotation.set(xRotation, yRotation, zRotation);

      mesh.scale.set(xScale, yScale, zScale);
    });
  }

  destroy() {
    // Clean up GSAP timeline
    if (this.timeline) {
      this.timeline.kill();
    }

    // Clean up egg fragments
    if (this.eggFragments) {
      this.eggFragments.forEach((mesh) => {
        // Remove from bloom objects
        this.renderer.removeBloomObject?.(mesh);

        // Dispose of geometries and materials
        mesh.geometry.dispose();
        mesh.material.dispose();

        // Remove from scene
        mesh.removeFromParent();
      });
      this.eggFragments = null;
    }

    // Clean up egg group
    if (this.eggGroup) {
      this.eggGroup.removeFromParent();
      this.eggGroup = null;
    }

    // Clean up egg material
    if (this.eggMaterial) {
      this.eggMaterial.dispose();
      this.eggMaterial = null;
    }

    // Clean up cube
    if (this.cube) {
      this.cube.geometry.dispose();
      this.cube.material.dispose();
      this.cube.removeFromParent();
      this.cube = null;
    }

    // Clean up lights
    if (this.directionalLight) {
      this.directionalLight.removeFromParent();
      this.directionalLight = null;
    }

    if (this.ambientLight) {
      this.ambientLight.removeFromParent();
      this.ambientLight = null;
    }

    // Remove references
    this.experience = null;
    this.scene = null;
    this.resources = null;
    this.camera = null;
    this.renderer = null;
    this.time = null;
  }
}
