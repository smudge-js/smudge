import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';

export function draw() {
    let pbr = new PBR(undefined, 512, 512);

    let paper = new Material(.9, .9, .9, .9);
    paper.metallic = 0;
    paper.smoothness = .1;


    let blue_paint = new Material(.2, .2, .8, 1);
    blue_paint.smoothness = .6;
    blue_paint.metallic = .25;

    let gold_leaf = new Material();
    gold_leaf.red = .8;
    gold_leaf.green = .8;
    gold_leaf.blue = .1;
    gold_leaf.transparency = 1;
    gold_leaf.metallic = 1;
    gold_leaf.smoothness = 1;
    gold_leaf.height = .1;

    let green_felt = new Material(.1, .9, .2, 1);
    green_felt.metallic = 0;
    green_felt.smoothness = 0;
    green_felt.height = .5;

    let red_light = new Material(.2, .2, .2, 1);
    red_light.metallic = 1;
    red_light.smoothness = 1;
    red_light.height = .2;
    red_light.emission_red = .9;


    pbr.clear(paper);
    pbr.rect(0, 0, 90, 90, gold_leaf);
    pbr.rect(0, 100, 90, 90, blue_paint);
    pbr.rect(0, 200, 90, 90, green_felt);
    pbr.rect(0, 300, 90, 90, red_light);


    pbr.show();
}


//  pbr.show();
//         await resolveQuickly();
// function resolveQuickly() {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve();
//         }, 1);
//     });
// }