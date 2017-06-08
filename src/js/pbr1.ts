declare var require: any;
import { mat4, vec3 } from 'gl-matrix';
import bindUI from './pbr_ui'


export default class PBR {

    private gl: WebGLRenderingContext;
    private mvMatrix: mat4;
    private pMatrix: mat4;

    private colorProgram: Program;
    private textureProgram: Program;

    private unitSquare: WebGLBuffer;
    private unitSquareUVs: WebGLBuffer;

    private albedoBuffer: Framebuffer;
    private metallicBuffer: Framebuffer;
    private heightBuffer: Framebuffer;
    private emissionBuffer: Framebuffer;

    constructor(readonly canvas?: HTMLCanvasElement) {
        // get context
        canvas = canvas || document.getElementById("gl-canvas") as HTMLCanvasElement;
        this.canvas = canvas;
        this.gl = initWebGL(canvas);

        // configure context
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.disable(this.gl.DEPTH_TEST);

        // create projection matrix
        this.pMatrix = mat4.create();
        mat4.ortho(this.pMatrix, 0, canvas.width, 0, canvas.height, -1, 1);

        // create model view matrix
        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);

        // build shader program
        const basicVert = require("../glsl/basic_vertex.glsl");
        const basicFrag = require("../glsl/basic_fragment.glsl");
        this.colorProgram = new Program(this.gl, basicVert, basicFrag);

        const textureVert = require("../glsl/texture_vertex.glsl");
        const textureFrag = require("../glsl/texture_fragment.glsl");
        this.textureProgram = new Program(this.gl, textureVert, textureFrag);

        // build geo
        this.unitSquare = buildUnitSquare(this.gl);
        this.unitSquareUVs = buildUnitSquareUVs(this.gl);

        // create pixel buffers
        this.albedoBuffer = new Framebuffer(this.gl, 512, 512);
        this.metallicBuffer = new Framebuffer(this.gl, 512, 512);
        this.heightBuffer = new Framebuffer(this.gl, 512, 512);
        this.emissionBuffer = new Framebuffer(this.gl, 512, 512);

