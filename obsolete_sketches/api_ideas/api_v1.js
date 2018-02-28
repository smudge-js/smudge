import {
    PBR,
    Material,
    Matrix
} from '../../pbr';


export async function draw() {
    let pbr = new PBR(512, 512);

    let burst = await pbr.loadTexture("images/horizontal_burst_white_transparent.png");


    let my_material = new Material([.7, .7, .7], 1);
    my_material.height = .01;
    my_material.albedo.textureConfig.texture = burst;

    // all at once
    my_material.setImageFile(burst);

    // my_material.albedo.color = [1, 0, 1];
    // my_material.albedo.image.color_bias = [1, 1, 1, 0];
    // my_material.albedo.image.uv_matrix = new Matrix().translate(256, 256).rotate(45);


    let my_matrix = new Matrix();
    my_matrix.translate(256, 256);
    my_matrix.rotate(rad(45));

    pbr.clear();
    pbr.rect(-50, -50, 100, 100, my_material, my_matrix);
    pbr.show();
}