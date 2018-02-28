import { PBR, Material, BlendMode, Texture, TextureInfo } from '../../src/js/index';

import { Matrix } from '../../src/js/draw/matrix';

export async function draw() {

    let pbr = new PBR(undefined, 512, 512);

    let paper = new Material(.9, .9, .9, 1);
    pbr.clear(paper);

    let red = new Material(1, 0, 0, 1);

    let my_matrix = new Matrix().translate(256, 246).rotate(3.14 * .25).scale(.5);

    pbr.rect(-45, -45, 90, 90, red, my_matrix);

    pbr.show();
}


