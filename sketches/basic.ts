import { Material2, PBR, BlendMode, TextureInfo } from '../src/js/index';


export async function draw() {

    const pbr = new PBR(undefined, 512, 512);
    pbr.showUI();

    const paper = new Material2();
    paper.albedo.color = .9;
    // pbr.clear(paper);

    const red = new Material2();
    red.albedo.color = [1, 0, 0];
    pbr.rect2(100, 100, 100, 100, red);

    pbr.show();

    // pbr.saveCanvasAs("test.png");
}


draw();
