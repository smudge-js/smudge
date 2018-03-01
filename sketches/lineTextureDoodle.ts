import { Material2, Smudge, SmudgeUI, BlendMode } from '../src/js/index';
// import { Matrix } from '../src/js/draw/matrix';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge(undefined, 1024, 1024);

    // load a texture
    const t = await smudge.loadTexture("images/soft_brush.png");
    const t2 = await smudge.loadTexture("images/nose_brush.png");

    // show the ui
    const ui = new SmudgeUI(smudge);


    // clear the drawing
    const c = new Material2();
    c.albedo.color = [1, 0, 0, .5];
    smudge.clear(c);

    const gradient = new Material2();
    gradient.albedo.color = [1];
    gradient.albedo.textureInfo.texture = t;
    gradient.height.color = [.004, .1];
    gradient.smoothness.color = .7;
    gradient.height.textureInfo.texture = t2;
    gradient.height.blendMode = BlendMode.Additive;



    for (let line = 0; line < 5; line++) {
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
                r = width;
            }
            points.push([x + Math.sin(a) * r, y + Math.cos(a) * r]);
        }
        console.log(segments, points);
        smudge.line(points, { width, uvMode: "brush" }, gradient);


    }











    // show albedo in ui
    smudge.show();
    ui.updatePBR();
}


draw();
