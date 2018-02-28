import { PBR, Material, BlendMode, Texture, TextureInfo } from '../../src/js/index';
import { mat4 } from 'gl-matrix';

export async function draw() {

    let pbr = new PBR(undefined, 1024, 1024);

    const metal = new Material(0.5, 0.5, 0.5, 1.0, 0.5, 0.25, 0.5);
    const panel = new Material(0.5, 0.5, 0.5, 1.0, 0.4, 0.25, 0.5);
    const light_off = new Material(.5, 0.0, 0.0, 1.0, .6);
    const light_on = new Material(.5, 0.0, 0.0, 1.0, .6);
    light_on.emission_red = 1.0;
    light_on.emission_green = .2;
    light_on.emission_blue = .1;


    pbr.clear(metal);

    let rows = 32;
    let cols = 16;
    let padding = 2;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let width = pbr.width / cols;
            let height = pbr.height / rows;
            let x = col * width;
            let y = row * height;

            pbr.rect(x + padding, y + padding, width - padding * 2, height - padding * 2, panel);

            if (Math.random() > .75) {
                pbr.rect(x + padding * 2, y + padding * 2, width - padding * 4, height - padding * 4, light_on);
            } else {
                pbr.rect(x + padding * 2, y + padding * 2, width - padding * 4, height - padding * 4, light_off);
            }

        }
    }

    pbr.show();
}
