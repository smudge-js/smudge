import * as _ from 'lodash';
import { mat4 } from 'gl-matrix';

import { console_report, console_error } from './util';
import { bindUI } from './pbr2_ui'
import { buffer_layouts } from './buffer_layouts';
import { Material } from './material';


export class PBR {

    readonly width: number;
    readonly height: number;
    private readonly canvas_width: number;
    private readonly canvas_height: number;

    private readonly gl: WebGLRenderingContext;
    private readonly pMatrix: mat4;

    private readonly colorProgram: Program;
    private readonly textureProgram: Program;

    private readonly unitSquare: Geometry;
    private readonly buffers: { [key: string]: Framebuffer };

    /**
     *
     * @param canvas Canvas to draw to. If not specified, PBR will look for #gl-canvas.
     * @param width The width of the drawing.
     * @param height The height of the drawing.
     */
    constructor(readonly canvas?: HTMLCanvasElement, width?: number, height?: number) {
        this.canvas = canvas = canvas || document.getElementById("gl-canvas") as HTMLCanvasElement;
        this.width = width || canvas.width;
        this.height = height || canvas.height;
        this.canvas_width = this.width;
        this.canvas_height = this.height;

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

        // build shader programs
        const basicVert = require("../glsl/basic_vertex.glsl");
        const basicFrag = require("../glsl/basic_fragment.glsl");
        this.colorProgram = new Program("colorProgram", this.gl, basicVert, basicFrag);

        const textureVert = require("../glsl/texture_vertex.glsl");
        const textureFrag = require("../glsl/texture_fragment.glsl");
        this.textureProgram = new Program("textureProgram", this.gl, textureVert, textureFrag);

        // build geo
        this.unitSquare = buildUnitSquare(this.gl);

        // build buffers
        this.buffers = {};
        _.forEach(buffer_layouts, (buffer_layout, buffer_name) => {
            let buffer = new Framebuffer(buffer_name, this.gl, this.width * buffer_layout.super_sampling, this.height * buffer_layout.super_sampling, buffer_layout.channels, buffer_layout.depth);
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
    clear(material = Material.clearing): void {

        _.forEach(buffer_layouts, (buffer_layout, buffer_name) => {
            let buffer = this.buffers[buffer_name];
            buffer.bind();



            this.gl.clearColor(
                material[buffer_layout.channel_materials[0]],
                material[buffer_layout.channel_materials[1]],
                material[buffer_layout.channel_materials[2]],
                material[buffer_layout.channel_materials[3]]
            );

            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        });

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    }

    /**
     * Draws a rectangle using provided material values
     */
    rect(x: number, y: number, w: number, h: number, material = Material.white): void {

        // set camera/cursor position
        let mvMatrix = mat4.create();
        mat4.translate(mvMatrix, mvMatrix, [x, y, 0.0]);
        mat4.scale(mvMatrix, mvMatrix, [w, h, 1]);



        // set up program
        this.colorProgram.use();
        this.colorProgram.setAttributeValue("aVertexPosition", this.unitSquare.verticies, 3, this.gl.FLOAT, false, 0, 0);
        this.colorProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.colorProgram.setUniformMatrix("uMVMatrix", mvMatrix);

        _.forEach(buffer_layouts, (buffer_layout, buffer_name) => {
            let buffer = this.buffers[buffer_name];

            // blending
            let equation = material[buffer_layout.blend_mode].equation;
            let sFactor = material[buffer_layout.blend_mode].sFactor;
            let dFactor = material[buffer_layout.blend_mode].dFactor;

            this.gl.enable(this.gl.BLEND);
            this.gl.blendEquationSeparate(equation, this.gl.FUNC_ADD);
            this.gl.blendFuncSeparate(sFactor, dFactor, this.gl.SRC_ALPHA, this.gl.ONE);

            // color
            let colors = [
                material[buffer_layout.channel_materials[0]],
                material[buffer_layout.channel_materials[1]],
                material[buffer_layout.channel_materials[2]],
                material[buffer_layout.channel_materials[3]]
            ];

            this.gl.colorMask(
                colors[0] !== undefined,
                colors[1] !== undefined,
                colors[2] !== undefined,
                colors[3] !== undefined
            );

            this.colorProgram.setUniformFloats("uColor", colors);

            // draw
            buffer.bind();
            this.gl.viewport(0, 0, buffer.width, buffer.height);
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        });



        // clean up
        this.gl.disable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE);

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

        // position rect
        let mvMatrix = mat4.create();
        mat4.scale(mvMatrix, mvMatrix, [this.width, this.height, 1]);

        // config shader
        this.textureProgram.use();
        this.textureProgram.setAttributeValue("aVertexPosition", this.unitSquare.verticies, 3, this.gl.FLOAT, false, 0, 0);
        this.textureProgram.setAttributeValue("aTextureCoord", this.unitSquare.uvs, 2, this.gl.FLOAT, false, 0, 0);
        this.textureProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.textureProgram.setUniformMatrix("uMVMatrix", mvMatrix);
        this.textureProgram.setUniformInts("uSampler", [0]);

        // set texture
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

    setAttributeValue(attribute: string, buffer: WebGLBuffer, size: GLint, type: GLint, normalized: GLboolean, stride: GLsizei, offset: GLintptr): void {
        let loc = this.gl.getAttribLocation(this.program, attribute);
        if (loc == -1) {
            console_error(this.toString(), `Shader program attribute not found: ${attribute}`);
        }

        this.gl.enableVertexAttribArray(loc);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(loc, size, type, normalized, stride, offset);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    setUniformFloats(uniform: string, value: Float32Array | number[]): void {
        let loc = this.gl.getUniformLocation(this.program, uniform);
        if (loc == null) {
            console_error(this.toString(), `Shader program uniform not found: ${uniform}`);
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

    setUniformInts(uniform: string, value: Int32Array | number[]): void {
        let loc = this.gl.getUniformLocation(this.program, uniform);
        if (loc == null) {
            console_error(this.toString(), `Shader program uniform not found: ${uniform}`);
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

    setUniformMatrix(uniform: string, value: Float32Array | number[]): void {
        let loc = this.gl.getUniformLocation(this.program, uniform);
        if (loc == null) {
            console_error(this.toString(), `Shader program uniform not found: ${uniform}`);
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
            this.channels = channels = 4;
        }

        if ([8, 16].indexOf(this.depth) === -1) {
            console_error("depth should be 8 or 16");
            this.depth = depth = 16;
        }

        const max_size = gl.getParameter(gl.MAX_TEXTURE_SIZE) * .5;
        if (width > max_size || height > max_size) {
            console_error(`Requested texture size larger than MAX_TEXTURE_SIZE/2 (${max_size}). Trying ${max_size}.`);
            this.width = width = max_size;
            this.height = height = max_size;
        }



        // create framebuffer
        this.rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);

        // create texture
        this.rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);

        const gl2 = gl as WebGL2RenderingContext;


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
        gl.generateMipmap(gl.TEXTURE_2D);

        // attach texture
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rttTexture, 0);

        // check status
        console_report(`RTT Memory ${(width * height * channels * depth) / (8 * 1024 * 1024)}MB`);
        let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        console_report(this.toString(), status === gl.FRAMEBUFFER_COMPLETE);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console_error("Failed to build Framebuffer: Incomplete or Unsupported: " + status);
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
    console.log("Max Texture Size", gl.getParameter(gl.MAX_TEXTURE_SIZE));
    var ext = gl.getExtension('EXT_color_buffer_float');
    console_report("Getting EXT_color_buffer_float", !!ext);

    return gl;
}
