import { Material2, Smudge, SmudgeUI } from '../src/js/index';
// import { Matrix } from '../src/js/draw/matrix';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 256, 256);

    // load a texture
    const gradient = await smudge.loadTexture("images/black_white.png");

    // show the ui
    const ui = new SmudgeUI(smudge);


    // clear the drawing
    const c = new Material2();
    c.albedo.color = [.5, .5, .5, 1];
    smudge.clear(c);

    const gradientMaterial = new Material2();

    // base
    gradientMaterial.albedo.color = [1];
    gradientMaterial.albedo.textureInfo.texture = gradient;
    gradientMaterial.metallic.color = [1];
    gradientMaterial.metallic.textureInfo.texture = gradient;
    gradientMaterial.smoothness.color = [1];
    gradientMaterial.smoothness.textureInfo.texture = gradient;
    gradientMaterial.height.color = [1];
    gradientMaterial.height.textureInfo.texture = gradient;


    // ldr

    // gray
    gradientMaterial.albedo.color = [1, 1, 1, 1];
    smudge.rect(0, 0, 256, 10, gradientMaterial);

    // red
    gradientMaterial.albedo.color = [1, 0, 0, 1];
    smudge.rect(0, 10, 256, 10, gradientMaterial);

    // green
    gradientMaterial.albedo.color = [0, 1, 0, 1];
    smudge.rect(0, 20, 256, 10, gradientMaterial);

    // blue
    gradientMaterial.albedo.color = [0, 0, 1, 1];
    smudge.rect(0, 30, 256, 10, gradientMaterial);


    // hdr
    gradientMaterial.height.color = [10];

    // hdr gray
    gradientMaterial.albedo.color = [10, 10, 10, 1];
    smudge.rect(0, 40, 256, 10, gradientMaterial);

    // hdr red
    gradientMaterial.albedo.color = [10, 0, 0, 1];
    smudge.rect(0, 50, 256, 10, gradientMaterial);

    // hdr green
    gradientMaterial.albedo.color = [0, 10, 0, 1];
    smudge.rect(0, 60, 256, 10, gradientMaterial);

    smudge.rect(0, 128, 256, 64, gradientMaterial);

    // hdr blue
    gradientMaterial.albedo.color = [0, 0, 10, 1];
    smudge.rect(0, 70, 256, 10, gradientMaterial);



    // float
    gradientMaterial.height.color = [.1];

    // float gray
    gradientMaterial.albedo.color = [.1, .1, .1, 1];
    smudge.rect(0, 80, 256, 10, gradientMaterial);

    // float red
    gradientMaterial.albedo.color = [.1, 0, 0, 1];
    smudge.rect(0, 90, 256, 10, gradientMaterial);

    // float green
    gradientMaterial.albedo.color = [0, .1, 0, 1];
    smudge.rect(0, 100, 256, 10, gradientMaterial);

    // float blue
    gradientMaterial.albedo.color = [0, 0, .1, 1];
    smudge.rect(0, 110, 256, 10, gradientMaterial);

    const swatchMat = new Material2();
    swatchMat.albedo.color = [.5, 1, 2, 1];
    smudge.rect(0, 0, 10, 10, swatchMat);


    // show albedo in ui
    ui.update3D();
    ui.update3D();
}


draw();
