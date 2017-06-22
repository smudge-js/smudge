// precision mediump float;

uniform mediump vec4 uColor;

uniform sampler2D uColorSampler;
uniform mediump mat4 uColorMatrix;

varying mediump vec2 vUV;

void main(void) {
    gl_FragColor = uColorMatrix * texture2D(uColorSampler, vec2( vUV.s, vUV.t)) * uColor;
}
