precision mediump float;

uniform vec4 uColor;
// uniform vec4 uColorBias;
uniform vec4 uSourceColorBias;

uniform sampler2D uSourceSampler;
uniform mat4 uSourceColorMatrix;

varying vec2 vSourceUV;

void main(void) {
    vec4 sourceColor = texture2D(uSourceSampler, vec2( vSourceUV.s, vSourceUV.t));

    sourceColor = (uSourceColorMatrix * sourceColor) + uSourceColorBias;
    vec4 outColor = (sourceColor * uColor);// + uColorBias;

    gl_FragColor = outColor;
}



// sourceColorMatrix * sourceSample(sourceUV • sourceUVMatrix) + sourceColorBias
// *
// paperColorMatrix * paperSample(paperUV• paperUVMatrix) + paperColorBias
// *
// color
// +
// colorBias
