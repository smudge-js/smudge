import { PBR, Material, BlendMode, Texture, TextureInfo } from '../../pbr';
import { mat4 } from 'gl-matrix';

export async function draw() {
    let pbr = new PBR(undefined, 512, 512);

    let t = new Texture("texture_a", pbr.gl);
    await t.load("images/horizontal_burst_white_transparent.png");

    let my_material = new Material(.7, .7, .7, 1);
    my_material.textureInfo = new TextureInfo();
    my_material.textureInfo.texture = t;
    my_material.height = .01;

    let my_matrix = mat4.create();
    mat4.translate(my_matrix, my_matrix, [256, 256, 0]);
    mat4.rotateZ(my_matrix, my_matrix, 3.14 * .25);


    pbr.clear();

    pbr.rect(-50, -50, 100, 100, my_material, my_matrix);
    pbr.show();
}