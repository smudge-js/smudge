import { Material2, PBR, SmudgeUI, BlendMode } from '../src/js/index';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);

    // load a texture
    const t = await pbr.loadTexture("images/soft_brush.png");
    const t2 = await pbr.loadTexture("images/nose_brush.png");

    // show the ui
    const ui = new SmudgeUI(pbr);

    // clear the drawing
    pbr.clear();

    const gradient = new Material2();
    gradient.albedo.color = [1, .9];
    gradient.albedo.textureConfig.texture = t;
    gradient.height.color = [.01, .5];
    gradient.height.textureConfig.texture = t2;
    gradient.height.blendMode = BlendMode.Additive;


    const line = [];
    line.push([50, 50]);
    line.push([256, 512 - 50]);
    line.push([512 - 50, 50]);
    line.push([50, 300]);

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
    line2.push([100, 400]);


    pbr.line(line2, { width: 30, uvMode: "brush" }, gradient);






    // show albedo in ui
    pbr.show();
    ui.updatePBR();
}


draw();
