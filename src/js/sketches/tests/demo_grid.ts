import { PBR, Material, BlendMode, Texture, TextureInfo } from '../../index';
import { mat4 } from 'gl-matrix';

export async function draw() {

    let pbr = new PBR(undefined, 512, 512);
    const clear = new Material(0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 0.5);


    const odd = new Material(0.3, 0.3, 0.3, 1.0);
    odd.height = .4;
    odd.metallic = 0;
    odd.smoothness = 1.0;

    const even = new Material(0.9, 0.1, 0.1, 1.0);
    even.height = .6;
    even.metallic = 0.0;
    even.smoothness = 0;

    let cols = 10;
    let rows = 10;
    let i = 0;
    for (let y = 0; y < 512; y += 512 / rows) {
        for (let x = 0; x < 512; x += 512 / cols) {
            let mat = i++ % 2 ? odd : even;

            pbr.rect(x + 3, y + 3, 512 / cols - 6, 512 / rows - 6, mat);
        }
    }


}
