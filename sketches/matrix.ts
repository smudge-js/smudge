import { Material2, PBR, SmudgeUI } from '../src/js/index';
import { Matrix } from '../src/js/draw';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);
    const ui = new SmudgeUI(pbr);


    // clear the drawing
    pbr.clear();

    // create a material
    const red = new Material2();
    red.albedo.color = [1, 0, 0];

    // draw a translated, rotated, scaled rect
    const myMatrix = new Matrix().translate(256, 256).rotate(3.14 * .25).scale(.5);
    pbr.rect(-256, -256, 512, 512, red, myMatrix);

    // show albedo in ui
    pbr.show();
    ui.updatePBR();
}


draw();
