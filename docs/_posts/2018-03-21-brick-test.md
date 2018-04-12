---
layout: post
title:  "Brick Test"
date:   2018-03-21 00:01:01 -0500
categories: smudge
author: Justin Bakse
poster_image: 
---

I just finished a major refactoring pass on smudge. There are still some things that really want to do, but I'm going to do some user testing before the next round of refactoring and feature additions.

I wanted to build out a more complicated example after the refactoring to make sure things work together and to identify any major pain points in the API, so I built this brick wall.
<br/><br/>

<div id="sketch_brick" class="smudge-wrap"></div>
<script src="/smudge/media/brick/brick.js" data-ui-target="sketch_brick"></script>

This texture set touches most of the API. It uses all of the material channels except emission. It uses a number of input textures, including the features for color and UV mapping. It also shows that the API needs some work.  For example, `Material2` should just be renamed to `Material`.

```javascript
const { Material2, Smudge, SmudgeUI, BlendMode, UVMatrix, Matrix } = smudge;

const uiTarget = document.getElementById(document.currentScript.dataset.uiTarget);

async function draw() {
    // create a smudge instance
    Smudge.setLoggingLevel("warn");
    const smudge = new Smudge("brick", 512, 512);

    // load a texture
    const brickHeight = await smudge.loadTexture("/smudge/media/smudge/images/blur_box.png");
    const noise = await smudge.loadTexture("/smudge/media/smudge/images/gaussian_noise.png");
    const clouds = await smudge.loadTexture("/smudge/media/smudge/images/clouds.png");
    const circleRough = await smudge.loadTexture("/smudge/media/smudge/images/circle_rough.png");
    const letterA = await smudge.loadTexture("/smudge/media/smudge/images/letter_a.png");

    // show the ui
    const ui = new SmudgeUI(smudge, {
        targetElement: uiTarget,
        environmentMapPath: "/smudge/media/smudge/images/environment_studio.jpg"
    });

    // clear the drawing
    smudge.clear();

    //  draw morter
    const mortar = new Material2();
    mortar.albedo.color = [.8, .8, .8];
    mortar.metallic.color = .2;
    mortar.smoothness.color = .2;

    mortar.height.color = .001;
    mortar.height.textureInfo.texture = noise;
    mortar.height.textureInfo.uvMatrix = new UVMatrix().scale(3, 3).get();

    smudge.rect(0, 0, 512, 512, mortar);

    // draw bricks
    const hspace = 128;
    const vspace = 64;
    const margin = 3;

    const brickBase = new Material2();
    brickBase.albedo.color = [.9, 0, 0];
    brickBase.metallic.color = .1;
    brickBase.smoothness.color = .2;
    brickBase.height.color = .01;
    brickBase.height.textureInfo.texture = brickHeight;

    const brickOverlay = new Material2();
    brickOverlay.albedo.color = [-.3, .04, .04];
    brickOverlay.albedo.textureInfo.texture = clouds;
    brickOverlay.albedo.textureInfo.uvMatrix = new UVMatrix().scale(.4, .2).get();
    brickOverlay.albedo.blendMode = BlendMode.Additive;

    brickOverlay.height.color = .02;
    brickOverlay.height.textureInfo.colorBias = [-.5, -.5, -.5, 1];
    brickOverlay.height.textureInfo.texture = clouds;
    brickOverlay.height.textureInfo.uvMatrix = new UVMatrix().scale(.4, .2).get();
    brickOverlay.height.blendMode = BlendMode.Additive;

    brickOverlay.smoothness.color = .3;
    brickOverlay.smoothness.textureInfo.texture = noise;
    brickOverlay.smoothness.textureInfo.uvMatrix = new UVMatrix().scale(.6, .3).get();
    brickOverlay.smoothness.blendMode = BlendMode.Additive;

    for (let row = 1; row < 8; row++) {
        for (let col = 0; col < 5; col++) {
            brickBase.albedo.color = [Math.random() * .1 + .6, Math.random() * .1, Math.random() * .1];
            brickOverlay.albedo.textureInfo.uvMatrix = new UVMatrix().rotate(Math.random() * Math.PI).scale(.4, .2).get();
            brickOverlay.height.textureInfo.uvMatrix = new UVMatrix().rotate(Math.random() * Math.PI).scale(.4, .2).get();
            const m = new Matrix().translate(Math.random() * 2, Math.random() * 2);

            // base is a line because it won't stretch the emboss texture
            const line = [];
            const offset = row % 2 === 0 ? 0 : hspace * -.5;
            line.push([col * hspace + margin + offset, vspace * row + 32]);
            line.push([col * hspace + hspace - margin + offset, vspace * row + 32]);
            smudge.line(line, vspace - 2 * margin, brickBase, m);

            // overlay is a rect because i want to tile textures
            smudge.rect(
                col * hspace + offset + margin,
                vspace * row + margin,
                hspace - 2 * margin,
                vspace - 2 * margin,
                brickOverlay,
                m,
            );
        }
    }

    // draw paint circle
    const paint = new Material2();
    paint.albedo.color = [0, .8, 0, 1];
    paint.metallic.color = 0;
    paint.smoothness.color = [.2, .9];
    paint.height.color = .001;
    paint.height.blendMode = BlendMode.Additive;

    paint.default.textureInfo.texture = circleRough;
    paint.default.textureInfo.colorBias = [1, 1, 1, 0];
    paint.default.textureInfo.colorMatrix = [
        0, 0, 0, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ];

    smudge.ellipse(32, 32, 256, 256, paint);

    // show albedo in ui
    ui.update2D();
    ui.update3D();
}


draw();
```

