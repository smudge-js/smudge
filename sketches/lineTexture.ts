import { Material2, PBR, bindUI } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);

    // load a texture
    const t = await pbr.loadTexture("images/checkerboard_white_gray.png");

    // show the ui
    bindUI(pbr);

    // clear the drawing
    pbr.clear();

    const gradient = new Material2();
    gradient.albedo.color = 1;
    gradient.albedo.textureConfig.texture = t;


    const line = [];
    line.push([50, 50]);
    line.push([256, 512 - 50]);
    line.push([512 - 50, 50]);
    line.push([400, 100]);

    pbr.line(line, { width: 30, uvMode: "brush" }, gradient);

    const line2 = [];
    line2.push([50, 400]);
    // line2.push([55, 400]);
    line2.push([60, 400]);
    // line2.push([65, 400]);
    line2.push([70, 400]);
    // line2.push([75, 400]);
    line2.push([80, 400]);
    // line2.push([85, 400]);
    line2.push([90, 400]);


    pbr.line(line2, { width: 30, uvMode: "brush" }, gradient);






    // show albedo in ui
    pbr.show();
}


draw();
