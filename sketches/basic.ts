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
    smudge.rect(0, 0, 200, 200, simpleBlue);


    // show albedo in ui
    smudge.show();
    ui.updatePBR();
}


draw();
