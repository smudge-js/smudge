import { Material2, PBR, bindUI } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);
    // show the ui
    bindUI(pbr);

    // clear the drawing
    pbr.clear();

    // draw a rect
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [0, 0, 1];
    pbr.rect(0, 0, 200, 200, simpleBlue);



    // show albedo in ui
    pbr.show();
}


draw();
