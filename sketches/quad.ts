import { Material2, Smudge, SmudgeUI } from '../src/js/index';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);
    // show the ui
    const ui = new SmudgeUI(smudge);

    // clear the drawing
    smudge.clear();

    // draw a rect
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [0, 0, 1];

    const quad = [];
    quad.push([50, 50]);
    quad.push([190, 10]);
    quad.push([140, 140]);
    quad.push([10, 190]);

    smudge.quad(quad, simpleBlue);



    // show albedo in ui
    smudge.show();
    ui.update3D();
}


draw();
