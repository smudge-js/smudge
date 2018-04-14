import { Material2, Smudge, SmudgeUI } from '../src/js/index';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);
    // show the ui
    const ui = new SmudgeUI(smudge);
    // clear the drawing
    smudge.clear();



    // basic blue color with no extended material properties
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [0, 0, 1];
    smudge.rect(0, 0, 200, 200, simpleBlue);

    // a glossy material with no color, just smoothness
    const glossSpray = new Material2();
    glossSpray.smoothness.color = .9;
    smudge.rect(0, 100, 100, 100, glossSpray);

    // a matte material with no color, just smoothness
    const matteSpray = new Material2();
    matteSpray.smoothness.color = .2;
    smudge.rect(100, 100, 100, 100, matteSpray);

    // basic blue color with max metallic
    const metallicBlue = new Material2();
    metallicBlue.albedo.color = [0, 0, 1];
    metallicBlue.metallic.color = 1;
    smudge.rect(200, 0, 200, 200, metallicBlue);

    // height to do some bump mapping, fake some variation in height
    const embossedGray = new Material2();
    embossedGray.albedo.color = .5;
    embossedGray.height.color = .1;
    smudge.rect(10, 210, 180, 180, embossedGray);

    embossedGray.albedo.color = .5;
    embossedGray.height.color = .15;
    smudge.rect(20, 220, 160, 160, embossedGray);

    embossedGray.albedo.color = .5;
    embossedGray.height.color = .2;
    smudge.rect(30, 230, 140, 140, embossedGray);

    // emission to make things that glow in the dark
    const redLight = new Material2();
    redLight.albedo.color = 0;
    redLight.emission.color = [1, 0, 0, 1];
    smudge.rect(210, 210, 180, 180, redLight);

    // default channel is used for any unset channels
    const defaultDemo = new Material2();
    defaultDemo.default.color = .5;
    defaultDemo.albedo.color = [0, 1, 0, 1];
    smudge.rect(10, 410, 180, 20, defaultDemo);

    // show albedo in ui
    ui.update3D();
    ui.update3D();
}


draw();
