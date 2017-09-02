import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';

export function draw() {
    let pbr = new PBR(undefined, 512, 512);



    //cross stich

    let clothBase = new Material();
    clothBase.red = 24/255;
    clothBase.green = 148/255;
    clothBase.blue = 206/255;
    clothBase.transparency = .5;
    // clothBase.metallic = 0;
    // clothBase.smoothness = .6;
    // clothBase.height = .3;

    pbr.clear(clothBase);

    let blueStitch = new Material();
    blueStitch.red = 24/255;
    blueStitch.green = 148/255;
    blueStitch.blue = 206/255;
    blueStitch.transparency = 1;
    blueStitch.metallic = .3;
    blueStitch.smoothness = .6;
    blueStitch.height = .3;

    let brownStitch = new Material();
    brownStitch.red = 102/255;
    brownStitch.green = 58/255;
    brownStitch.blue = 27/255;
    brownStitch.transparency = 1;
    brownStitch.metallic = .3;
    brownStitch.smoothness = .6;
    brownStitch.height = .3;

    pbr.line([
        [50, 50],
        [50, 200]
    ], 10, blueStitch);

    pbr.line([
        [100, 50],
        [100, 200]
    ], 10, brownStitch);
    /*
    let redPaint = new Material();
    redPaint.red = 1;
    redPaint.green = .2;
    redPaint.blue = 0;
    redPaint.transparency = 1;
    redPaint.metallic = .5;
    redPaint.smoothness = .5;

    let greenPaint = new Material(0, 1, 0, 1);

    pbr.rect(10, 10, 100, 100, redPaint);

    pbr.quad([
        [10, 210],
        [10, 300],
        [150, 350],
        [100, 210],
    ], redPaint);

    let m = mat4.create();
    mat4.translate(m, m, [55, 55, 0]);
    mat4.rotateZ(m, m, 3.1415 * .25);
    mat4.translate(m, m, [-55, -55, 0]);

    pbr.line([
        [10, 10],
        [110, 10],
        [110, 110],
        [10, 110]

    ], 10, greenPaint, m);
*/
    pbr.show();
}
