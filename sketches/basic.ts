import { PBR, BlendMode, TextureInfo } from '../src/js/index';
import { Material2 } from '../src/js/material/material';


export async function draw() {

    const pbr = new PBR(undefined, 512, 512);

    const paper = new Material2();
    paper.albedo.color = .9;
    // pbr.clear(paper);

    const red = new Material2();
    red.albedo.color = [.9, .9, .9];
    pbr.rect2(100, 100, 100, 100, red);

    pbr.show();
}


draw();