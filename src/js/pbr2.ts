import * as _ from 'lodash';
import { mat4, mat3 } from 'gl-matrix';

import { Matrix } from './matrix';


import { console_report, console_error } from './util';
import { bindUI, showUI } from './pbr2_ui'
import { buffer_layouts } from './buffer_layouts';
import { Material, Material2, MaterialChannel, colorToRGBA, RGBA } from './material';
import { Geometry, UnitSquare, UnitCircle, Quad } from './geometry';

let getNormals = require('polyline-normals')

interface LineOptions {
    width?: number,
    align?: 'center' | 'left' | 'right',
    close?: boolean
}
export class PBR {

    readonly width: number;
    readonly height: number;
    private readonly canvas_width: number;
    private readonly canvas_height: number;

    readonly gl: WebGLRenderingContext;
    private readonly pMatrix: mat4;

    private readonly basicProgram: Program;
    private readonly textureProgram: Program;
    private readonly drawProgram: Program;

    private readonly unitSquare: Geometry;
    private readonly unitCircle: Geometry;
    public readonly buffers: { [key: string]: Framebuffer };

    /**
     *
     * @param canvas Canvas to draw to. If not specified, PBR will look for #gl-canvas.
     * @param width The width of the drawing.
     * @param height The height of the drawing.
     */
    constructor(readonly canvas?: HTMLCanvasElement, width?: number, height?: number) {
        this.canvas = canvas = canvas || document.getElementById("channel-canvas") as HTMLCanvasElement;
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
        const basic_vertex = require("../glsl/basic_vertex.glsl");
        const basic_fragment = require("../glsl/basic_fragment.glsl");
        this.basicProgram = new Program("basicProgram", this.gl, basic_vertex, basic_fragment);

        const texture_vertex = require("../glsl/texture_vertex.glsl");
        const texture_fragment = require("../glsl/texture_fragment.glsl");
        this.textureProgram = new Program("textureProgram", this.gl, texture_vertex, texture_fragment);

        const draw_vertex = require("../glsl/draw_vertex.glsl");
        const draw_fragment = require("../glsl/draw_fragment.glsl");
        this.drawProgram = new Program("drawProgram", this.gl, draw_vertex, draw_fragment);


        // build geo
        this.unitSquare = new UnitSquare(this.gl);
        this.unitCircle = new UnitCircle(this.gl, 50);

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

    async loadTexture(path: string) {
        let name = path.split("/").pop();
        let t = new Texture(name, this.gl);
        await t.load(path);
        return t;

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

    rect(x: number, y: number, w: number, h: number, material = Material.white, matrix = new Matrix()): void {
        this.drawGeometry(this.unitSquare, x, y, w, h, material, matrix);
    }


    rect2(x: number, y: number, w: number, h: number, material: Material2, matrix = new Matrix()): void {
        this.drawGeometry2(this.unitSquare, x, y, w, h, material, matrix);
    }

    ellipse(x: number, y: number, w: number, h: number, material = Material.white, matrix = new Matrix()): void {
        this.drawGeometry(this.unitCircle, x, y, w, h, material, matrix);
    }




    quad(points: number[][], material = Material.white, matrix = new Matrix()): void {
        if (points.length !== 4) {
            console_error("pbr.quad(): points array should have length of 4");
            return;
        }
        let geometry: Geometry = new Quad(this.gl, points);
        this.drawGeometry(geometry, 0, 0, 1, 1, material, matrix);
    }

    line(points: number[][], _options: number | LineOptions = 1, material = Material.white, matrix = new Matrix()): void {
        // validate input
        if (points.length < 2) {
            console_error("pbr.line(): points array should have length > 1");
            return;
        }

        // process options
        let options: LineOptions = {};
        if (typeof _options == "number") {
            options = {
                width: _options
            };
        } else {
            options = _options;
        }
        options = _.defaults(options, {
            width: 1,
            align: 'center',
            close: false
        });

        if (points.length === 2) {
            options.close = false;
        }

        // get the miter offsets
        let miter_data = getNormals(points, options.close);
        let offsets: number[][] = [];
        _.each(miter_data, (miter_datum) => {
            let offset = [
                miter_datum[0][0] * miter_datum[1] * options.width,
                miter_datum[0][1] * miter_datum[1] * options.width,
            ];
            offsets.push(offset);
        });


        // calculate alignment center|left|right
        let offsetBias = [.5, .5];
        if (options.align == 'left') {
            offsetBias = [1, 0];
        }
        if (options.align == 'right') {
            offsetBias = [0, 1];
        }

        if (options.close) {
            points.push(points[0]);
            offsets.push(offsets[0]);
        }

        // center
        for (let i = 0; i < points.length - 1; i++) {
            let quad_points: number[][] = [
                [points[i + 0][0] + offsets[i + 0][0] * offsetBias[1], points[i + 0][1] + offsets[i + 0][1] * offsetBias[1]],
                [points[i + 1][0] + offsets[i + 1][0] * offsetBias[1], points[i + 1][1] + offsets[i + 1][1] * offsetBias[1]],
                [points[i + 1][0] - offsets[i + 1][0] * offsetBias[0], points[i + 1][1] - offsets[i + 1][1] * offsetBias[0]],
                [points[i + 0][0] - offsets[i + 0][0] * offsetBias[0], points[i + 0][1] - offsets[i + 0][1] * offsetBias[0]],
            ];
            this.quad(quad_points, material, matrix);
        }

    }

    private drawGeometry(geometry: Geometry, x: number, y: number, w: number, h: number, material = Material.white, matrix = new Matrix()): void {
        // set camera/cursor position
        let mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, mvMatrix, matrix.m);
        mat4.translate(mvMatrix, mvMatrix, [x, y, 0.0]);
        mat4.scale(mvMatrix, mvMatrix, [w, h, 1]);

        // set up program
        let program: Program;
        if (!material.textureInfo) {
            program = this.basicProgram;
            program.use();
        } else {
            program = this.drawProgram;
            program.use();

            const colorMatrix = mat4.create();
            //program.setUniformMatrix("uSourceColorMatrix", colorMatrix);
            program.setUniformMatrix("uSourceColorMatrix", material.textureInfo.colorMatrix);

            program.setUniformInts("uSourceSampler", [0]);

            // let uvMatrix = mat3.create();
            // mat3.translate(uvMatrix, uvMatrix, [.5, .5, 0]);
            // mat3.rotate(uvMatrix, uvMatrix, 3.1415 * .2);
            // mat3.scale(uvMatrix, uvMatrix, [5, 5]);
            // mat3.translate(uvMatrix, uvMatrix, [-.5, -.5, 0]);
            // program.setUniformMatrix("uSourceUVMatrix", uvMatrix);

            program.setUniformMatrix("uSourceUVMatrix", material.textureInfo.uvMatrix);


            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, material.textureInfo.texture.texture);


            program.setUniformFloats("uSourceColorBias", material.textureInfo.colorBias);



            // this.gl.generateMipmap(this.gl.TEXTURE_2D);

        }



        program.setUniformMatrix("uMVMatrix", mvMatrix);
        program.setUniformMatrix("uPMatrix", this.pMatrix);


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

            program.setUniformFloats("uColor", colors);
            // program.setUniformFloats("uColorBias", [0, 0, 0, 0]);

            // draw
            buffer.bind();
            this.gl.viewport(0, 0, buffer.width, buffer.height);


            geometry.draw(program);

        });





        // clean up
        this.gl.disable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE);

        this.gl.colorMask(true, true, true, true);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.canvas_width, this.canvas_height);
    }


    private drawGeometry2(geometry: Geometry, x: number, y: number, w: number, h: number, material: Material2, matrix = new Matrix()): void {
        // set camera/cursor position
        let mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, mvMatrix, matrix.m);
        mat4.translate(mvMatrix, mvMatrix, [x, y, 0.0]);
        mat4.scale(mvMatrix, mvMatrix, [w, h, 1]);


        _.forEach(buffer_layouts, (buffer_layout, buffer_name) => {
            // determine material settings for buffer

            // typescript doesn't allow [] access without a index signature
            // casting workaround
            let materialChannel = (<any>material)[buffer_name] as MaterialChannel;

            let color = material.color;
            let blend_mode = material.blend_mode;
            let textureConfig = material.textureConfig;

            if (materialChannel !== undefined) {
                color = materialChannel.color !== undefined ? materialChannel.color : material.color;
                blend_mode = materialChannel.blend_mode !== undefined ? materialChannel.blend_mode : material.blend_mode;
                textureConfig = materialChannel.textureConfig !== undefined ? materialChannel.textureConfig : material.textureConfig;
            }

            console.log(buffer_name, color, blend_mode, textureConfig);




            // set up program
            let program: Program;
            if (!textureConfig || !textureConfig.texture) {
                console.log("use basicProgram");

                program = this.basicProgram;
                program.use();
            } else {

                console.log("use drawProgram");


                program = this.drawProgram;
                program.use();

                program.setUniformMatrix("uSourceColorMatrix", textureConfig.colorMatrix);
                program.setUniformFloats("uSourceColorBias", textureConfig.colorBias);
                program.setUniformMatrix("uSourceUVMatrix", textureConfig.uvMatrix);
                program.setUniformInts("uSourceSampler", [0]);

                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, textureConfig.texture.texture);
            }

            program.setUniformMatrix("uMVMatrix", mvMatrix);
            program.setUniformMatrix("uPMatrix", this.pMatrix);


            // draw

            let buffer = this.buffers[buffer_name];
            let equation = blend_mode.equation;
            let sFactor = blend_mode.sFactor;
            let dFactor = blend_mode.dFactor;

            this.gl.enable(this.gl.BLEND);
            this.gl.blendEquationSeparate(equation, this.gl.FUNC_ADD);
            this.gl.blendFuncSeparate(sFactor, dFactor, this.gl.SRC_ALPHA, this.gl.ONE);

            let colorRGBA = colorToRGBA(color);
            console.log(colorRGBA);

            program.setUniformFloats("uColor", colorRGBA);

            this.gl.colorMask(
                colorRGBA[0] !== undefined,
                colorRGBA[1] !== undefined,
                colorRGBA[2] !== undefined,
                colorRGBA[3] !== undefined
            );

            // program.setUniformFloats("uColorBias", [0, 0, 0, 0]);

            // draw
            buffer.bind();
            this.gl.viewport(0, 0, buffer.width, buffer.height);


            geometry.draw(program);


        });






        // program.setUniformMatrix("uMVMatrix", mvMatrix);
        // program.setUniformMatrix("uPMatrix", this.pMatrix);


        // _.forEach(buffer_layouts, (buffer_layout, buffer_name) => {
        //     let buffer = this.buffers[buffer_name];

        //     // blending
        //     let equation = material[buffer_layout.blend_mode].equation;
        //     let sFactor = material[buffer_layout.blend_mode].sFactor;
        //     let dFactor = material[buffer_layout.blend_mode].dFactor;

        //     this.gl.enable(this.gl.BLEND);
        //     this.gl.blendEquationSeparate(equation, this.gl.FUNC_ADD);
        //     this.gl.blendFuncSeparate(sFactor, dFactor, this.gl.SRC_ALPHA, this.gl.ONE);

        //     // color
        //     let colors = [
        //         material[buffer_layout.channel_materials[0]],
        //         material[buffer_layout.channel_materials[1]],
        //         material[buffer_layout.channel_materials[2]],
        //         material[buffer_layout.channel_materials[3]]
        //     ];

        //     this.gl.colorMask(
        //         colors[0] !== undefined,
        //         colors[1] !== undefined,
        //         colors[2] !== undefined,
        //         colors[3] !== undefined
        //     );

        //     program.setUniformFloats("uColor", colors);
        //     // program.setUniformFloats("uColorBias", [0, 0, 0, 0]);

        //     // draw
        //     buffer.bind();
        //     this.gl.viewport(0, 0, buffer.width, buffer.height);


        //     geometry.draw(program);

        // });





        // // clean up
        // this.gl.disable(this.gl.BLEND);
        // this.gl.blendEquation(this.gl.FUNC_ADD);
        // this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE);

        // this.gl.colorMask(true, true, true, true);
        // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        // this.gl.viewport(0, 0, this.canvas_width, this.canvas_height);
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
        this.textureProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.textureProgram.setUniformMatrix("uMVMatrix", mvMatrix);

        const colorMatrix = mat4.create();
        this.textureProgram.setUniformMatrix("uColorMatrix", colorMatrix);
        this.textureProgram.setUniformFloats("uColor", [1.0, 1.0, 1.0, 1.0]);

        this.textureProgram.setUniformInts("uColorSampler", [0]);

        // set texture
        buffer.bindTexture(this.gl.TEXTURE0);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        // set blending mode
        // set up to alpha multiply as we show
        this.gl.enable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ZERO);

        // bind to main color buffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // clear the buffer
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // draw rect to screen
        this.unitSquare.draw(this.textureProgram);


        // clean up
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.gl.disable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE);

        showUI();
    }


    /**
    * copies colors  from *sourceBuffer* to the main framebuffer, uses *colorMatrix* to swizzle colors
    * @todo would be nice if this could blit to a destbuffer also
    */
    private blit(sourceBuffer: Framebuffer, colorMatrix: Float32Array | number[] = mat4.create(), target_buffer: Framebuffer = null) {


        this.textureProgram.use();


        // config shader
        // position rect
        this.textureProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        let mvMatrix = mat4.create();
        if (target_buffer === null) {
            mat4.scale(mvMatrix, mvMatrix, [this.width, this.height, 1]);
        } else {
            mat4.scale(mvMatrix, mvMatrix, [target_buffer.width, target_buffer.height, 1]);
        }

        this.textureProgram.setUniformMatrix("uPMatrix", this.pMatrix);
        this.textureProgram.setUniformMatrix("uMVMatrix", mvMatrix);

        // const colorMatrix = mat4.create();
        this.textureProgram.setUniformMatrix("uColorMatrix", colorMatrix);
        this.textureProgram.setUniformFloats("uColor", [1.0, 1.0, 1.0, 1.0]);

        this.textureProgram.setUniformInts("uColorSampler", [0]);

        // set texture from source buffer
        sourceBuffer.bindTexture(this.gl.TEXTURE0);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        // draw rect to screen
        if (target_buffer === null) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        } else {
            target_buffer.bind();
        }
        this.unitSquare.draw(this.textureProgram);


        // clean up
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    /**
     * clears the framebuffer to *clear_color*, then copies/swizzles colors from the channel buffers according to *packing_layout*
     * @param buffer
     */
    pack(packing_layout = {}, clear_color = [0, 0, 0, 0], target_buffer: Framebuffer = null): void {

        if (target_buffer === null) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        } else {
            target_buffer.bind();
        }

        // clear the buffer
        this.gl.clearColor(clear_color[0], clear_color[1], clear_color[2], clear_color[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // set up to additive blending
        this.gl.enable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

        // copy colors to framebuffer according to *packing_layout*
        _.each(packing_layout, (colorMatrix: Float32Array | number[], bufferKey) => {
            if (!(colorMatrix instanceof Float32Array)) {
                while (colorMatrix.length < 16) {
                    colorMatrix.push(0);
                }
            }
            // console.log("blit", bufferKey, colorMatrix);

            this.blit(this.buffers[bufferKey], colorMatrix, target_buffer);
        });


        // clean up
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.disable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE);

    }

}

