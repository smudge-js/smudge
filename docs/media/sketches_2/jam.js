{
    const { Material2, Smudge, SmudgeUI, BlendMode, UVMatrix, Matrix } = smudge;
    const uiTarget = document.getElementById(document.currentScript.dataset.uiTarget);


    async function draw() {
        // create a smudge instance
        const smudge = new Smudge(undefined, 512, 512);

        // show the ui
        const ui = new SmudgeUI(smudge, {
            targetElement: uiTarget,
            environmentMapPath: "/smudge/media/smudge/images/environment_studio.jpg"
        });



        const t2 = await smudge.loadTexture("/smudge/media/smudge/images/nose_brush.png");

        // clear the drawing
        smudge.clear();

        const flatGray = new Material2();
        flatGray.albedo.color = .2;
        flatGray.smoothness.color = .2;
        smudge.rect(0, 0, 512, 512, flatGray);

        const goldLeaf = new Material2();
        goldLeaf.albedo.color = [1, .8, 0];
        goldLeaf.smoothness.color = .6;
        goldLeaf.metallic.color = .9;
        goldLeaf.height.color = .0005;
        smudge.ellipse(50, 50, 412, 412, goldLeaf);


        const whitePaint = new Material2();
        whitePaint.albedo.color = .9;
        whitePaint.smoothness.color = .4;
        whitePaint.metallic.color = .1;
        whitePaint.height.color = .001;
        whitePaint.height.blendMode = BlendMode.Additive;
        whitePaint.height.textureInfo.texture = t2;

        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 512;
            const y = x + Math.random() * 60;
            const w = Math.random() * 60 + 20;
            smudge.ellipse(x, y, w, w, whitePaint);
        }


        // show albedo in ui
        ui.update2D();
        ui.update3D();
    }


    draw();
}