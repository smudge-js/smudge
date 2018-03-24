import { Material2, Smudge, SmudgeUI, UVMatrix } from '../src/js/index';



export async function draw() {

    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);

    // load resources


    // show the ui
    const ui = new SmudgeUI(smudge, { environmentMapPath: "/images/environment_studio.jpg" });



    // clear the drawing
    smudge.clear();

    // draw a rect
    const mat = new Material2();
    mat.albedo.color = 1;
    mat.smoothness.color = 1;
    mat.metallic.color = 1;

    smudge.rect(10, 10, 492, 250, mat);

    mat.metallic.color = 0;
    smudge.rect(10, 270, 492, 200, mat);


    // show albedo in ui
    ui.update2D();
    ui.update3D();
}


draw();
