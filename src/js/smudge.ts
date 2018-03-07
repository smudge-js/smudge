import { forEach, each, defaults } from 'lodash';
const _ = { forEach, each, defaults };
import { mat4 } from 'gl-matrix';
import { saveAs } from 'file-saver';



import { consoleTrace, consoleReport, consoleError } from './logging';

import { IGeometry, UnitSquare, UnitCircle, Quad, Matrix } from './draw';

import { Material2 } from './material/material';
import { colorDescriptionToRGBA } from './material/color';

import { bufferLayouts, IReadonlyBufferLayout } from './config/buffer_layouts';

import { Framebuffer } from './private/framebuffer';
import { Program } from './private/program';
import { Texture } from './private/texture';
import { buildLineQuads, ILineOptions } from './draw/line';

import { makeExr } from './exr';

import { wait } from './util';
import { IExportLayout } from './config/export_layouts';


export class Smudge {

    public readonly gl: WebGLRenderingContext;

    public readonly canvas: HTMLCanvasElement;
    public readonly width: number;
    public readonly height: number;
    public readonly buffers: { [key: string]: Framebuffer };

    private readonly canvasWidth: number;
    private readonly canvasHeight: number;

    private readonly pMatrix: mat4;

    private readonly basicProgram: Program;
    private readonly textureProgram: Program;
    private readonly drawProgram: Program;


    /**
     * Creates the smudge instace.
     * @param canvas Canvas to draw to. If not specified, smudge will look for #gl-canvas.
     * @param width The width of the drawing.
     * @param height The height of the drawing.
     */
    constructor(public name = "untitled", width?: number, height?: number) {
        this.canvas = document.createElement('canvas');
        this.width = width || this.canvas.width;
        this.height = height || this.canvas.height;
        this.canvasWidth = this.width;
        this.canvasHeight = this.height;

        // get context
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.gl = this.initWebGL(this.canvas);

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
    }



    // @todo probably belongs somewhere else, like in texture.
    // @todo maybe not. Don't love the idea of having to pass smudge.gl to loadTexture, and this way loadTexture has it.
    /**
     * Loads an image from a file and creates a texture for the image.
     * `const t = await smudge.loadTexture("images/a.png");`
     *
     * @param path path to image to load
     */
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
        consoleTrace("clear");

