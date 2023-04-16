const vertexShader = /* glsl */ `
    vec3 temp = objectNormal;

    // Color
    float xx = mapRange(position.x, uMin.x, uMax.x, -PI, PI);

    temp = rotate(temp, vec3(0., 0., 1.), xx + uTime);

    objectNormal = temp;
`;

export default vertexShader;
