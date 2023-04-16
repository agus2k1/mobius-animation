const vertexShader = /* glsl */ `
    vec3 pos = transformed;

    // Makes a circle
    vec3 dir = vec3(sin(theta), cos(theta), 0.);

    pos = 0.2 * dir + vec3(0., 0., position.z) + dir * position.y;

    transformed = pos;
`;

export default vertexShader;
