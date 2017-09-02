import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';

export function draw() {
    let pbr = new PBR(undefined, 512, 512);
    pbr.clear();

    let redPaint = new Material();
    redPaint.red = 1;
    redPaint.green = 0;
    redPaint.blue = 0;
    redPaint.transparency = 1;
    redPaint.metallic = .5;


    pbr.rect(10, 10, 100, 100, redPaint);
    pbr.show();
}
