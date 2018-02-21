import { Material2, Smudge, SmudgeUI } from '../src/js/index';
import { Matrix } from '../src/js/draw';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);
    const ui = new SmudgeUI(smudge);


    // clear the drawing
    smudge.clear();

    // create a material
    const red = new Material2();
    red.albedo.color = [1, 0, 0];

    // draw a translated, rotated, scaled rect
    const myMatrix = new Matrix().translate(256, 256).rotate(3.14 * .25).scale(.5);
    smudge.rect(-256, -256, 512, 512, red, myMatrix);

    // show albedo in ui
    smudge.show();
    ui.updatePBR();
}


draw();
