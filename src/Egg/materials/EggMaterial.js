import * as THREE from "three";

import Experience from "../Experience";

import vertexShader from "./shaders/egg/vertex.glsl";
import fragmentShader from "./shaders/egg/fragment.glsl";

export default function EggMaterial() {
  const experience = new Experience();
  const sizes = experience.sizes;

  console.log(sizes);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColorOne: new THREE.Uniform(new THREE.Color(0.0, 0.2, 1.0)),
      uColorTwo: new THREE.Uniform(new THREE.Color(0.5, 0.0, 0.5)),
      uColorThree: new THREE.Uniform(new THREE.Color(1.0, 0.5, 0.0)),
      uColorBase: new THREE.Uniform(new THREE.Color(0, 0, 0)),
      uResolution: new THREE.Uniform(
        new THREE.Vector2(sizes.width, sizes.height).multiplyScalar(
          sizes.pixelRatio
        )
      ),
      uTime: new THREE.Uniform(0),
      // Light Uniforms
      uLight: new THREE.Uniform(new THREE.Vector3(1.0, 1.0, -1.0)),
      uDiffuseness: new THREE.Uniform(0.01),
      uShininess: new THREE.Uniform(20.0),
      uFresnelPower: new THREE.Uniform(14),
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });

  return material;
}
