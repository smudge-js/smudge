import { PBR, Material, BlendMode } from '../pbr';
import { mat4 } from 'gl-matrix';

export function draw() {
    let pbr = new PBR(undefined, 512, 512);

    let blue = new Material(1, 0, 0, 1);
    pbr.clear(blue);


    let yellow = new Material();
    yellow.red = 1;
    yellow.green = 1;
    yellow.blue = 0;
    yellow.transparency = 1;
    yellow.metallic = .5;
    yellow.smoothness = .5;
    yellow.height = 1;
    yellow.emission_green = 1;


    pbr.rect(10, 10, 100, 100, yellow);
    pbr.show();
}
