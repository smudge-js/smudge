import { Material2, Smudge, SmudgeUI, BlendMode } from '../src/js/index';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);

    // show the ui
    const ui = new SmudgeUI(smudge);

    // clear the drawing
    smudge.clear();

    // draw a rect
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [.5, .5, 1];
    simpleBlue.height.color = .02;

    smudge.rect(0, 0, 200, 200, simpleBlue);

    const addRed = new Material2();
    addRed.albedo.color = [1, .5, .5, 1];
    // addRed.albedo.blendMode = BlendMode.Lightest;
    addRed.height.color = .02;
    addRed.height.blendMode = BlendMode.Additive;
    smudge.rect(100, 100, 200, 200, addRed);
    smudge.rect(150, 150, 200, 200, addRed);

    // show albedo in ui
    smudge.show();
    ui.updatePBR();
}


draw();
