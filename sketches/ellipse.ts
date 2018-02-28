import { Material2, Smudge, SmudgeUI } from '../src/js/index';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);
    const ui = new SmudgeUI(smudge);

    // load a texture
    const t = await smudge.loadTexture("images/checkerboard_gray_gray.png");



    // clear the drawing
    smudge.clear();

    // draw am ellipse
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [0, 0, 1];
    smudge.ellipse(0, 0, 200, 200, simpleBlue);

    smudge.ellipse(0, 300, 200, 200, simpleBlue, undefined, 6);




    // draw textured ellipse
    const albedoA = new Material2();
    albedoA.albedo.color = 1;
    albedoA.albedo.textureInfo.texture = t;
    smudge.ellipse(200, 0, 200, 200, albedoA);



    // show albedo in ui
    smudge.show();
    ui.updatePBR();
}


draw();
