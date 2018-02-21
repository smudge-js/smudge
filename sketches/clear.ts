import { Material2, Smudge, SmudgeUI } from '../src/js/index';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 512, 512);
    // show the ui
    const ui = new SmudgeUI(smudge);


    // clear the drawing
    const paper = new Material2();
    paper.albedo.color = .9;
    paper.smoothness.color = .3;
    smudge.clear(paper);

    // show albedo in ui
    smudge.show();
    ui.updatePBR();
}


draw();
