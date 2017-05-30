declare var require: any;
// declare module 'gl-matrix';
import {mat4} from 'gl-matrix';



var gl;
function initGL(canvas) {
    try {
        console.log("try", canvas);
        gl = canvas.getContext('webgl');
        console.log("gl", gl);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}
// function getShader(gl, id) {
//     var shaderScript = document.getElementById(id);
//     if (!shaderScript) {
//         return null;
//     }
//     var str = "";
//     var k = shaderScript.firstChild;
//     while (k) {
//         if (k.nodeType == 3) {
//             str += k.textContent;
//         }
//         k = k.nextSibling;
//     }
//     var shader;
//     if (shaderScript.type == "x-shader/x-fragment") {
//         shader = gl.createShader(gl.FRAGMENT_SHADER);
//     } else if (shaderScript.type == "x-shader/x-vertex") {
//         shader = gl.createShader(gl.VERTEX_SHADER);
//     } else {
//         return null;
//     }
//     gl.shaderSource(shader, str);
//     gl.compileShader(shader);
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         alert(gl.getShaderInfoLog(shader));
//         return null;
//     }
//     return shader;
// }
var shaderProgram;
function initShaders() {
    // var fragmentShader = getShader(gl, "shader-fs");
    // var vertexShader = getShader(gl, "shader-vs");
    var vertexShaderSource = require("./glsl/basic_vertex.glsl");
    var fragmentShaderSource = require("./glsl/basic_fragment.glsl");


    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);



    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}
var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;
function initBuffers() {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
        0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
}
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}
function webGLStart() {
    var canvas = document.getElementById("gl-canvas");
    initGL(canvas);
    initShaders();
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    drawScene();
}

setTimeout(webGLStart, 1000);


//
//
// // adapted from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
// // adapted from http://learningwebgl.com/blog/?p=28
// helloGL();
//
//
//
// function helloGL(): void {
//
//     // setup context
//     let canvas: HTMLCanvasElement = document.getElementById("gl-canvas") as HTMLCanvasElement;
//     let gl: WebGLRenderingContext = initWebGL(canvas);
//     if (!gl) {
//         console.error("GL could not be initialized.");
//         return;
//     }
//
//     // clear background
//     gl.clearColor(0.7, 0.0, 0.0, 1.0);
//     gl.enable(gl.DEPTH_TEST);
//     gl.depthFunc(gl.LEQUAL);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//
//
//     // build shaders
//
//     var basicVertexShader = require("./glsl/basic_vertex.glsl");
//     var basicFragmentShader = require("./glsl/basic_fragment.glsl");
//
//     let vertexShader = gl.createShader(gl.VERTEX_SHADER);
//     gl.shaderSource(vertexShader, basicVertexShader);
//     gl.compileShader(vertexShader);
//
//     let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(fragmentShader, basicFragmentShader);
//     gl.compileShader(fragmentShader);
//
//     console.log("vertexShader", gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));
//     console.log("fragmentShader", gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));
//
//     var shaderProgram = gl.createProgram();
//     gl.attachShader(shaderProgram, vertexShader);
//     gl.attachShader(shaderProgram, fragmentShader);
//     gl.linkProgram(shaderProgram);
//
//     // if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
//     //     alert("Could not initialise shaders");
//     // }
//     console.log("shaderProgram", gl.getProgramParameter(shaderProgram, gl.LINK_STATUS));
//
//     gl.useProgram(shaderProgram);
//
//
//
//     // init vertex buffer
//     let squareVerticesBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
//
//     var vertices = [
//         1.0, 1.0, 0.0,
//         -1.0, 1.0, 0.0,
//         1.0, -1.0, 0.0,
//         -1.0, -1.0, 0.0
//     ];
//
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//
//
//
//
//
//
//
//     console.log(canvas.width);
//
//     gl.viewport(0, 0, canvas.width, canvas.height);
//
//     // set up Projection Matrix
//     var pMatrix = mat4.create();
//     mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
//     console.log("pMatrix", pMatrix);
//
//     // set up ModelView Matrix
//     var mvMatrix = mat4.create();
//     mat4.identity(mvMatrix);
//     mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);
//     console.log("mvMatrix", mvMatrix);
//
//     // draw
//     gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
//
//     let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
//     gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
//
//     let pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
//     let mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
//     gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
//     gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);
//
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//
// }
//
//
//
//
//
//
// function initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
//     let gl: WebGLRenderingContext = null;
//
//     // Try to grab the standard context. If it fails, fallback to experimental.
//     gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
//
//     // If we don't have a GL context, give up now
//     if (!gl) {
//         alert('Unable to initialize WebGL. Your browser may not support it.');
//     }
//
//     return gl;
// }
//
// // https://www.npmjs.com/package/webpack-glsl-loader
