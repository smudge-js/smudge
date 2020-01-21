import { Program } from "../private/program";

export * from "./unitSquare";
export * from "./unitCircle";
export * from "./quad";

/* tslint:enable:max-classes-per-file */

/** @hidden */
export interface IGeometry {
    positionBuffer: WebGLBuffer;
    uvBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;

    draw(program: Program): void;
    delete(): void;
}





