attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vUV;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
    vUV = aUV;
}
