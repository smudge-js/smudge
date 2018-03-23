import { Material2, Smudge, SmudgeUI } from '../src/js/index';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);
    // show the ui
    const ui = new SmudgeUI(smudge, {
        show2D: true,
        show3D: true,
        combine2D3D: false,
        showChannelButtons: true,
        showExportButtons: true,
        targetElement: document.getElementById("ui-target1"),
    });

    // clear the drawing
    smudge.clear();

    // draw a rect
    const demoMaterial = new Material2();
    demoMaterial.albedo.color = [.25, .25, .25];
    demoMaterial.emission.color = [1, 0, 0];
    demoMaterial.height.color = .1;
    demoMaterial.metallic.color = .1;
    demoMaterial.smoothness.color = .9;

    smudge.rect(100, 100, 312, 312, demoMaterial);


    // show albedo in ui
    ui.update2D('albedo');
    ui.update3D();
    ui.show3D();
}


draw();
