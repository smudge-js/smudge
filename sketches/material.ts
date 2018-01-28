import { Material2, PBR, bindUI } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);
    // show the ui
    bindUI(pbr);
    // clear the drawing
    pbr.clear();



    // basic blue color with no extended material properties
    const simpleBlue = new Material2();
    simpleBlue.albedo.color = [0, 0, 1];
    pbr.rect(0, 0, 200, 200, simpleBlue);

    // a glossy material with no color, just smoothness
    const glossSpray = new Material2();
    glossSpray.smoothness.color = .9;
    pbr.rect(0, 100, 100, 100, glossSpray);

    // a matte material with no color, just smoothness
    const matteSpray = new Material2();
    matteSpray.smoothness.color = .2;
    pbr.rect(100, 100, 100, 100, matteSpray);

    // basic blue color with max metallic
    const metallicBlue = new Material2();
    metallicBlue.albedo.color = [0, 0, 1];
    metallicBlue.metallic.color = 1;
    pbr.rect(200, 0, 200, 200, metallicBlue);

    // height to do some bump mapping, fake some variation in height
    const embossedGray = new Material2();
    embossedGray.albedo.color = .5;
    embossedGray.height.color = .1;
    pbr.rect(10, 210, 180, 180, embossedGray);

    // emission to make things that glow in the dark
    const redLight = new Material2();
    redLight.albedo.color = 0;
    redLight.emission.color = [1, 0, 0, 1];
    pbr.rect(210, 210, 180, 180, redLight);

    // default channel is used for any unset channels
    const defaultDemo = new Material2();
    defaultDemo.default.color = .5;
    defaultDemo.albedo.color = [0, 1, 0, 1];
    pbr.rect(10, 410, 180, 80, defaultDemo);

    // show albedo in ui
    pbr.show();
}


draw();
