import { Program } from './pbr2';

export interface Geometry {
    positionBuffer: WebGLBuffer;
    uvBuffer: WebGLBuffer;

    indexBuffer: WebGLBuffer;

    draw(program: Program): void;

}

export class UnitSquare implements Geometry {
    positionBuffer: WebGLBuffer;
    uvBuffer: WebGLBuffer;

    indexBuffer: WebGLBuffer;
    constructor(public gl: WebGLRenderingContext) {
        this.positionBuffer = this.buildVerticies(this.gl);
        this.uvBuffer = this.buildUVs(this.gl);
        this.indexBuffer = this.buildIndexBuffer(this.gl);
    }

    public draw(program: Program): void {
        program.setAttributeValue("aVertexPosition", this.positionBuffer, 3, this.gl.FLOAT, false, 0, 0);
        program.setAttributeValue("aTextureCoord", this.uvBuffer, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLE_STRIP, 4, this.gl.UNSIGNED_SHORT, 0);
    }
    private buildVerticies(gl: WebGLRenderingContext): WebGLBuffer {

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

    private buildUVs(gl: WebGLRenderingContext): WebGLBuffer {
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

    private buildIndexBuffer(gl: WebGLRenderingContext): WebGLBuffer {
        const indexes = [
            0, 1, 2, 3
        ]

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;

    }
}



export class UnitCircle implements Geometry {
    positionBuffer: WebGLBuffer;
    uvBuffer: WebGLBuffer;

    indexBuffer: WebGLBuffer;
    constructor(public gl: WebGLRenderingContext, public segments = 5) {

        var vertices = [];
        var uvs = [];
        var indexes = [];

        vertices.push(.5, .5, 0);
        uvs.push(.5, .5);
        indexes.push(0);

        for (var i = 0; i < this.segments + 1; i++) {
            let a = i * Math.PI * 2 / this.segments;
            vertices.push(Math.sin(a) * .5 + .5, Math.cos(a) * .5 + .5, 0);
            uvs.push(Math.sin(a) * .5 + .5, Math.cos(a) * .5 + .5);
            indexes.push(i + 1);
        }

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.positionBuffer = vertexBuffer;

        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.uvBuffer = uvBuffer;

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = indexBuffer;


        console.log(vertices, uvs, indexes, "l");


    }

    public draw(program: Program): void {
        program.setAttributeValue("aVertexPosition", this.positionBuffer, 3, this.gl.FLOAT, false, 0, 0);
        program.setAttributeValue("aTextureCoord", this.uvBuffer, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLE_FAN, this.segments + 2, this.gl.UNSIGNED_SHORT, 0);
    }

}