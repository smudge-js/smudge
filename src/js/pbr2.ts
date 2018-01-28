/* tslint:disable:max-classes-per-file */

import * as _ from 'lodash';
import { mat4, mat3 } from 'gl-matrix';
import { saveAs } from 'file-saver';


import { Material2, MaterialChannel } from './material/material';
import { console_report, console_error } from './util';
// import { bindUI, showUI } from './ui/pbr2_ui';
import { bufferLayouts } from './config/buffer_layouts';
import { IGeometry, UnitSquare, UnitCircle, Quad, Matrix } from './draw';

// import { IGeometry, UnitSquare, UnitCircle, Quad } from './draw/geometry';
// import { Matrix } from './draw/matrix';
import { colorDescriptionToRGBA } from './material/color';
import { Framebuffer } from './private/framebuffer';
import { Program } from './private/program';
import { Texture } from './private/texture';

const getNormals = require('polyline-normals');

export interface ILineOptions {
    width?: number;
    align?: 'center' | 'left' | 'right';
    close?: boolean;
}

export class PBR {

    public readonly width: number;
    public readonly height: number;
    public readonly gl: WebGLRenderingContext;
    public readonly buffers: { [key: string]: Framebuffer };

    private readonly canvasWidth: number;
    private readonly canvasHeight: number;

    private readonly pMatrix: mat4;

    private readonly basicProgram: Program;
    private readonly textureProgram: Program;
    private readonly drawProgram: Program;

    private readonly unitSquare: IGeometry;
    private readonly unitCircle: IGeometry;


    /**
     * Creates the PBR instace.
     * @param canvas Canvas to draw to. If not specified, PBR will look for #gl-canvas.
     * @param width The width of the drawing.
     * @param height The height of the drawing.
     */
    constructor(readonly canvas?: HTMLCanvasElement, width?: number, height?: number) {
        this.canvas = canvas = canvas || document.getElementById("channel-canvas") as HTMLCanvasElement || document.createElement('canvas');
        this.width = width || canvas.width;
        this.height = height || canvas.height;
        this.canvasWidth = this.width;
        this.canvasHeight = this.height;

        // get context
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;


        this.gl = this.initWebGL(canvas);

        // configure context
        this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);
        this.gl.disable(this.gl.DEPTH_TEST);

        // create projection matrix
        this.pMatrix = mat4.create();


        mat4.ortho(this.pMatrix, 0, this.width, 0, this.height, -1, 1);

        // build shader programs
        const basicVertex = require("../glsl/basic_vertex.glsl");
        const basicFragment = require("../glsl/basic_fragment.glsl");
        this.basicProgram = new Program("basicProgram", this.gl, basicVertex, basicFragment);

        const textureVertex = require("../glsl/texture_vertex.glsl");
        const textureFragment = require("../glsl/texture_fragment.glsl");
        this.textureProgram = new Program("textureProgram", this.gl, textureVertex, textureFragment);

        const drawVertex = require("../glsl/draw_vertex.glsl");
        const drawFragment = require("../glsl/draw_fragment.glsl");
        this.drawProgram = new Program("drawProgram", this.gl, drawVertex, drawFragment);


        // build geo
        this.unitSquare = new UnitSquare(this.gl);
        this.unitCircle = new UnitCircle(this.gl, 50);

        // build buffers
        this.buffers = {};
        _.forEach(bufferLayouts, (bufferLayout, bufferName) => {

            const w = this.width * bufferLayout.super_sampling;
            const h = this.height * bufferLayout.super_sampling;

            const buffer = new Framebuffer(bufferName, this.gl, w, h, bufferLayout.channels, bufferLayout.depth);
            this.buffers[bufferName] = buffer;
        });