        _.forEach(bufferLayouts, (_bufferLayout, bufferName) => {
            // find the materialChannel for the current buffer
            const materialChannel = material[bufferName];
            const { color } = _.defaults(materialChannel, material.default);
            const colorRGBA = colorDescriptionToRGBA(color);
            if (colorRGBA === undefined) {
                consoleTrace(`Skipping ${bufferName} because color === undefined`);
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

    /**
     * Draws a rectangle
     * @param x left side
     * @param y bottom
     * @param w width
     * @param h height
     * @param material
     * @param matrix
     */
    public rect(x: number, y: number, w: number, h: number, material: Material2, matrix = new Matrix()): void {
        const unitSquare = new UnitSquare(this.gl);
        this.drawGeometery(unitSquare, x, y, w, h, material, matrix);
    }


    /**
     * Draws an ellipse
     * @param x left
     * @param y right
     * @param w width
     * @param h height
     * @param material
     * @param matrix
     * @param sides number of sides to draw, auto calculates if `undefined`
     */
    public ellipse(x: number, y: number, w: number, h: number, material: Material2, matrix = new Matrix(), sides?: number): void {
        if (!sides) {
            // calculate sides based on size of ellipse
            const radius = Math.max(w, h) / 2;
            sides = Math.ceil(3.14 * radius / 2);
        }
        const unitCircle = new UnitCircle(this.gl, sides);

        this.drawGeometery(unitCircle, x, y, w, h, material, matrix);
    }

    /**
     * Fills a figure given as four points.
     * @param verticies array of the quad corners `[[0, 0],[0, 1],[1, 1],[.8, .8]]`
     * @param material
     * @param matrix
     * @param uvs array of the uv coords `[[0, 0],[0, 1],[1, 1],[1, 0]]`
     */
    public quad(verticies: number[][], material: Material2, matrix = new Matrix(), uvs?: number[][]): void {
        if (verticies.length !== 4) {
            consoleError("quad(): points array should have length of 4");
            return;
        }
        const geometry: IGeometry = new Quad(this.gl, verticies, uvs);
        this.drawGeometery(geometry, 0, 0, 1, 1, material, matrix);
        geometry.delete();
    }


    /**
     * Strokes a provided path as configured in options
     * @param points array of points `[[0,0],[1,1],...]`
     * @param options ILineOptions
     * @param material
     * @param matrix
     */
    public line(points: number[][], options: number | ILineOptions = 1, material: Material2, matrix = new Matrix()): void {
        const quads = buildLineQuads(this.gl, points, options);
        quads.forEach((quad) => {
            this.drawGeometery(quad, 0, 0, 1, 1, material, matrix);
            quad.delete();
        });
    }

    /**
     * Copies the provided buffer to the canvas
     *
     * @param buffer the buffer or name of buffer to copy
     */
    // @todo this is a pretty ui-centric operation, maybe ui should have a show("bufferName") command that is public, and calls this internally?
    public async show(bufferOrName: Framebuffer | string = "albedo") {
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
        const unitSquare = new UnitSquare(this.gl);
        unitSquare.draw(this.textureProgram);

        // clean up
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.gl.disable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        await wait();
    }

    // @todo create IPackingLayout

    /**
     * clears target to `clear_color`, then copies/swizzles
     * colors from the channel buffers according to `packing_layout`
     * targets smudge.canvas or provided `targetBuffer`
     *
     * @param targetBuffer the buffer to copy to, defaults to smudge.canvas
     * @param packingLayout how values should be packed
     * @param clearColor the intial color value
     */
    public pack(packingLayout = {}, clearColor = [0, 0, 0, 0], targetBuffer: Framebuffer = null): void {
        consoleTrace("pack()", ...Array.from(arguments));

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
        this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    }

    /**
     * Get Framebuffer with name.
     * @param bufferName
     */
    public getBuffer(bufferName: string): Framebuffer {
        const buffer = this.buffers[bufferName];
        if (!buffer) {
            consoleError("Could not find buffer named: " + bufferName);
            return;
        }
        return buffer;
    }

    /**
     * Saves current canvas to as download file.
     *
     * @param fileName name of download
     */
    public saveCanvasAs(fileName: string) {
        this.canvas.toBlob((blob) => {
            // console.log(this, fileName, blob);
            saveAs(blob, fileName);
        });
    }

    public saveBufferEXR(fileName: string, buffer: string | Framebuffer = "albedo", gamma = 1.0) {
        let b: Framebuffer;
        if (buffer instanceof Framebuffer) {
            b = buffer;
        } else {
            b = this.getBuffer(buffer);
        }

        // read pixels
        b.bind();
        const pixels = new Float32Array(b.width * b.height * 4);
        this.gl.readPixels(0, 0, b.width, b.height, this.gl.RGBA, this.gl.FLOAT, pixels);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // export exr
        const exrBlob = makeExr(b.width, b.height, pixels, gamma);
        saveAs(exrBlob, fileName);
    }

    public saveBufferPNG(fileName: string, buffer: string | Framebuffer = "albedo") {
        let b: Framebuffer;
        if (buffer instanceof Framebuffer) {
            b = buffer;
        } else {
            b = this.getBuffer(buffer);
        }

        // read pixels
        b.bind();
        const pixels = new Uint8Array(b.width * b.height * 4);
        this.gl.readPixels(0, 0, b.width, b.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // write to canvas
        const canvas = document.createElement('canvas');
        canvas.width = b.width;
        canvas.height = b.height;
        const context = canvas.getContext('2d');
        const imageData = context.createImageData(b.width, b.height);
        imageData.data.set(pixels);
        context.putImageData(imageData, 0, 0);

        // flip it
        context.translate(0, b.height);
        context.scale(1, -1);
        context.drawImage(canvas, 0, 0);


        // export canvas
        canvas.toBlob((blob) => {
            saveAs(blob, fileName);
        });


    }

    public export(layout: IExportLayout, exportName = `custom_${this.name}`) {
        const depth = layout.type === "png" ? 8 : 16;
        const packBuffer = new Framebuffer("pack_buffer", this.gl, layout.size, layout.size, 4, depth);
        this.pack(layout.layout, layout.clear, packBuffer);

        if (layout.type === "png") {
            this.saveBufferPNG(`${exportName}.png`, packBuffer);
        } else {
            this.saveBufferEXR(`${exportName}.exr`, packBuffer, layout.gamma);
        }


    }



    /**
     * Draws unit `geometry` into each smudge.bufferLayout using coresponding `material` materialChannel to configure
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
    private drawGeometery(geometry: IGeometry, x: number, y: number, w: number, h: number, material: Material2, matrix = new Matrix()): void {
        // set camera/cursor position
        const mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, mvMatrix, matrix.m);
        mat4.translate(mvMatrix, mvMatrix, [x, y, 0.0]);
        mat4.scale(mvMatrix, mvMatrix, [w, h, 1]);

        let drawBuffer;
        _.forEach(bufferLayouts, drawBuffer = (_bufferLayout: IReadonlyBufferLayout, bufferName: string) => {
            // find the materialChannel for the current buffer
            const materialChannel = material[bufferName];


            // fall back on material's defaults if needed
            // @todo test deepDefaults with textures...
            const { color, blendMode, textureInfo } = _.defaults(materialChannel, material.default);
            const colorRGBA = colorDescriptionToRGBA(color);
            if (colorRGBA === undefined) {
                consoleTrace(`Skipping ${bufferName} because color === undefined`);
                return;
            } else {
                consoleTrace(`Drawing ${bufferName}`);
            }


            // set up shader program
            let program: Program;
            if (!textureInfo || !textureInfo.texture) {

                program = this.basicProgram;
                program.use();

                program.setUniformMatrix("uMVMatrix", mvMatrix);
                program.setUniformMatrix("uPMatrix", this.pMatrix);
                program.setUniformFloats("uColor", colorRGBA);



            } else {

                program = this.drawProgram;
                program.use();



                program.setUniformMatrix("uMVMatrix", mvMatrix);
                program.setUniformMatrix("uPMatrix", this.pMatrix);
                program.setUniformMatrix("uSourceColorMatrix", textureInfo.colorMatrix);
                program.setUniformFloats("uSourceColorBias", textureInfo.colorBias);
                program.setUniformMatrix("uSourceUVMatrix", textureInfo.uvMatrix);
                program.setUniformInts("uSourceSampler", [0]);
                program.setUniformFloats("uColor", colorRGBA);


                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, textureInfo.texture.texture);
            }




            // config GL state

            // blending
            this.gl.enable(this.gl.BLEND);

            this.gl.blendEquationSeparate(blendMode.equation, this.gl.FUNC_ADD);
            this.gl.blendFuncSeparate(blendMode.sFactor, blendMode.dFactor, this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

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

            // clean up
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            program.done();
            this.gl.disable(this.gl.BLEND);
            this.gl.blendEquation(this.gl.FUNC_ADD);
            this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

            this.gl.colorMask(true, true, true, true);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight);

        });

    }

    /**
     * copies `sourceBuffer` to the `targetBuffer`, uses `colorMatrix` to swizzle colors
     *
     * @param sourceBuffer
     * @param colorMatrix
     * @param targetBuffer
     */
    private blit(sourceBuffer: Framebuffer, colorMatrix: Float32Array | number[] = mat4.create(), targetBuffer: Framebuffer = null) {

        consoleTrace("blit()", ...Array.from(arguments));


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
        const unitSquare = new UnitSquare(this.gl);
        unitSquare.draw(this.textureProgram);


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
        consoleReport("Getting webgl2 context", !!gl);
        consoleReport("Max Texture Size", gl.getParameter(gl.MAX_TEXTURE_SIZE));
        const ext = gl.getExtension("EXT_color_buffer_float");
        consoleReport("Getting EXT_color_buffer_float", !!ext);
        return gl;
    }




}