export class Program {
    public program: WebGLProgram;

    private attribLocations: { [attrib: string]: number } = {};

    private uniformLocations: { [attrib: string]: WebGLUniformLocation } = {};


    constructor(readonly name = "unnamed", readonly gl: WebGLRenderingContext, readonly vertexSource: string, readonly fragmentSource: string) {
        var error;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        error = gl.getShaderInfoLog(vertexShader);
        console_report(this.toString(), "vertexShader", gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));
        if (error) {
            console.log(error);
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        error = gl.getShaderInfoLog(fragmentShader);
        console_report(this.toString(), "fragmentShader", gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));
        if (error) {
            console.log(error);
        }

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

    getAttribLocation(attribute: string): number {
        let loc: number;
        if (this.attribLocations[attribute] !== undefined) {
            loc = this.attribLocations[attribute];
        } else {
            loc = this.gl.getAttribLocation(this.program, attribute);
            this.attribLocations[attribute] = loc;
            if (loc == -1) {
                console_error(this.toString(), `Shader program attribute not found: ${attribute}`);
            }
        }
        return loc;
    }

    setAttributeValue(attribute: string, buffer: WebGLBuffer, size: GLint, type: GLint, normalized: GLboolean, stride: GLsizei, offset: GLintptr): void {
        const loc = this.getAttribLocation(attribute);
        if (loc === -1) {
            return;
        }
        this.gl.enableVertexAttribArray(loc);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(loc, size, type, normalized, stride, offset);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    getUniformLocation(uniform: string): WebGLUniformLocation {
        let loc: WebGLUniformLocation;
        if (this.uniformLocations[uniform] !== undefined) {
            loc = this.uniformLocations[uniform];
        } else {
            loc = this.gl.getUniformLocation(this.program, uniform);
            this.uniformLocations[uniform] = loc;
            if (loc == null) {
                console_error(this.toString(), `Shader program uniform not found: ${uniform}`);
            }
        }
        return loc;
    }
    setUniformFloats(uniform: string, value: Float32Array | number[]): void {
        const loc = this.getUniformLocation(uniform);

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
        const loc = this.getUniformLocation(uniform);

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
        const loc = this.getUniformLocation(uniform);

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

export class Framebuffer {

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

        const max_size = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE));
        if (width > max_size || height > max_size) {
            console_error(`Requested texture size (${width}) too big. Trying ${max_size}.`);
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

export class Texture {
    readonly texture: WebGLTexture;
    private image: HTMLImageElement;
    public loaded: boolean;

    constructor(readonly name = "unnamed", readonly gl: WebGLRenderingContext) {
        this.texture = gl.createTexture();
    }

    load(src: string) {
        return new Promise((resolve, reject) => {
            this.image = new Image();

            this.image.onload = () => {
                console.log("image.onload");
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
                this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
                this.loaded = true;
                resolve();
            };

            this.image.onerror = (error) => {
                console.log("image.onerror", error);
                console_error(`Could not load image: ${src}`);
                this.loaded = false;
                resolve(); // image couldn't be found, but carry on anyway
            };

            // this.image.src = "images/a.png";
            this.image.src = src;
        });
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
