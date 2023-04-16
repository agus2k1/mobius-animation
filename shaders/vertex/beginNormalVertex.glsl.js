const vertexShader = /* glsl */ `
    vec3 temp = objectNormal;

    // Color
    float xx = mapRange(position.x, uMin.x, uMax.x, -1., 1.);

    // Angle to rotate + cut position
    float theta = (xx + uTime * 0.1 + uOffset * 0.5) * 2. * PI ;

    vDiscard = mod(xx + uTime * 0.1 + mix(0.25, -0.25, uOffset) + uOffset * 0.5, 2.);

    temp = rotate(temp, vec3(0., 0., 1.), theta + uTime * 0.1);

    objectNormal = temp;
`;

export default vertexShader;
