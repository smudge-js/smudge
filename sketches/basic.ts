import { Material2, PBR, bindUI } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);
    // show the ui
    bindUI(pbr);


    // clear the drawing
    pbr.clear();

    // create a material
    const red = new Material2();
    red.albedo.color = [1, 0, 0];

    // draw a rect
    pbr.rect2(100, 100, 200, 200, red);

    // show albedo in ui
    pbr.show();
}


draw();
