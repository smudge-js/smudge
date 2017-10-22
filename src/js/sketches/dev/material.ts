import { PBR, Material, Material2, BlendMode, Texture, TextureInfo } from '../../pbr';

import { Matrix } from '../../matrix';

export async function draw() {

    let pbr = new PBR(undefined, 512, 512);

    let paper = new Material(.8, .8, .8, 1);
    paper.metallic = .5;
    paper.smoothness = .5;
    pbr.clear(paper);

    let red_light = new Material2();
    red_light.albedo.color = 0;
    red_light.emission.color = [1, 0, 0, 1];
    pbr.rect2(10, 10, 10, 10, red_light);

    let matte_spray = new Material2();
    matte_spray.smoothness.color = .2;
    pbr.rect2(10, 30, 100, 100, matte_spray);


    let gold_foil = new Material2();
    gold_foil.albedo.color = [.4, .4, 0];
    gold_foil.smoothness.color = .8;
    gold_foil.height.color = .1;
    pbr.rect2(10, 140, 100, 100, gold_foil);

    pbr.show();
}


