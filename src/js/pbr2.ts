declare var require: any;

var _ = require('lodash/core');
import { mat4, vec3 } from 'gl-matrix';
import bindUI from './pbr2_ui'

import draw from './sketches/test_pattern';

var console_report = console.log.bind(window.console);
var console_error = console.error.bind(window.console);

export let buffer_layouts = {
    albedo: {
        super_sampling: 8,
        depth: 16,
        channels: 4,
        channel_materials: ["red", "green", "blue", "transparency"]
    },
    metallic: {
        super_sampling: 8,
        depth: 16,
        channels: 1,
        channel_materials: ["metallic", "metallic", "metallic", "transparency"]
    },
    smoothness: {
        super_sampling: 8,
        depth: 16,
        channels: 1,
        channel_materials: ["smoothness", "smoothness", "smoothness", "transparency"]
    },
    height: {
        super_sampling: 8,
        depth: 16,
        channels: 1,
        channel_materials: ["height", "height", "height", "transparency"]
    },
    emission: {
        super_sampling: 8,
        depth: 16,
        channels: 4,
        channel_materials: ["emission_red", "emission_green", "emission_blue", "transparency"]
    }
}

export default class PBR {
    readonly width: number;
    readonly height: number;
    readonly canvas_width: number;
    readonly canvas_height: number;

    readonly gl: WebGLRenderingContext;
    private mvMatrix: mat4;
    private pMatrix: mat4;

    readonly colorProgram: Program;
    readonly textureProgram: Program;

    readonly unitSquare: Geometry;

    // readonly albedoBuffer: Framebuffer;
    // readonly metallicBuffer: Framebuffer;
    // readonly heightBuffer: Framebuffer;
    // readonly emissionBuffer: Framebuffer;

    readonly buffers: { [key: string]: Framebuffer };

    constructor(readonly canvas?: HTMLCanvasElement, width?: number, height?: number, readonly super_sampling: number = 8) {
        this.canvas = canvas = canvas || document.getElementById("gl-canvas") as HTMLCanvasElement;
        this.width = width || canvas.width;
        this.height = height || canvas.height;
        this.canvas_width = width;
        this.canvas_height = height;


        if ([1, 2, 4, 8].indexOf(this.super_sampling) === -1) {
            console_error("super_sampling should be 1, 2, 4, or 8");
            this.super_sampling = 1;
        }


        // get context
        canvas.width = this.canvas_width;
        canvas.height = this.canvas_height;
        this.gl = initWebGL(canvas);

        // configure context
        this.gl.viewport(0, 0, this.canvas_width, this.canvas_height);
        this.gl.disable(this.gl.DEPTH_TEST);

        // create projection matrix
        this.pMatrix = mat4.create();
        mat4.ortho(this.pMatrix, 0, this.width, 0, this.height, -1, 1);

        // create model view matrix
        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);

        // build shader program
        const basicVert = require("../glsl/basic_vertex.glsl");
        const basicFrag = require("../glsl/basic_fragment.glsl");
        this.colorProgram = new Program("colorProgram", this.gl, basicVert, basicFrag);

        const textureVert = require("../glsl/texture_vertex.glsl");
        const textureFrag = require("../glsl/texture_fragment.glsl");
        this.textureProgram = new Program("textureProgram", this.gl, textureVert, textureFrag);

        // build geo
        this.unitSquare = buildUnitSquare(this.gl);


        // create pixel buffers
        // let buffer_width = width * super_sampling;
        // let buffer_height = height * super_sampling;
        // this.albedoBuffer = new Framebuffer("albedoBuffer", this.gl, buffer_width, buffer_height);
        // this.metallicBuffer = new Framebuffer("metallicBuffer", this.gl, buffer_width, buffer_height);
        // this.heightBuffer = new Framebuffer("heightBuffer", this.gl, buffer_width, buffer_height, 1);
        // this.emissionBuffer = new Framebuffer("emissionBuffer", this.gl, buffer_width, buffer_height);

        this.buffers = {};
        _.forEach(buffer_layouts, (buffer_layout: any, buffer_name: string) => {
            let buffer = new Framebuffer(buffer_name, this.gl, width * buffer_layout.super_sampling, height * buffer_layout.super_sampling, buffer_layout.channels, buffer_layout.depth);
            this.buffers[buffer_name] = buffer;
        });

