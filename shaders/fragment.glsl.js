const fragmentShader = /* glsl */ `
    varying vec2 vUv;
    varying float vDebug;

    void main() {
        // gl_FragColor = vec4( vDebug, 0., 0., 1.);
        gl_FragColor = vec4( vUv, 0., 1.);
    }
`;

export default fragmentShader;
