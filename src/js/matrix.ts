import { mat4 } from 'gl-matrix';
export class Matrix {
    m: mat4;

    constructor() {
        this.m = mat4.create();
    }

    translate(x = 0, y = 0, z = 0): Matrix {
        mat4.translate(this.m, this.m, [x, y, z]);
        return this;
    }

    rotate(r = 0): Matrix {
        mat4.rotateZ(this.m, this.m, r);
        return this;
    }
}

