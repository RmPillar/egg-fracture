#include ../includes/specular.glsl;
#include ../includes/fresnel.glsl;
#include ../includes/generative/pnoise.glsl;

uniform vec3 uColorOne;
uniform vec3 uColorTwo;
uniform vec3 uColorThree;
uniform vec3 uColorBase;
uniform vec2 uResolution;
uniform float uTime;

// Light Uniforms
uniform vec3 uLight;
uniform float uShininess;
uniform float uDiffuseness;
uniform float uFresnelPower;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main () {
  float pixelSize = 150.0; // Adjust for larger/smaller pixels
  vec3 pixelatedUV = floor(vPosition * pixelSize) / pixelSize;

  vec3 normal = normalize(vNormal);
  vec3 viewDirection = (normalize(vPosition - cameraPosition));

  // Starting color
  vec3 color = vec3(0.0);

  // Specular
  float specularLight = specular(normal, viewDirection, uLight, uShininess, uDiffuseness);
  color += specularLight;

  // Fresnel
  float f = fresnel(viewDirection, normal, uFresnelPower);
  color.rgb += f * vec3(1.0);

     // Generate noise
    float scale = 6.0; // Adjust this to change noise scale
    float speed = 0.2; // Adjust this to change noise animation speed
    
    // Use position for 3D noise
    vec3 noiseCoord = pixelatedUV * scale + uTime * speed;
    float noise = pnoise(noiseCoord, vec3(10.0)); // Second parameter is for periodicity
    
    float t0 = smoothstep(0.0, 0.2, noise);
    float t1 = smoothstep(0.2, 0.4, noise);
    float t2 = smoothstep(0.4, 0.8, noise);
    float t3 = smoothstep(0.8, 1.0, noise);
    
    // Mix noise with existing color
    float noiseMix = 0.3; 
    color += (uColorBase * (1.0 - t0) + 
             uColorOne * (t0 - t1) +        
             uColorTwo * (t1 - t2) +        
             uColorThree * (t2 - t3)) * 3.0;

  gl_FragColor = vec4(color, 1.0);

}