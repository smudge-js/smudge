import { Material2, Smudge, SmudgeUI, BlendMode } from '../src/js/index';
// import { Matrix } from '../src/js/draw/matrix';



export async function draw() {
    // create a smudge instance
    const smudge = new Smudge("arcs", 512, 512);

    // load a texture
    const circleBrush = await smudge.loadTexture("images/circle_brush.png");

    // show the ui
    const ui = new SmudgeUI(smudge);


    // clear the drawing
    const clearMat = new Material2();
    clearMat.albedo.color = [.5, 1];
    smudge.clear(clearMat);

    const arcMat = new Material2();
    arcMat.albedo.color = [1, 1];
    arcMat.albedo.textureInfo.texture = circleBrush;
    arcMat.albedo.textureInfo.colorMatrix = [
        1, 1, 1, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ];


    arcMat.height.color = [.01, .1];
    arcMat.height.textureInfo.texture = circleBrush;
    arcMat.height.blendMode = BlendMode.Additive;

    arcMat.smoothness.color = [1, 1];
    arcMat.smoothness.textureInfo.texture = circleBrush;
    arcMat.smoothness.textureInfo.colorMatrix = [
        1, 1, 1, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ];
    arcMat.height.blendMode = BlendMode.Blend;

    arcMat.metallic.color = 1;
    arcMat.metallic.textureInfo.texture = circleBrush;
    arcMat.metallic.textureInfo.colorMatrix = [
        1, 1, 1, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ];

    for (let line = 0; line < 20; line++) {
        // choose material
        arcMat.albedo.color = [Math.random(), Math.random(), Math.random(), 1];

        if (Math.random() < .25) {
            arcMat.metallic.color = 1;
            arcMat.albedo.color = [1, 1];
        } else {
            arcMat.metallic.color = 0;
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

        smudge.line(points, { width, uvMode: "brush" }, arcMat);
    }



    arcMat.metallic.color = 0;
    arcMat.albedo.color = [.5, .1, .1, 1];
    smudge.rect(10, 10, 50, 50, arcMat);

    arcMat.albedo.color = [1, .1, .1, 1];
    smudge.rect(60, 10, 50, 50, arcMat);


    arcMat.albedo.color = [1.5, .1, .1, 1];
    smudge.rect(110, 10, 50, 50, arcMat);

    arcMat.albedo.color = [2, .1, .1, 1];
    smudge.rect(160, 10, 50, 50, arcMat);


    arcMat.albedo.color = [10, .1, .1, 1];
    smudge.rect(210, 10, 50, 50, arcMat);







    // show albedo in ui
    smudge.show();
    ui.update3D();
}


draw();
