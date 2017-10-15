import { PBR, Material, Material2, BlendMode, Texture, TextureInfo } from '../../pbr';

import { Matrix } from '../../matrix';

export async function draw() {

    let pbr = new PBR(undefined, 512, 512);

    let paper = new Material(.8, .8, .8, 1);
    paper.metallic = .5;
    paper.smoothness = .5;
    pbr.clear(paper);

    let mat1 = new Material(1, 0, 0, 1);
    mat1.metallic = 0;
    mat1.smoothness = 0;
    pbr.rect(0, 0, 120, 10, mat1);


    let mat2 = new Material2();
    mat2.color = [0, 1, 0, 1];
    mat2.metallic.color = 0;
    mat2.smoothness.color = 0;
    pbr.rect2(0, 30, 500, 10, mat2);

    pbr.show();
}


