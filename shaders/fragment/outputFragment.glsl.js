const fragmentShader = /* glsl */ `
        float dontShow = step(1., vDiscard);
        if (dontShow > 0.5) discard;
        // gl_FragColor = vec4( 1., 0., 0., 1.);
`;

export default fragmentShader;
