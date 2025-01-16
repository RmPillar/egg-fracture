varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Model Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

  gl_Position = projectedPosition;


  // Varyings
  vUv = uv;
  vNormal = modelNormal.xyz;
  vPosition = modelPosition.xyz;
}