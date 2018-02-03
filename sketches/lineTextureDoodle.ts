import { Material2, PBR, bindUI, BlendMode } from '../src/js/index';
import { Matrix } from '../src/js/draw/matrix';



export async function draw() {
    // create a pbr instance
    const pbr = new PBR(undefined, 512, 512);

    // load a texture
    const t = await pbr.loadTexture("images/soft_brush.png");
    const t2 = await pbr.loadTexture("images/nose_brush.png");

    // show the ui
    bindUI(pbr);

    // clear the drawing
    pbr.clear();

    const gradient = new Material2();
    gradient.albedo.color = [1];
    gradient.albedo.textureConfig.texture = t;
    gradient.height.color = [.004, .1];
    gradient.smoothness.color = .7;
    gradient.height.textureConfig.texture = t2;
    gradient.height.blendMode = BlendMode.Additive;



    for (let line = 0; line < 50; line++) {
        gradient.albedo.color = [Math.random(), Math.random(), Math.random(), 1];

        if (Math.random() < .1) {
            gradient.metallic.color = 1;
        } else {
            gradient.metallic.color = 0;
        }
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        let r = Math.random() * 256;
        const dR = Math.random() * 10 - 5;
        const width = Math.random() * 40 + 5;
        let a = Math.random() * 6.28;
        const segments = Math.random() * 100 + 10;
        const points = [];
        for (let i = 0; i < segments; i++) {
            a += .1;
            r += dR;
            if (r < width) {
                break;
            }
            points.push([x + Math.sin(a) * r, y + Math.cos(a) * r]);
        }
        pbr.line(points, { width, uvMode: "brush" }, gradient);


    }











    // show albedo in ui
    pbr.show();
}


draw();