        // clean up
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);


        // set up ui buttons, etc.
        bindUI(this);
    }

    /**
     * Clears buffers using provided material values
     * @param m
     */
    clear(material = Material.clearing) {

        _.forEach(buffer_layouts, (buffer_layout: any, buffer_name: string) => {
            let buffer = this.buffers[buffer_name];
            buffer.bind();


            this.gl.clearColor(
                (material as any)[buffer_layout.channel_materials[0]],
                (material as any)[buffer_layout.channel_materials[1]],
                (material as any)[buffer_layout.channel_materials[2]],
                (material as any)[buffer_layout.channel_materials[3]]
            );

            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        });

        // this.albedoBuffer.bind();
        // this.gl.clearColor(m.red, m.green, m.blue, m.transparency);
        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // this.metallicBuffer.bind();
        // this.gl.clearColor(m.metallic, 0.0, 0.0, m.smoothness);
        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // this.heightBuffer.bind();
        // this.gl.clearColor(m.height, 0.0, 0.0, 1.0);
        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // clean up
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    }

    /**
     * Draws a rectangle using provided material values
     */
    rect(x: number, y: number, w: number, h: number, material = Material.white): void {




        // set camera/cursor position
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, this.mvMatrix, [x, y, 0.0]);
        mat4.scale(this.mvMatrix, this.mvMatrix, [w, h, 1]);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE);


        // set up program
        this.colorProgram.use();
        this.colorProgram.setAttributeValue("aVertexPosition", this.unitSquare.verticies, 3, this.gl.FLOAT, false, 0, 0);
        this.colorProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.colorProgram.setUniformMatrix("uMVMatrix", this.mvMatrix);

        _.forEach(buffer_layouts, (buffer_layout: any, buffer_name: string) => {
            let buffer = this.buffers[buffer_name];

            

            let colors = [
                (material as any)[buffer_layout.channel_materials[0]],
                (material as any)[buffer_layout.channel_materials[1]],
                (material as any)[buffer_layout.channel_materials[2]],
                (material as any)[buffer_layout.channel_materials[3]]
            ];

            this.gl.colorMask(
                colors[0] !== undefined,
                colors[1] !== undefined,
                colors[2] !== undefined,
                colors[3] !== undefined
            );

            console.log(colors);
            

            this.colorProgram.setUniformFloats("uColor", colors);
            buffer.bind();
            this.gl.viewport(0, 0, buffer.width, buffer.height);
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        });


        // // draw albedo
        // this.colorProgram.setUniformFloats("uColor", [material.red, material.green, material.blue, material.transparency]);
        // this.albedoBuffer.bind();
        // this.gl.viewport(0, 0, this.albedoBuffer.width, this.albedoBuffer.height);
        // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // // draw metallic
        // this.colorProgram.setUniformFloats("uColor", [material.metallic, 0.0, 0.0, material.smoothness]);
        // this.metallicBuffer.bind();
        // this.gl.viewport(0, 0, this.metallicBuffer.width, this.metallicBuffer.height);
        // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // // draw height
        // this.colorProgram.setUniformFloats("uColor", [material.height, 0.0, 0.0, 1.0]);
        // this.heightBuffer.bind();
        // this.gl.viewport(0, 0, this.heightBuffer.width, this.heightBuffer.height);
        // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // clean up
        this.gl.colorMask(true, true, true, true);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.canvas_width, this.canvas_height);
    }

    /**
     * Copies the provided buffer's pixel values to the canvas
     * @param buffer
     */
    show(bufferName = "albedo"): void {
        let buffer = this.buffers[bufferName];

        let color = [1.0, 0.0, 0.0, 1.0];

        // position rect
        mat4.identity(this.mvMatrix);

        mat4.scale(this.mvMatrix, this.mvMatrix, [this.width, this.height, 1]);
        // mat4.scale(this.mvMatrix, this.mvMatrix, [4, 4, 1]);

        // config shader
        this.textureProgram.use();
        this.textureProgram.setAttributeValue("aVertexPosition", this.unitSquare.verticies, 3, this.gl.FLOAT, false, 0, 0);
        this.textureProgram.setAttributeValue("aTextureCoord", this.unitSquare.uvs, 2, this.gl.FLOAT, false, 0, 0);
        this.textureProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.textureProgram.setUniformMatrix("uMVMatrix", this.mvMatrix);
        this.textureProgram.setUniformInts("uSampler", [0]);

        // set texture
        console.log(this.buffers);

        buffer.bindTexture(this.gl.TEXTURE0);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        // draw rect to screen
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // clean up
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    }

    // show_albedo(): void {
    //     this.show(this.buffers["albedo"]);
    // }

    // show_metallic(): void {
    //     this.show(this.buffers["metallic"]);
    // }

    // show_height(): void {
    //     this.show(this.buffers["height"]);
    // }

    // get_albedo(): string {
    //     this.show_albedo();
    //     let dataURL = this.canvas.toDataURL('image/png');
    //     return dataURL;
    // }

    // get_metallic(): string {
    //     this.show_metallic();
    //     let dataURL = this.canvas.toDataURL('image/png');
    //     return dataURL;
    // }

    // get_height(): string {
    //     this.show_height();
    //     let dataURL = this.canvas.toDataURL('image/png');
    //     return dataURL;
    // }


}



class Program {
    public program: WebGLProgram;

