import { PBR, Material, BlendMode, Texture, TextureInfo } from '../../pbr';
import { mat4 } from 'gl-matrix';

export async function draw() {

    let pbr = new PBR(undefined, 512, 512);

    const clear = new Material(.5, .5, .5, 1.0, 0.0, 0.0, .5);
    const red = new Material(1.0, 0.0, 0.0, .25, 0.0, 0.0, 0.0);
    const green = new Material(0.0, 1.0, 0.0, .25, 0.0, 1.0, 1.0);


    pbr.clear(clear);

    for (let i = 0; i < 100; i++) {
        let x = random(10, 502);
        let y = random(10, 502);
        pbr.rect(x - 5, y - 5, 30, 30, red);
    }

    for (let i = 0; i < 100; i++) {
        let x = random(10, 502);
        let y = random(10, 502);
        pbr.rect(x - 5, y - 5, 30, 30, green);
    }
}

function random(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
}
