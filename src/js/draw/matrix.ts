import { mat4 } from 'gl-matrix';
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


}

