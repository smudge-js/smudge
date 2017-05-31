declare var require: any;

//4x4 matrix function from matrix library
import {mat4} from 'gl-matrix';



// adapted from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
// adapted from http://learningwebgl.com/blog/?p=28
helloGL();



function helloGL(): void {

    // setup context
    let canvas: HTMLCanvasElement = document.getElementById("gl-canvas") as HTMLCanvasElement;
    let gl: WebGLRenderingContext = initWebGL(canvas);  //creates a WebGL context
    if (!gl) {
        console.error("GL could not be initialized.");
        return;
    }

    // clear background
    gl.clearColor(0.0, 0.7, 0.0, 1.0);  //when we clear...
    gl.enable(gl.DEPTH_TEST);  //use the depth buffer and test things against it //how far from the camera --> greyscale image (not linear, more density up front)
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //bitwise or -- optimized :)


    // build shaders

    var basicVertexShader = require("./glsl/basic_vertex.glsl"); //projects 3d positions into screen space
    var basicFragmentShader = require("./glsl/basic_fragment.glsl");  //strings

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, basicVertexShader);
    gl.compileShader(vertexShader);

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, basicFragmentShader);
    gl.compileShader(fragmentShader);

    console.log("vertexShader", gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));
    console.log("fragmentShader", gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    //     alert("Could not initialise shaders");
    // }
    console.log("shaderProgram", gl.getProgramParameter(shaderProgram, gl.LINK_STATUS));

    gl.useProgram(shaderProgram);
    let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    // tell webgl we will provide aVertexPosition via an array
    gl.enableVertexAttribArray(vertexPositionAttribute);


    // init vertex buffer
    let squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer); //start working with

    var vertices = [
        2.0, 2.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
        -1.5, 0.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);







    console.log(canvas.width);

    gl.viewport(0, 0, canvas.width, canvas.height);

    // set up Projection Matrix
    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
    console.log("pMatrix", pMatrix);

    // set up ModelView Matrix
    var mvMatrix = mat4.create();
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -7.0]);
    console.log("mvMatrix", mvMatrix);

    // draw
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    //let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    let pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    let mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);

    gl.drawArrays(gl.LINE_STRIP, 0, 5);

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