        // clean up
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);


        // set up ui buttons, etc.
        bindUI(this);
    }

    clear(m = Material.clearing) {

        this.albedoBuffer.bind();
        this.gl.clearColor(m.red, m.green, m.blue, m.transparency);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.metallicBuffer.bind();
        this.gl.clearColor(m.metallic, 0.0, 0.0, m.smoothness);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.heightBuffer.bind();
        this.gl.clearColor(m.height, m.height, m.height, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // clean up
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    }


    rect(x: number, y: number, w: number, h: number, material = Material.white): void {
        console.log(`rect(${x}, ${y}, ${w}, ${h}, ${material})`);

        // color = color || [1.0, 1.0, 1.0, 1.0];

        // set camera/cursor position
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, this.mvMatrix, [x, y, 0.0]);
        mat4.scale(this.mvMatrix, this.mvMatrix, [w, h, 1]);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);


        // draw albedo
        this.colorProgram.use();
        this.colorProgram.setAttributeValue("aVertexPosition", this.unitSquare, 3, this.gl.FLOAT, false, 0, 0);
        this.colorProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.colorProgram.setUniformMatrix("uMVMatrix", this.mvMatrix);
        this.colorProgram.setUniformFloats("uColor", [material.red, material.green, material.blue, material.transparency]);
        this.albedoBuffer.bind();
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // draw metallic
        this.colorProgram.setUniformFloats("uColor", [material.metallic, 0.0, 0.0, material.smoothness]);
        this.metallicBuffer.bind();
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // draw height
        this.colorProgram.setUniformFloats("uColor", [material.height, material.height, material.height, 1.0]);
        this.heightBuffer.bind();
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // clean up
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    show(buffer = this.albedoBuffer): void {
        let color = [1.0, 0.0, 0.0, 1.0];

        // position rect
        mat4.identity(this.mvMatrix);

        mat4.scale(this.mvMatrix, this.mvMatrix, [512, 512, 1]);

        // config shader
        this.textureProgram.use();
        this.textureProgram.setAttributeValue("aVertexPosition", this.unitSquare, 3, this.gl.FLOAT, false, 0, 0);
        this.textureProgram.setAttributeValue("aTextureCoord", this.unitSquareUVs, 2, this.gl.FLOAT, false, 0, 0);
        this.textureProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.textureProgram.setUniformMatrix("uMVMatrix", this.mvMatrix);
        this.textureProgram.setUniformInts("uSampler", [0]);

        // set texture
        buffer.bindTexture(this.gl.TEXTURE0);

        // draw rect to screen
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // clean up
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    show_albedo(): void {
        console.log("show_albedo");
        this.show(this.albedoBuffer);
    }

    show_metallic(): void {
        console.log("show_metallic");
        this.show(this.metallicBuffer);
    }

    show_height(): void {
        console.log("show_height");
        this.show(this.heightBuffer);
    }

    get_albedo(): string {
        this.show_albedo();
        let dataURL = this.canvas.toDataURL('image/png');
        return dataURL;
    }

    get_metallic(): string {
        this.show_metallic();
        let dataURL = this.canvas.toDataURL('image/png');
        return dataURL;
    }

    get_height(): string {
        this.show_height();
        let dataURL = this.canvas.toDataURL('image/png');
        return dataURL;
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
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    setUniformFloats(uniform: string, value: Float32Array | number[]) {
        let loc = this.gl.getUniformLocation(this.program, uniform);
        if (loc == null) {
            console.error(`Shader program uniform not found: ${uniform}`);
            return false;
        }

        if (value.length === 1) {
            this.gl.uniform1fv(loc, value);
        }
        else if (value.length === 2) {
            this.gl.uniform2fv(loc, value);
        }
        else if (value.length === 3) {
            this.gl.uniform3fv(loc, value);
        }
        else if (value.length === 4) {
            this.gl.uniform4fv(loc, value);
        } else {
            console.error(`Invalid value length for setUniformFloats: ${value.length}`);
        }
    }

    setUniformInts(uniform: string, value: Int32Array | number[]) {
        let loc = this.gl.getUniformLocation(this.program, uniform);
        if (loc == null) {
            console.error(`Shader program uniform not found: ${uniform}`);
            return false;
        }

        if (value.length === 1) {
            this.gl.uniform1iv(loc, value);
        }
        else if (value.length === 2) {
            this.gl.uniform2iv(loc, value);
        }
        else if (value.length === 3) {
            this.gl.uniform3iv(loc, value);
        }
        else if (value.length === 4) {
            this.gl.uniform4iv(loc, value);
        } else {
            console.error(`Invalid value length for setUniformFloats: ${value.length}`);
        }
    }

    setUniformMatrix(uniform: string, value: Float32Array | number[]) {
        let loc = this.gl.getUniformLocation(this.program, uniform);
        if (loc == null) {
            console.error(`Shader program uniform not found: ${uniform}`);
            return false;
        }

        if (value.length === 4) {
            this.gl.uniformMatrix2fv(loc, false, value);
        } else if (value.length === 9) {
            this.gl.uniformMatrix3fv(loc, false, value);
        } else if (value.length === 16) {
            this.gl.uniformMatrix4fv(loc, false, value);
        } else {
            console.error(`Invalid value length for setUniformMatrix: ${value.length}`);
        }
    }


}

class Framebuffer {

    private rttFramebuffer: WebGLFramebuffer;
    private rttTexture: WebGLTexture;

    constructor(readonly gl: WebGLRenderingContext, readonly width = 512, readonly height = 512) {

        // create framebuffer
        this.rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);

        // create texture
        this.rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rttTexture, 0);


        // clean up
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    bind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.rttFramebuffer);
    }

    bindTexture(textureUnit = this.gl.TEXTURE0): void {
        this.gl.activeTexture(textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rttTexture);
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

    gl.validateProgram(shaderProgram);

    console.log("shaderProgram.VALIDATE_STATUS", gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS));

    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
        var info = gl.getProgramInfoLog(shaderProgram);
        throw 'Could not compile WebGL program. \n\n' + info;
    }

    return shaderProgram;
}

function buildUnitSquare(gl: WebGLRenderingContext): WebGLBuffer {

    const vertices = [
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
    ];

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}

function buildUnitSquareUVs(gl: WebGLRenderingContext): WebGLBuffer {
    const uvs = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ]

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}



export class Material {
    static clearing = new Material(0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
    static white = new Material(1.0, 1.0, 1.0, 1.0);

    constructor(
        public red = 0,
        public green = 0,
        public blue = 0,
        public transparency = 0,
        public metallic = 0,
        public smoothness = 0,
        public height = 0,
        public emission_red = 0,
        public emission_green = 0,
        public emission_blue = 0
    ) { };

    toString() {
        return `Material(rgba ${this.red} ${this.green} ${this.blue} ${this.transparency} ms ${this.metallic} ${this.smoothness} h ${this.height} ergb ${this.emission_red} ${this.emission_green} ${this.emission_blue})`;
    }

}
