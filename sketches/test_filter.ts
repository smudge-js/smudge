import { Material2, Smudge, SmudgeUI, UVMatrix } from '../src/js/index';



export async function draw() {

    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);

    // load resources
    const noise = await smudge.loadTexture("images/gaussian_noise.png");

    // show the ui
    const ui = new SmudgeUI(smudge);



    // clear the drawing
    smudge.clear();

    // draw a rect
    const mat = new Material2();
    mat.albedo.color = [1, 1, 1];
    mat.albedo.textureInfo.texture = noise;
    mat.albedo.textureInfo.uvMatrix = new UVMatrix().scale(.025, .025).get();


    smudge.rect(10, 10, 492, 492, mat);


    // show albedo in ui
    smudge.show();
    ui.update3D();
}


draw();
