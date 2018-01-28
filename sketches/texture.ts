import { Material2, PBR, bindUI } from '../src/js/index';
import { UVMatrix } from '../src/js/draw';


export async function draw() {

    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);

    // load a texture
    const t = await pbr.loadTexture("images/a.png");

    // show the ui
    bindUI(pbr);



    // clear the drawing
    const paper = new Material2();
    paper.albedo.color = .5;
    pbr.clear();

    // draw textured rect
    const albedoA = new Material2();
    albedoA.albedo.color = 1;
    albedoA.albedo.textureConfig.texture = t;
    pbr.rect2(0, 0, 200, 200, albedoA);

    // draw texture to another material prop
    const smoothnessA = new Material2();
    smoothnessA.smoothness.color = 1;
    smoothnessA.smoothness.textureConfig.texture = t;
    pbr.rect2(200, 0, 200, 200, smoothnessA);


    // manipulate texture colors
    const albedoColorize = new Material2();
    albedoColorize.albedo.color = 1;
    albedoColorize.albedo.textureConfig.texture = t;
    albedoColorize.albedo.textureConfig.colorBias = [1, 1, 1, 0];
    albedoColorize.albedo.textureConfig.colorMatrix = [
        -1, 0, 0, 0,
        0, -.5, 0, 0,
        0, 0, -1, 0,
        0, 0, 0, 1,
    ];
    pbr.rect2(0, 200, 200, 200, albedoColorize);


    // transform texture
    const transformA = new Material2();
    transformA.albedo.color = 1;
    transformA.albedo.textureConfig.texture = t;



    transformA.albedo.textureConfig.uvMatrix = new UVMatrix().translate(.5, .5).rotate(3.14 * .25).scale(2).translate(-.5, -.5).get();



    pbr.rect2(200, 200, 200, 200, transformA);




    // show albedo in ui
    pbr.show();
}


draw();
