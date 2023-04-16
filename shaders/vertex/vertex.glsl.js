const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDebug;

  uniform float uTime;
  uniform vec3 uMin;
  uniform vec3 uMax;

  float PI = 3.1415926535;
  float radius = 0.5;

  float mapRange(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
  }

  void main() {
    vUv = uv;

    float x = mapRange(position.x, uMin.x, uMax.x, -PI, PI);
    vDebug = x;

    vec3 dir = vec3(sin(x), cos(x), 0.);

    vec3 pos = radius * dir + vec3(0., 0., position.z) + dir * position.y;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1. );
    gl_PointSize = 10. * ( 1. / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export default vertexShader;
