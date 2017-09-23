attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform mat3 uSourceUVMatrix;

varying vec2 vSourceUV;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
    vSourceUV = vec2(uSourceUVMatrix * vec3(aUV, 1.0)); //need to cast vec2 to vec3 to multiply with mat3
}
