declare var require: any;
import { mat4, vec3 } from 'gl-matrix';

export default class PBR {

    private gl: WebGLRenderingContext;
    private mvMatrix: mat4;
    private pMatrix: mat4;
    // private vertexPositionAttribute: GLint;
    // private pMatrixUniform: WebGLUniformLocation;
    // private mvMatrixUniform: WebGLUniformLocation;
    // private colorUniform: WebGLUniformLocation;

    private colorProgram: Program;
    //private shaderProgram: WebGLProgram;
    //private textureShaderProgram: WebGLProgram;

    private unitSquare: WebGLBuffer;
    private unitSquareUVs: WebGLBuffer;

    private colorBuffer: Framebuffer;

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
        const vertSource = require("../glsl/basic_vertex.glsl");
        const fragSource = require("../glsl/basic_fragment.glsl");
        this.colorProgram = new Program(this.gl, vertSource, fragSource);
        // this.shaderProgram = buildGLProgram(this.gl, vertSource, fragSource);

        // configure shader program
        // this.gl.useProgram(this.shaderProgram);
        // this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        // this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
        // this.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        // this.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        // this.colorUniform = this.gl.getUniformLocation(this.shaderProgram, "uColor");

        // // build texture shader program
        // const textureVertSource = require("../glsl/texture_vertex.glsl");
        // const textureFragSource = require("../glsl/texture_fragment.glsl");
        // this.textureShaderProgram = buildGLProgram(this.gl, textureVertSource, textureFragSource);
        //
        // // configure texture shader program
        // this.gl.useProgram(this.textureShaderProgram);
        // this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        // this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
        // this.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        // this.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");



        // build geo
        this.unitSquare = buildUnitSquare(this.gl);
        this.unitSquareUVs = buildUnitSquareUVs(this.gl);
        // create color buffer
        this.colorBuffer = new Framebuffer(this.gl, 512, 512);

        // clear

        // this.colorBuffer.bind();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);


    }



    rect(x: number, y: number, w: number, h: number, color?: number[]): void {
        console.log(`rect(${x}, ${y}, ${w}, ${h}, ${color})`);

        color = color || [1.0, 1.0, 1.0, 1.0];

        // set camera/cursor position
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, this.mvMatrix, [x, y, 0.0]);
        mat4.scale(this.mvMatrix, this.mvMatrix, [w, h]);

        // config shader
        //this.gl.useProgram(this.shaderProgram);
        this.colorProgram.use();
        this.colorProgram.setAttributeValue("aVertexPosition", this.unitSquare, 3, this.gl.FLOAT, false, 0, 0);
        this.colorProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.colorProgram.setUniformMatrix("uMVMatrix", this.mvMatrix);
        this.colorProgram.setUniformFloats("uColor", color);

        // let uPMatrix = this.gl.getUniformLocation(this.colorProgram.program, "uPMatrix");
        // let uMVMatrix = this.gl.getUniformLocation(this.colorProgram.program, "uMVMatrix");
        // let uColor = this.gl.getUniformLocation(this.colorProgram.program, "uColor");

        // this.gl.uniformMatrix4fv(uPMatrix, false, this.pMatrix);
        // this.gl.uniformMatrix4fv(uMVMatrix, false, this.mvMatrix);
        // this.gl.uniform4fv(uColor, color);

        // set buffer
        // this.colorBuffer.bind();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    show(): void {
        // let color = [1.0, 0.0, 0.0, 1.0];
        //
        // // position rect
        // mat4.identity(this.mvMatrix);
        // mat4.scale(this.mvMatrix, this.mvMatrix, [512, 512]);
        //
        // // config shader
        // this.gl.useProgram(this.shaderProgram);
        // this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        // this.gl.uniformMatrix4fv(this.pMatrixUniform, false, this.pMatrix);
        // this.gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);
        // this.gl.uniform4fv(this.colorUniform, color);
        //
        // // set buffer
        // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        //
        // // draw rect
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.unitSquare);
        // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    }

}

class Program {
    public program: WebGLProgram;

    constructor(readonly gl: WebGLRenderingContext, readonly vertSource: string, readonly fragSource: string) {
        this.program = buildGLProgram(this.gl, vertSource, fragSource);
    }

    use(): void {
        this.gl.useProgram(this.program);
    }

    setAttributeValue(attribute: string, buffer: WebGLBuffer, size: GLint, type: GLint, normalized: GLboolean, stride: GLsizei, offset: GLintptr) {
        let loc = this.gl.getAttribLocation(this.program, attribute);
        if (loc == -1) {
            console.error(`Shader program attribute not found: ${attribute}`);
            return false;
        }

        this.gl.enableVertexAttribArray(loc);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(loc, size, type, normalized, stride, offset);
    }

    setUniformFloats(uniform: string, value: Float32Array | number[]) {
        let location = this.gl.getUniformLocation(this.program, uniform);
        if (value.length === 1) {
            this.gl.uniform1fv(location, value);
        }
        else if (value.length === 2) {
            this.gl.uniform2fv(location, value);
        }
        else if (value.length === 3) {
            this.gl.uniform3fv(location, value);
        }
        else if (value.length === 4) {
            this.gl.uniform4fv(location, value);
        } else {
            console.error(`Invalid value length for setUniformFloats: ${value.length}`);
        }
    }

    setUniformMatrix(uniform: string, value: Float32Array | number[]) {
        let location = this.gl.getUniformLocation(this.program, uniform);
        if (value.length === 4) {
            this.gl.uniformMatrix2fv(location, false, value);
        } else if (value.length === 9) {
            this.gl.uniformMatrix3fv(location, false, value);
        } else if (value.length === 16) {
            this.gl.uniformMatrix4fv(location, false, value);
        } else {
            console.error(`Invalid value length for setUniformMatrix: ${value.length}`);
        }
    }


}



class Framebuffer {

    private rttFramebuffer: WebGLFramebuffer;
    private rttTexture: WebGLTexture;

    constructor(readonly gl: WebGLRenderingContext, readonly width = 512, readonly height = 512) {

        this.rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);

        this.rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rttTexture, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    bind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.rttFramebuffer);
    }

}


function initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    console.log("gl", !!gl);
    return gl;
}

function buildGLProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    console.log("vertexShader", gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    console.log("fragmentShader", gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    console.log("shaderProgram", gl.getProgramParameter(shaderProgram, gl.LINK_STATUS));

    return shaderProgram;
}

function buildUnitSquare(gl: WebGLRenderingContext): WebGLBuffer {

    // rect(0, 0, 1, 1);
    const vertices = [
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
    ];

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return buffer;
}

function buildUnitSquareUVs(gl: WebGLRenderingContext): WebGLBuffer {
    const uvs = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    return buffer;
}
