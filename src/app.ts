declare var require: any;

//4x4 matrix function from matrix library
import {mat4} from 'gl-matrix';



// adapted from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
// adapted from http://learningwebgl.com/blog/?p=28
helloGL();





function helloGL(): void {
    ///////////////////////////////////////////////////////////////
    // GENERAL SETUP

    // get context
    let canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
    let gl = initWebGL(canvas);
    
    // configure context
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.DEPTH_TEST);
    
    // create projection matrix
    let pMatrix = mat4.create();
    mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
    
    // create model view matrix
    let mvMatrix = mat4.create();
    mat4.identity(mvMatrix);

    // build shader program
    let vertSource = require("./glsl/basic_vertex.glsl");
    let fragSource = require("./glsl/basic_fragment.glsl");
    let shaderProgram: WebGLProgram = buildGLProgram(gl, vertSource, fragSource);

    // configure shader program
    gl.useProgram(shaderProgram);
    let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    let pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    let mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    // build geo
    let unitSquare = buildUnitSquare(gl);



    ///////////////////////////////////////////////////////////////
    // DRAW FRAME

    // clear background
    gl.clearColor(0.0, 0.7, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT); 

    // set camera/cursor position
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);
    
    // draw square
    gl.useProgram(shaderProgram);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, unitSquare);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

}





function initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    console.log("gl", !!gl);
    return gl;
}

function buildGLProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram {
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    console.log("vertexShader", gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    console.log("fragmentShader", gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    console.log("shaderProgram", gl.getProgramParameter(shaderProgram, gl.LINK_STATUS));

    return shaderProgram;
}


function buildUnitSquare(gl: WebGLRenderingContext): WebGLBuffer {

    var vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
    ];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return buffer;
}
