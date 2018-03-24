import { Material2, Smudge, SmudgeUI } from '../src/js/index';


// demonstrates how to show work in progress on a long rendering sketch


export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);
    // show the ui
    const ui = new SmudgeUI(smudge);

    // clear the drawing
    smudge.clear();

    // draw a rect
    const simpleMaterial = new Material2();

    for (let i = 0; i < 1000; i++) {
        simpleMaterial.albedo.color = [Math.random(), .5];
        smudge.rect(Math.random() * 412, Math.random() * 412, 100, 100, simpleMaterial);

        if (i % 100 === 0) {
            await smudge.show();
            await ui.update3D();
        }
    }


    // show albedo in ui
    smudge.show();
    ui.update3D();
}


draw();