        // clean up
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // set up ui buttons, etc.
        // bindUI(this);
    }

    // public showUI() {
    //     bindUI(this);
    // }

    // @todo probably belongs somewhere else, like in texture.
    public async loadTexture(path: string) {
        const name = path.split("/").pop();
        const t = new Texture(name, this.gl);
        await t.load(path);
        return t;
    }

    /**
     * Clears buffers using provided material color values
     * Ignores material blend modes and texture settings
     *
     *
     * @param material material to clear to
     */


    public clear(material = Material2.clearing): void {
        console.log("clear");

        _.forEach(bufferLayouts, (bufferLayout, bufferName) => {
            // find the materialChannel for the current buffer
            const materialChannel = material[bufferName];
            const { color } = _.defaults(materialChannel, material.default);
            const colorRGBA = colorDescriptionToRGBA(color);
            if (colorRGBA === undefined) {
                console.log(`Skipping ${bufferName} because color === undefined`);
                return;
            }


            const buffer = this.buffers[bufferName];
            buffer.bind();


            this.gl.clearColor(
                colorRGBA[0],
                colorRGBA[1],
                colorRGBA[2],
                colorRGBA[3],
            );

            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        });

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    }

    // public rect(x: number, y: number, w: number, h: number, material = Material.white, matrix = new Matrix()): void {
    //     this.drawGeometry(this.unitSquare, x, y, w, h, material, matrix);
    // }


    /**
     * Draws a rectangle
     */
    public rect2(x: number, y: number, w: number, h: number, material: Material2, matrix = new Matrix()): void {
        this.drawGeometry2(this.unitSquare, x, y, w, h, material, matrix);
    }

    // public ellipse(x: number, y: number, w: number, h: number, material = Material.white, matrix = new Matrix()): void {
    //     this.drawGeometry(this.unitCircle, x, y, w, h, material, matrix);
    // }




    // public quad(points: number[][], material = Material.white, matrix = new Matrix()): void {
    //     if (points.length !== 4) {
    //         console_error("pbr.quad(): points array should have length of 4");
    //         return;
    //     }
    //     const geometry: IGeometry = new Quad(this.gl, points);
    //     this.drawGeometry(geometry, 0, 0, 1, 1, material, matrix);
    // }

    // public line(points: number[][], _options: number | ILineOptions = 1, material = Material.white, matrix = new Matrix()): void {
    //     // validate input
    //     if (points.length < 2) {
    //         console_error("pbr.line(): points array should have length > 1");
    //         return;
    //     }

    //     // process options
    //     let options: ILineOptions = {};
    //     if (typeof _options === "number") {
    //         options = {
    //             width: _options,

    //         };
    //     } else {
    //         options = _options;
    //     }
    //     options = _.defaults(options,
    //         {
    //             width: 1,
    //             align: 'center',
    //             close: false,
    //         });

    //     if (points.length === 2) {
    //         options.close = false;
    //     }

    //     // get the miter offsets
    //     const miterData = getNormals(points, options.close);
    //     const offsets: number[][] = [];
    //     _.each(miterData, (miterDatum) => {
    //         const offset = [
    //             miterDatum[0][0] * miterDatum[1] * options.width,
    //             miterDatum[0][1] * miterDatum[1] * options.width,
    //         ];
    //         offsets.push(offset);
    //     });


    //     // calculate alignment center|left|right
    //     let offsetBias = [.5, .5];
    //     if (options.align === 'left') {
    //         offsetBias = [1, 0];
    //     }
    //     if (options.align === 'right') {
    //         offsetBias = [0, 1];
    //     }

    //     if (options.close) {
    //         points.push(points[0]);
    //         offsets.push(offsets[0]);
    //     }

    //     // center
    //     for (let i = 0; i < points.length - 1; i++) {
    //         const quadPoints: number[][] = [
    //             [points[i + 0][0] + offsets[i + 0][0] * offsetBias[1], points[i + 0][1] + offsets[i + 0][1] * offsetBias[1]],
    //             [points[i + 1][0] + offsets[i + 1][0] * offsetBias[1], points[i + 1][1] + offsets[i + 1][1] * offsetBias[1]],
    //             [points[i + 1][0] - offsets[i + 1][0] * offsetBias[0], points[i + 1][1] - offsets[i + 1][1] * offsetBias[0]],
    //             [points[i + 0][0] - offsets[i + 0][0] * offsetBias[0], points[i + 0][1] - offsets[i + 0][1] * offsetBias[0]],
    //         ];
    //         this.quad(quadPoints, material, matrix);
    //     }

    // }

    /**
     * Copies the provided buffer to the canvas
     *
     * @param buffer the buffer or name of buffer to copy
     */
    // @todo this is a pretty ui-centric operation, maybe ui should have a show("bufferName") command that is public, and calls this internally?
    public show(bufferOrName: Framebuffer | string = "albedo"): void {
        let buffer;
        if (typeof bufferOrName === "string") {
            buffer = this.buffers[bufferOrName];
        } else {
            buffer = bufferOrName;
        }

        // position rect
        const mvMatrix = mat4.create();

        mat4.scale(mvMatrix, mvMatrix, [this.width, this.height, 1]);
        // console.log(mvMatrix, this.pMatrix);

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
        this.gl.clearColor(0, 0, 0, 1);
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

        // @todo is this the right strat for updating ui?
        // showUI();
    }
    /**
     * clears target to `clear_color`, then copies/swizzles
     * colors from the channel buffers according to `packing_layout`
     * targets pbr.canvas or provided `targetBuffer`
     *
     * @param targetBuffer the buffer to copy to, defaults to pbr.canvas
     * @param packingLayout how values should be packed
     * @param clearColor the intial color value
     */

    // @todo create IPackingLayout
    public pack(packingLayout = {}, clearColor = [0, 0, 0, 0], targetBuffer: Framebuffer = null): void {

        console.log("pack", targetBuffer);

        if (targetBuffer === null) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        } else {
            targetBuffer.bind();
        }

        // clear the buffer
        this.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);


        // set up to additive blending
        this.gl.enable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

        // copy colors to framebuffer according to *packing_layout*
        _.each(packingLayout, (colorMatrix: Float32Array | number[], bufferKey) => {
            // @todo can I flip this to if colorMatrix instance of number[], would be clearer
            if (!(colorMatrix instanceof Float32Array)) {
                while (colorMatrix.length < 16) {
                    colorMatrix.push(0);
                }
            }

            this.blit(this.buffers[bufferKey], colorMatrix, targetBuffer);
        });


        // clean up
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.disable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE);

    }

    /**
     * Saves current canvas to as download file.
     *
     * @param fileName name of download
     */
    public saveCanvasAs(fileName: string) {
        this.canvas.toBlob((blob) => {
            console.log(this, fileName, blob);
            saveAs(blob, fileName);
        });
    }

    // // private drawGeometry(geometry: IGeometry, x: number, y: number, w: number, h: number, material = Material.white, matrix = new Matrix()): void {
    // //     // set camera/cursor position
    // //     const mvMatrix = mat4.create();
    // //     mat4.multiply(mvMatrix, mvMatrix, matrix.m);
    // //     mat4.translate(mvMatrix, mvMatrix, [x, y, 0.0]);
    // //     mat4.scale(mvMatrix, mvMatrix, [w, h, 1]);

    // //     // set up program
    // //     let program: Program;
    // //     if (!material.textureInfo) {
    // //         program = this.basicProgram;
    // //         program.use();
    // //     } else {
    // //         program = this.drawProgram;
    // //         program.use();

    // //         const colorMatrix = mat4.create();
    // //         // program.setUniformMatrix("uSourceColorMatrix", colorMatrix);
    // //         program.setUniformMatrix("uSourceColorMatrix", material.textureInfo.colorMatrix);

    // //         program.setUniformInts("uSourceSampler", [0]);

    // //         // let uvMatrix = mat3.create();
    // //         // mat3.translate(uvMatrix, uvMatrix, [.5, .5, 0]);
    // //         // mat3.rotate(uvMatrix, uvMatrix, 3.1415 * .2);
    // //         // mat3.scale(uvMatrix, uvMatrix, [5, 5]);
    // //         // mat3.translate(uvMatrix, uvMatrix, [-.5, -.5, 0]);
    // //         // program.setUniformMatrix("uSourceUVMatrix", uvMatrix);

    // //         program.setUniformMatrix("uSourceUVMatrix", material.textureInfo.uvMatrix);


    // //         this.gl.activeTexture(this.gl.TEXTURE0);
    // //         this.gl.bindTexture(this.gl.TEXTURE_2D, material.textureInfo.texture.texture);


    // //         program.setUniformFloats("uSourceColorBias", material.textureInfo.colorBias);



    // //         // this.gl.generateMipmap(this.gl.TEXTURE_2D);

    // //     }



    //     program.setUniformMatrix("uMVMatrix", mvMatrix);
    //     program.setUniformMatrix("uPMatrix", this.pMatrix);


    //     _.forEach(bufferLayouts, (bufferLayout, bufferName) => {
    //         const buffer = this.buffers[bufferName];

    //         // blending
    //         const equation = material[bufferLayout.blend_mode].equation;
    //         const sFactor = material[bufferLayout.blend_mode].sFactor;
    //         const dFactor = material[bufferLayout.blend_mode].dFactor;

    //         this.gl.enable(this.gl.BLEND);
    //         this.gl.blendEquationSeparate(equation, this.gl.FUNC_ADD);
    //         this.gl.blendFuncSeparate(sFactor, dFactor, this.gl.SRC_ALPHA, this.gl.ONE);

    //         // color
    //         const colors = [
    //             material[bufferLayout.channel_materials[0]],
    //             material[bufferLayout.channel_materials[1]],
    //             material[bufferLayout.channel_materials[2]],
    //             material[bufferLayout.channel_materials[3]],
    //         ];

    //         this.gl.colorMask(
    //             colors[0] !== undefined,
    //             colors[1] !== undefined,
    //             colors[2] !== undefined,
    //             colors[3] !== undefined,
    //         );

    //         program.setUniformFloats("uColor", colors);
    //         // program.setUniformFloats("uColorBias", [0, 0, 0, 0]);

    //         // draw
    //         buffer.bind();
    //         this.gl.viewport(0, 0, buffer.width, buffer.height);


    //         geometry.draw(program);

    //     });





    //     // clean up
    //     this.gl.disable(this.gl.BLEND);
    //     this.gl.blendEquation(this.gl.FUNC_ADD);
    //     this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE);

    //     this.gl.colorMask(true, true, true, true);
    //     this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    //     this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);
    // }

    /**
     * Draws unit `geometry` into each pbr.bufferLayout using coresponding `material` materialChannel to configure
     * Unit geometry is assumed to be normalized to fill rectangle 0,0,1,1 and is scaled and translated to fit target area `x`,`y`,`w`,`h`
     * Target area is multiplied by `matrix`
     *
     *
     * @param geometry geometry to draw
     * @param x left of bounding box
     * @param y bottom of bounding box
     * @param w width of bounding box
     * @param h height of bounding box
     * @param material material to draw with
     * @param matrix matrix to adjust bounding box
     */


    private drawGeometry2(geometry: IGeometry, x: number, y: number, w: number, h: number, material: Material2, matrix = new Matrix()): void {
        // set camera/cursor position
        const mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, mvMatrix, matrix.m);
        mat4.translate(mvMatrix, mvMatrix, [x, y, 0.0]);
        mat4.scale(mvMatrix, mvMatrix, [w, h, 1]);


        _.forEach(bufferLayouts, (bufferLayout, bufferName) => {
            // find the materialChannel for the current buffer
            const materialChannel = material[bufferName];


            // fall back on material's defaults if needed
            // @todo test deepDefaults with textures...
            const { color, blendMode, textureConfig } = _.defaults(materialChannel, material.default);
            const colorRGBA = colorDescriptionToRGBA(color);
            if (colorRGBA === undefined) {
                console.log(`Skipping ${bufferName} because color === undefined`);
                return;
            }


            // set up shader program
            let program: Program;
            if (!textureConfig || !textureConfig.texture) {
                program = this.basicProgram;
                program.use();

                program.setUniformMatrix("uMVMatrix", mvMatrix);
                program.setUniformMatrix("uPMatrix", this.pMatrix);
                program.setUniformFloats("uColor", colorRGBA);

            } else {
                program = this.drawProgram;
                program.use();

                console.log("use drawProgram", textureConfig);

                program.setUniformMatrix("uMVMatrix", mvMatrix);
                program.setUniformMatrix("uPMatrix", this.pMatrix);
                program.setUniformMatrix("uSourceColorMatrix", textureConfig.colorMatrix);
                program.setUniformFloats("uSourceColorBias", textureConfig.colorBias);
                program.setUniformMatrix("uSourceUVMatrix", textureConfig.uvMatrix);
                program.setUniformInts("uSourceSampler", [0]);
                program.setUniformFloats("uColor", colorRGBA);


                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, textureConfig.texture.texture);
            }




            // config GL state

            // blending
            this.gl.enable(this.gl.BLEND);
            this.gl.blendEquationSeparate(blendMode.equation, this.gl.FUNC_ADD);
            this.gl.blendFuncSeparate(blendMode.sFactor, blendMode.dFactor, this.gl.SRC_ALPHA, this.gl.ONE);

            // color
            this.gl.colorMask(
                colorRGBA[0] !== undefined,
                colorRGBA[1] !== undefined,
                colorRGBA[2] !== undefined,
                colorRGBA[3] !== undefined,
            );


            // draw buffer
            const buffer = this.buffers[bufferName];
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
        this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);
    }







    /**
     * copies `sourceBuffer` to the `targetBuffer`, uses `colorMatrix` to swizzle colors
     *
     */

    private blit(sourceBuffer: Framebuffer, colorMatrix: Float32Array | number[] = mat4.create(), targetBuffer: Framebuffer = null) {
        console.log("blit", sourceBuffer, targetBuffer);
        // config shader program
        this.textureProgram.use();

        const mvMatrix = mat4.create();
        const pMatrix = mat4.create();

        if (targetBuffer === null) {
            mat4.ortho(pMatrix, 0, this.width, 0, this.height, -1, 1);
            mat4.scale(mvMatrix, mvMatrix, [this.width, this.height, 1]);
        } else {
            mat4.ortho(pMatrix, 0, targetBuffer.width, 0, targetBuffer.height, -1, 1);
            mat4.scale(mvMatrix, mvMatrix, [targetBuffer.width, targetBuffer.height, 1]);
        }

        // console.log(this.pMatrix, mvMatrix);

        this.textureProgram.setUniformMatrix("uPMatrix", pMatrix);
        this.textureProgram.setUniformMatrix("uMVMatrix", mvMatrix);
        this.textureProgram.setUniformMatrix("uColorMatrix", colorMatrix);
        this.textureProgram.setUniformFloats("uColor", [1.0, 1.0, 1.0, 1.0]);
        this.textureProgram.setUniformInts("uColorSampler", [0]);

        // set texture from sourceBuffer
        sourceBuffer.bindTexture(this.gl.TEXTURE0);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        // set target Framebuffer
        if (targetBuffer === null) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);
        } else {
            targetBuffer.bind();
            this.gl.viewport(0, 0, targetBuffer.width, targetBuffer.height);
        }


        // draw
        this.unitSquare.draw(this.textureProgram);


        // clean up
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);
    }


    /**
     * get the a webgl2 rendering context
     * @param canvas
     */
    private initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
        const gl = canvas.getContext("webgl2") as WebGLRenderingContext;
        console_report("Getting webgl2 context", !!gl);
        console.log("Max Texture Size", gl.getParameter(gl.MAX_TEXTURE_SIZE));
        const ext = gl.getExtension("EXT_color_buffer_float");
        console_report("Getting EXT_color_buffer_float", !!ext);

        return gl;
    }



}







