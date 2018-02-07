import { Material2, PBR, SmudgeUI } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);

    // load a texture
    const t = await pbr.loadTexture("images/horizontal_burst_white_transparent.png");



    // show the ui
    const ui = new SmudgeUI(pbr);

    // clear the drawing
    pbr.clear();

    // draw a rect
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [0, 0, 1];

    const gradient = new Material2();
    gradient.albedo.color = 1;
    gradient.albedo.textureConfig.texture = t;

    const heightGradient = new Material2();
    // heightGradient.albedo.color = .5;
    heightGradient.smoothness.color = 1;
    heightGradient.smoothness.textureConfig.texture = t;



    let line = [];
    line.push([10, 10]);
    line.push([100, 200]);
    line.push([190, 10]);
    pbr.line(line, 10, simpleBlue);


    line = [];
    line.push([210, 10]);
    line.push([300, 200]);
    line.push([390, 10]);
    pbr.line(line, { width: 20, close: true, align: 'left' }, simpleBlue);


    line = [];
    line.push([10, 210]);
    line.push([100, 400]);
    line.push([190, 210]);
    pbr.line(line, 30, gradient);


    line = [];
    line.push([210, 210]);
    line.push([300, 400]);
    line.push([390, 210]);
    pbr.line(line, 50, heightGradient);




    // show albedo in ui
    pbr.show();
    ui.updatePBR();
}


draw();
