const vertexShader = /* glsl */ `
    vec3 pos = transformed;

    // Angle to rotate
    float tetha = xx + uTime * 0.5;

    // Makes a circle
    vec3 dir = vec3(sin(tetha), cos(tetha), 0.);

    pos = 0.2 * dir + vec3(0., 0., position.z) + dir * position.y;

    // transformed = pos;
`;

export default vertexShader;
