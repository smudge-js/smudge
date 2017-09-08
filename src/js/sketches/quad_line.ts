import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';

export function draw() {
    let pbr = new PBR(undefined, 512, 512);
    // pbr.clear();

    console.log(Material.white);

    pbr.clear(Material.white);


    let redPaint = new Material();
    redPaint.red = 1;
    redPaint.green = .2;
    redPaint.blue = 0;
    redPaint.transparency = 1;
    redPaint.metallic = .5;



    let greenPaint = new Material(0, 1, 0, 1);

    pbr.rect(10, 10, 100, 100, redPaint);

    pbr.quad([
        [10, 210],
        [10, 300],
        [150, 350],
        [100, 210],
    ], redPaint);

    // let m = mat4.create();
    // mat4.translate(m, m, [55, 55, 0]);
    // mat4.rotateZ(m, m, 3.1415 * .25);
    // mat4.translate(m, m, [-55, -55, 0]);


    pbr.line([
        [10, 10],
        [110, 10],
        [110, 110],
        [10, 110]

    ], { width: 10, align: 'center', close: true }, greenPaint);


    pbr.line([[200, 200], [250, 300]], { width: 10, close: true }, greenPaint);
    pbr.show();
}
