# Notes

## Clean Up / Refactor
x.jsx for ui?
    .nope too big a deal

x.create conventions for names of uniforms/attributes passed to shader material class?
    .now embodied in the `Material` class


x.clean up the clear in the constructor

x.bind back to null / clean up after binds in functions

x.is alpha special?
    .y see: blendFuncSeparate

buffer.bindTexture(); -> add parameter for texture slot? activeTexture()

.pbr.show* and pbr.get* functions are looking like they belong to pbr_ui not pbr

# Design Ideas / Questions

.have drawing operations skip channels/groups if material value is undefined
    .colorMask
.add blend mode to material challens/groups, can we do this per channel?
.add idea of channel group (metallic is group with just metallic, rgb is group with r g b);
.material constructor that takes objects for named params
.Do i like the idea of drawing each shape to temp buffer and then using that drawing to write to the real buffers?
.expose stencil buffer?! draw stencil, draw normal (fragments stenciled), clear stencil


.pseudo language sugar idea: create bit mask values for each channel, create "swizle aliases" like this. rgbm = r | g | b | m
    .probably a bad idea because gbr wouldn't work unless you did every ordering. and if you did do every ordering, user might expect order to matter.


.i'm storing smoothness in metallic.a which matches the export but doesn't work for previewing well at all
    .so split these into their own channelgroups like height, create packer to swizle them into the desired export layout
        .single channel buffer/texture?
            .RESEARCH.how does that work with alpha blending?
                .currently no way to do alpha with height i think. for example i can currently set the height .5, soon should be able to use "add" to build height up, would be nice to maybe set hieght to .5 (alpha .1) to gradually move height towards .5.

.create packing class that defines channel -> output texture packing
    .make it general so user defined channels can be created, editied, packed, exported

.create functions for copying channels from here to there (blitter) should be able to take source channel, target channel, a tone map range (for hdring), compositing/blend mode
    .RESEARCH. tonemapping funcitons (is this linear?)

.material color properties are currently numbers.
    could they be functions? would functions be per object or per pixel?
    could they be ranges? per object? per pixel?
    ranges would be good for tinting a grayscale (eg. gray to purple->yellow duotone)

.nine slice scaling?
    .nine slice doesn't really work well if border width can change.
    .for a soft/deckle edge effect probably a "blur" edge min/mult/composited with a texture will give a better effect


# Unity PBR Standard (Metallic) Shader Texture Format
https://docs.unity3d.com/Manual/StandardShaderMaterialParameters.html

Albedo
    r albedo.red
    g albedo.green
    b albedo.blue
    a transparency

Metallic
    r metallic
    g unused
    b unused
    a smoothness

Normal
    r normal.x
    g normal.y
    b normal.z
    a unused

Height
    g height

Occlusion
    g occlusion

Emission
    r emission.r
    g emission.g
    b emission.b
    a unused

# PBR Material Format
    named           storage         export packing
    (albedo)red     albedo.r        albedo.r
    (albedo)green   albedo.g        albedo.g
    (albedo)blue    albedo.b        albedo.b
    transparency    albedo.a        albedo.a
    metallic        metallic.r      metallic.r
    smoothness      metallic.a      metallic.a
    height          height.rgb      height.rgb
    emission_red    emission.r      emission.r
    emission_green  emission.g      emission.g
    emission_blue   emission.b      emission.b

## Starting the Project
From the root directory:
`npm install`
`webpack-dev-server --open`



## Links
https://webpack.js.org/guides/installation/
https://webpack.js.org/guides/webpack-and-typescript/
https://webpack.js.org/guides/development/
https://webpack.js.org/concepts/plugins
https://www.typescriptlang.org/play/index.html
https://www.typescriptlang.org/docs/handbook/basic-types.htm
lhttps://github.com/frontdevops/typescript-cheat-sheet
https://www.npmjs.com/package/webpack-glsl-loader
https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
https://www.typescriptlang.org/docs/handbook/interfaces.html
https://www.opengl.org/discussion_boards/showthread.php/148444-Pixel-perfect-drawing
http://glmatrix.net/docs/mat4.html
http://typescript.codeplex.com/sourcecontrol/latest#typings/lib.d.ts
https://basarat.gitbooks.io/typescript/content/docs/getting-started.html
https://www.gitbook.com/
http://eloquentjavascript.net/1st_edition/chapter5.html
http://eloquentjavascript.net/14_event.html
http://mrdoob.github.io/webgl-blendfunctions/blendfunc.html
https://webglfundamentals.org/webgl/lessons/webgl-and-alpha.html
https://limnu.com/webgl-blending-youre-probably-wrong/
