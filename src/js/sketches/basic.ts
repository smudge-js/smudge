import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';

export function draw() {
    let pbr = new PBR(undefined, 512, 512);

    let white = new Material(1, 1, 1, .9);

    let red = new Material(1, 0, 0, .9);
    red.metallic = 1;
    red.smoothness = 0;

    let blue = new Material(0, 0, 1, .9);

    let yellow = new Material();
    yellow.red = .95;
    yellow.green = 1;
    yellow.blue = 0;
    yellow.transparency = .9;
    yellow.metallic = 1;
    yellow.smoothness = 0;
    yellow.height = 1;
    yellow.emission_green = 1;

    pbr.clear(red);
    pbr.rect(100, 100, 100, 100, blue);
    pbr.rect(200, 100, 100, 100, white);

    pbr.rect(10, 10, 100, 100, yellow);
    pbr.rect(400, 400, 100, 100, yellow);

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