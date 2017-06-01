declare var require: any;
import { mat4 } from 'gl-matrix';



export class PBR {

    private gl: WebGLRenderingContext;
    private mvMatrix: mat4;
    private pMatrix: mat4;
    private vertexPositionAttribute: GLint;
    private pMatrixUniform: WebGLUniformLocation;
    private mvMatrixUniform: WebGLUniformLocation;
    private shaderProgram: WebGLProgram;
    private unitSquare: WebGLBuffer;

    constructor(canvas?: HTMLCanvasElement) {
        ///////////////////////////////////////////////////////////////
        // GENERAL SETUP

        // get context
        canvas = canvas || document.getElementById("gl-canvas") as HTMLCanvasElement;
        this.gl = initWebGL(canvas);

        // configure context
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.disable(this.gl.DEPTH_TEST);

        // create projection matrix
        this.pMatrix = mat4.create();
        mat4.ortho(this.pMatrix, 0, canvas.width, 0, canvas.height, -1, 1);
        // mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

        // create model view matrix
        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);

        // build shader program
        let vertSource = require("../glsl/basic_vertex.glsl");
        let fragSource = require("../glsl/basic_fragment.glsl");
        this.shaderProgram = buildGLProgram(this.gl, vertSource, fragSource);

        // configure shader program
        this.gl.useProgram(this.shaderProgram);
        this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
        this.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

         
        // build geo
        this.unitSquare = buildUnitSquare(this.gl);

        // clear
        this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        
    }



    rect(x: number, y: number, w: number, h: number): void {
        console.log("rect");
        
        // set camera/cursor position
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, this.mvMatrix, [x, y, 0.0]);

        // draw square
        this.gl.useProgram(this.shaderProgram);
        this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.uniformMatrix4fv(this.pMatrixUniform, false, this.pMatrix);
        this.gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.unitSquare);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

}








// function main(): void {




//     ///////////////////////////////////////////////////////////////
//     // DRAW FRAME

//     // clear background
//     gl.clearColor(0.5, 0.5, 0.5, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT);

//     // set camera/cursor position
//     mat4.identity(this.mvMatrix);
//     mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 0.0, 0.0]);

//     // draw square
//     gl.useProgram(shaderProgram);
//     gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
//     gl.uniformMatrix4fv(this.pMatrixUniform, false, pMatrix);
//     gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);

//     gl.bindBuffer(gl.ARRAY_BUFFER, unitSquare);
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

// }







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

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    console.log("shaderProgram", gl.getProgramParameter(shaderProgram, gl.LINK_STATUS));

    return shaderProgram;
}



function buildUnitSquare(gl: WebGLRenderingContext): WebGLBuffer {

    // rect(0, 0, 1, 1);
    var vertices = [
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
    ];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return buffer;
}