    constructor(readonly name = "unnamed", readonly gl: WebGLRenderingContext, readonly vertexSource: string, readonly fragmentSource: string) {




        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        console_report(this.toString(), "vertexShader", gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        console_report(this.toString(), "fragmentShader", gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        console_report(this.toString(), "LINK_STATUS", gl.getProgramParameter(program, gl.LINK_STATUS));

        gl.validateProgram(program);

        console_report(this.toString(), "VALIDATE_STATUS", gl.getProgramParameter(program, gl.VALIDATE_STATUS));

        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            var info = gl.getProgramInfoLog(program);
            throw 'Could not compile WebGL program. \n\n' + info;
        }

        this.program = program;




    }

    use(): void {
        this.gl.useProgram(this.program);
    }

    setAttributeValue(attribute: string, buffer: WebGLBuffer, size: GLint, type: GLint, normalized: GLboolean, stride: GLsizei, offset: GLintptr) {
        let loc = this.gl.getAttribLocation(this.program, attribute);
        if (loc == -1) {
            console_error(this.toString(), `Shader program attribute not found: ${attribute}`);
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
            console_error(this.toString(), `Shader program uniform not found: ${uniform}`);
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
            console_error(this.toString(), `Invalid value length for setUniformFloats: ${value.length}`);
        }
    }

    setUniformInts(uniform: string, value: Int32Array | number[]) {
        let loc = this.gl.getUniformLocation(this.program, uniform);
        if (loc == null) {
            console_error(this.toString(), `Shader program uniform not found: ${uniform}`);
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
            console_error(this.toString(), `Invalid value length for setUniformFloats: ${value.length}`);
        }
    }

    setUniformMatrix(uniform: string, value: Float32Array | number[]) {
        let loc = this.gl.getUniformLocation(this.program, uniform);
        if (loc == null) {
            console_error(this.toString(), `Shader program uniform not found: ${uniform}`);
            return false;
        }

        if (value.length === 4) {
            this.gl.uniformMatrix2fv(loc, false, value);
        } else if (value.length === 9) {
            this.gl.uniformMatrix3fv(loc, false, value);
        } else if (value.length === 16) {
            this.gl.uniformMatrix4fv(loc, false, value);
        } else {
            console_error(this.toString(), `Invalid value length for setUniformMatrix: ${value.length}`);
        }
    }

    toString(): string {
        return `GLProgram "${this.name}"`;
    }


}

class Framebuffer {

    private rttFramebuffer: WebGLFramebuffer;
    private rttTexture: WebGLTexture;

    constructor(readonly name = "unnamed", readonly gl: WebGLRenderingContext, readonly width = 512, readonly height = 512, readonly channels = 4, readonly depth = 16) {

        if ([1, 4].indexOf(this.channels) === -1) {
            console_error("channels should be 1 or 4");
            this.channels = 4;
        }

        if ([8, 16].indexOf(this.depth) === -1) {
            console_error("depth should be 8 or 16");
            this.depth = 16;
        }

        // create framebuffer
        this.rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);

        // create texture
        this.rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);

        const gl2 = gl as any;

        if (channels === 1 && depth === 8) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl2.R8, width, height, 0, gl2.RED, gl.UNSIGNED_BYTE, null);
        }
        if (channels === 1 && depth === 16) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl2.R16F, width, height, 0, gl2.RED, gl2.HALF_FLOAT, null);
        }
        if (channels === 4 && depth === 8) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl2.RGBA8, width, height, 0, gl2.RGBA, gl.UNSIGNED_BYTE, null);
        }
        if (channels === 4 && depth === 16) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl2.RGBA16F, width, height, 0, gl2.RGBA, gl2.HALF_FLOAT, null);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // attach texture
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rttTexture, 0);

        // check status
        let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        console_report(this.toString(), status === gl.FRAMEBUFFER_COMPLETE);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console_error("Failed to build Framebuffer: Incomplete or Unsupported");
        }

        // clean up
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    toString(): string {
        return `Framebuffer "${this.name}"`;
    }
    bind(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.rttFramebuffer);
    }

    bindTexture(textureUnit = this.gl.TEXTURE0): void {
        this.gl.activeTexture(textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rttTexture);
    }

}

export class Material {
    static clearing = new Material(0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
    static white = new Material(1.0, 1.0, 1.0, 1.0);
    //todo can this return a copy? 


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

class Geometry {
    public verticies: WebGLBuffer;
    public uvs: WebGLBuffer;
}

function buildUnitSquare(gl: WebGLRenderingContext): Geometry {
    let geometry = new Geometry();

    geometry.verticies = buildUnitSquareVerticies(gl);
    geometry.uvs = buildUnitSquareUVs(gl);
    return geometry;

    function buildUnitSquareVerticies(gl: WebGLRenderingContext): WebGLBuffer {

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
}

function initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    const gl = canvas.getContext('webgl2') as WebGLRenderingContext;
    console_report("Getting webgl2 context", !!gl);
    var ext = gl.getExtension('EXT_color_buffer_float');
    console_report("Getting EXT_color_buffer_float", !!ext);
    return gl;
}
