declare var require: any;
// declare module 'gl-matrix';
import * as glMatrix from 'gl-matrix';

console.log('test', glMatrix);

// adapted from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
helloGL();



function helloGL(): void {

    // setup context
    let canvas: HTMLCanvasElement = document.getElementById("gl-canvas") as HTMLCanvasElement;
    let gl: WebGLRenderingContext = initWebGL(canvas);
    if (!gl) {
        console.error("GL could not be initialized.");
        return;
    }

    // clear background
    gl.clearColor(0.5, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // build shaders

    var basicVertexShader = require("./glsl/basic_vertex.glsl");
    var basicFragmentShader = require("./glsl/basic_fragment.glsl");
    console.log(basicVertexShader);
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, basicVertexShader);
    gl.compileShader(vertexShader);

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, basicFragmentShader);
    gl.compileShader(fragmentShader);

    console.log("vertexShader", gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));
    console.log("fragmentShader", gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));

    // init vertex buffer
    let squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    var vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);



    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);


    var mvMatrix = glMatrix.mat4.create();
    var pMatrix = glMatrix.mat4.create();

    console.log("test2", mvMatrix);

    gl.viewport(0, 0, canvas.width, canvas.height);

    // gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    // setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}





function initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl: WebGLRenderingContext = null;

    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a GL context, give up now
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
    }

    return gl;
}

// https://www.npmjs.com/package/webpack-glsl-loader
