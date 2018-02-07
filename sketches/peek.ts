import { Material2, PBR, SmudgeUI } from '../src/js/index';




export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);
    // show the ui
    const ui = new SmudgeUI(pbr);

    // clear the drawing
    pbr.clear();

    // draw a rect
    const simpleMaterial = new Material2();

    for (let i = 0; i < 1000; i++) {
        simpleMaterial.albedo.color = [Math.random(), .5];
        pbr.rect(Math.random() * 412, Math.random() * 412, 100, 100, simpleMaterial);

        if (i % 100 === 0) {
            await pbr.show();
            await ui.updatePBR();
        }
    }


    // show albedo in ui
    pbr.show();
    ui.updatePBR();
}


draw();
