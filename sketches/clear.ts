import { Material2, PBR, bindUI } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);
    // show the ui
    bindUI(pbr);


    // clear the drawing
    const paper = new Material2();
    paper.albedo.color = .9;
    paper.smoothness.color = .3;
    pbr.clear(paper);

    // show albedo in ui
    pbr.show();
}


draw();
