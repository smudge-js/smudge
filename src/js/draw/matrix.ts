/* tslint:disable:max-classes-per-file */

import { mat3, mat4 } from 'gl-matrix';

export class UVMatrix {
    public m: mat3;

    constructor() {
        this.m = mat3.create();
    }

    public translate(x = 0, y = 0): UVMatrix {
        mat3.translate(this.m, this.m, [x, y]);
        return this;
    }


    public rotate(r = 0): UVMatrix {
        mat3.rotate(this.m, this.m, r);
        return this;
    }

    // scale(2) => x,y * 2
    // scale(2, 3) => x * 2, y * 3

    public scale(x: number, y?: number): UVMatrix {
        if (typeof y === 'undefined') {
            y = x;
        }
        mat3.scale(this.m, this.m, [x, y]);
        return this;
    }

    public get(): mat3 {
        return this.m;
    }



}

export class Matrix {
    public m: mat4;

    constructor() {
        this.m = mat4.create();
    }

    public translate(x = 0, y = 0, z = 0): Matrix {
        mat4.translate(this.m, this.m, [x, y, z]);
        return this;
    }

    // rotates matrix _r_ radians on _axis_
    // defaults to z axis
    public rotate(r = 0, axis = [0, 0, 1]): Matrix {
        mat4.rotate(this.m, this.m, r, axis);
        return this;
    }

    // scale(2) => x,y,z * 2
    // scale(2, 3) => x * 2, y * 3, z * 1
    // scale(2, 3, 4) => x * 2, y * 3, z * 4
    public scale(x: number, y?: number, z?: number): Matrix {
        if (typeof y === 'undefined') {
            y = z = x;
        } else if (typeof z === 'undefined') {
            z = 1;
        }
        mat4.scale(this.m, this.m, [x, y, z]);
        return this;
    }

    public get(): mat4 {
        return this.m;
    }




}

