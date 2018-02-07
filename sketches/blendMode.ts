import { Material2, PBR, SmudgeUI, BlendMode } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);

    // show the ui
    const ui = new SmudgeUI(pbr);

    // clear the drawing
    pbr.clear();

    // draw a rect
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [.5, .5, 1];
    simpleBlue.height.color = .02;

    pbr.rect(0, 0, 200, 200, simpleBlue);

    const addRed = new Material2();
    addRed.albedo.color = [1, .5, .5, 1];
    addRed.albedo.blendMode = BlendMode.Lightest;
    addRed.height.color = .02;
    addRed.height.blendMode = BlendMode.Additive;
    pbr.rect(100, 100, 200, 200, addRed);
    pbr.rect(150, 150, 200, 200, addRed);

    // show albedo in ui
    pbr.show();
    ui.updatePBR();
}


draw();
