import { Material2, Smudge, SmudgeUI } from '../src/js/index';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);

    // load a texture
    const t = await smudge.loadTexture("images/horizontal_burst_white_transparent.png");



    // show the ui
    const ui = new SmudgeUI(smudge);

    // clear the drawing
    smudge.clear();

    // draw a rect
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [0, 0, 1];

    const gradient = new Material2();
    gradient.albedo.color = 1;
    gradient.albedo.textureInfo.texture = t;

    const heightGradient = new Material2();
    // heightGradient.albedo.color = .5;
    heightGradient.smoothness.color = 1;
    heightGradient.smoothness.textureInfo.texture = t;



    let line = [];
    line.push([10, 10]);
    line.push([100, 200]);
    line.push([190, 10]);
    smudge.line(line, 10, simpleBlue);


    line = [];
    line.push([210, 10]);
    line.push([300, 200]);
    line.push([390, 10]);
    smudge.line(line, { width: 20, close: true, align: 'left' }, simpleBlue);


    line = [];
    line.push([10, 210]);
    line.push([100, 400]);
    line.push([190, 210]);
    smudge.line(line, 30, gradient);


    line = [];
    line.push([210, 210]);
    line.push([300, 400]);
    line.push([390, 210]);
    smudge.line(line, 50, heightGradient);




    // show albedo in ui
    ui.update3D();
    ui.update3D();
}


draw();
