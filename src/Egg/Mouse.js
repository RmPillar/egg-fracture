import * as THREE from "three";
import gsap from "gsap";
import Experience from "./Experience";
import EventEmitter from "./Utils/EventEmitter";
import throttle from "lodash.throttle";

export default class Mouse extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;

    this.worldPosition = new THREE.Vector2();

    this.position = {
      current: new THREE.Vector3(),
      previous: new THREE.Vector3(),
    };

    this.uv = {
      current: new THREE.Vector3(),
      previous: new THREE.Vector3(),
    };

    this.raycaster = new THREE.Raycaster();

    this.intersectObjects = [];
    this.needsUpdate = false;
    this.uvNeedsUpdate = false;
    this.active = false;

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.handlePointerMove = throttle(this.handlePointerMove.bind(this), 16);
    this.handlePointerEnter = throttle(this.handlePointerEnter.bind(this), 16);
    this.handlePointerLeave = throttle(this.handlePointerLeave.bind(this), 16);

    window.addEventListener("pointermove", this.handlePointerMove);
    document.addEventListener("pointerenter", this.handlePointerEnter);
    document.addEventListener("pointerleave", this.handlePointerLeave);
  }

  handlePointerMove(event) {
    this.trigger("mouseMove");

    this.worldPosition = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  }

  handlePointerEnter(event) {
    this.active = true;
    this.trigger("mouseEnter");

    gsap.set(this.worldPosition, {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
  }

  handlePointerLeave(event) {
    this.active = false;
    this.trigger("mouseLeave");
  }

  update() {
    if (!this.camera?.instance && this.experience?.camera) {
      this.camera = this.experience.camera;
    }

    if (
      !this.raycaster ||
      !this.camera?.instance ||
      !this.time ||
      !this.worldPosition ||
      !this.scene
    )
      return;

    this.raycaster.setFromCamera(this.worldPosition, this.camera.instance);

    const intersect = this.raycaster.intersectObjects(this.intersectObjects);

    this.needsUpdate = false;

    if (intersect.length > 0) {
      this.position.current.set(
        intersect[0].point.x,
        intersect[0].point.y,
        intersect[0].point.z
      );

      this.uv.previous.copy(this.uv.current);
      this.uv.current.set(intersect[0].uv.x, intersect[0].uv.y, 0);

      if (this.position.current.distanceTo(this.position.previous) > 0.001) {
        this.needsUpdate = true;
        this.position.previous.copy(this.position.current);
      }

      if (this.uv.current.distanceTo(this.uv.previous) > 0.001) {
        this.uvNeedsUpdate = true;
      }
    }
  }

  destroy() {
    document.removeEventListener("pointermove", this.handlePointerMove);
    document.removeEventListener("mouseenter", this.handlePointerEnter);
    document.removeEventListener("mouseleave", this.handlePointerLeave);
  }
}
