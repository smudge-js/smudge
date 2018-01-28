import { Material2, PBR, bindUI } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);

    // load a texture
    const t = await pbr.loadTexture("images/checkerboard_gray_gray.png");


    // show the ui
    bindUI(pbr);

    // clear the drawing
    pbr.clear();

    // draw am ellipse
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [0, 0, 1];
    pbr.ellipse(0, 0, 200, 200, simpleBlue);





    // draw textured ellipse
    const albedoA = new Material2();
    albedoA.albedo.color = 1;
    albedoA.albedo.textureConfig.texture = t;
    pbr.ellipse(200, 0, 200, 200, albedoA);



    // show albedo in ui
    pbr.show();
}


draw();
