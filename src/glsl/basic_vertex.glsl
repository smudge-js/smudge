attribute vec3 aPosition;
// attribute vec2 aUV; 

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
}
