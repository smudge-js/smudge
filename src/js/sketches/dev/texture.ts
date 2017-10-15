import { PBR, Material, BlendMode, Texture, TextureInfo } from '../../pbr';

import { Matrix } from '../../matrix';

export async function draw() {

    let pbr = new PBR(undefined, 512, 512);

    let paper = new Material(.9, .9, .9, 1);
    pbr.clear(paper);

    let t = await pbr.loadTexture("images/a.png");

    let my_material = new Material(1, 0, 0, 1);
    my_material.textureInfo = new TextureInfo();
    my_material.textureInfo.texture = t;

    pbr.rect(10, 10, 200, 200, my_material);

    pbr.show();
}


