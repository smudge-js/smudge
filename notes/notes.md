# Notes

## Clean Up / Refactor
x.jsx for ui?
    .nope too big a deal

x.create conventions for names of uniforms/attributes passed to shader material class?
    .now embodied in the `Material` class


x.clean up the clear in the constructor

x.bind back to null / clean up after binds in functions

x.RESEARCH.is alpha special?
    .y see: blendFuncSeparate

x.buffer.bindTexture(); -> add parameter for texture slot? activeTexture()

.refactor the geo into a class
    x.basics
    .move set vertex and uv attribs and drawArrays (drawIndexed) into geo class?


x.just reorder pbr1.ts for now


.pbr.show* and pbr.get* functions are looking like they belong to pbr_ui not pbr


move buffer_width* into Framebuffer

webgl renderbuffer MSAA (http://www.realtimerendering.com/blog/webgl-2-new-features/)

might not work: floating point texture renderbuffer attachment
might work: user a renderbuffer and then copy to texture. I'd rather right straight to textures so they can be fed into shaders


i could pass in a matrix to transform/swizle color. This might even work to do a HSB to RGB (look that up)
e.g.
r00 -> rgb(white)
1.0, 0.0, 0.0
1.0, 0.0, 0.0
1.0, 0.0, 0.0

rgb -> just blue
0.0, 0.0, 0.0
0.0, 0.0, 0.0
0.0, 0.0, 1.0

rgb -> bgr
0.0, 0.0, 1.0
0.0, 1.0, 0.0
1.0, 0.0, 1.0


# Design Ideas / Questions

.opengl is going to fight us on this, but I want to consider a stateless api. No: set up state, draw with state. Yes: draw(params).

## Discussion/Documentation Point (Transparency)
.transparency own channel
.add alpha for rgb, m, s, h, ergb, t
.yeah even transparency gets an alpha

## Discussion/Documentation Point (Per Group Controlls)
.add idea of channel group (metallic is group with just metallic, rgb is group with r g b);
.add blend mode to material channels/groups, can/shoud we do this per channel?
.have drawing operations skip channels/groups if material value is undefined
.colorMask

.material constructor that takes objects for named params

## Discussion/Documentation Point (Texturing)
.Do i like the idea of drawing each shape to temp buffer and then using that drawing to write to the real buffers?

## Discussion/Documentation Point (Stenciling)
.expose stencil buffer?! draw stencil, draw normal (fragments stenciled), clear stencil


.pseudo language sugar idea: create bit mask values for each channel, create "swizle aliases" like this. rgbm = r | g | b | m
    .probably a bad idea because gbr wouldn't work unless you did every ordering. and if you did do every ordering, user might expect order to matter.

## Implementation Point (Data Storage/Packing)
.i'm storing smoothness in metallic.a which matches the export but doesn't work for previewing well at all
    .so split these into their own channelgroups like height, create packer to swizle them into the desired export layout
        .single channel buffer/texture?
            .RESEARCH.how does that work with alpha blending?
                .currently no way to do alpha with height i think. for example i can currently set the height .5, soon should be able to use "add" to build height up, would be nice to maybe set hieght to .5 (alpha .1) to gradually move height towards .5.
.create packing class that defines channel -> output texture packing
    .make it general so user defined channels can be created, editied, packed, exported

## Implementation/Documenation Point (Channel Blitting)
.create functions for copying channels from here to there (blitter) should be able to take source channel, target channel, a tone map range (for hdring), compositing/blend mode
    .RESEARCH. tonemapping funcitons (is this linear?)


## Implementation/Documenation Point (HDR)

## Discussion/Documentation Point (Funciton/Range Parameters)
.material color properties are currently numbers.
    could they be functions? would functions be per object or per pixel?
    could they be ranges? per object? per pixel?
    ranges would be good for tinting a grayscale (eg. gray to purple->yellow duotone)

## Discussion Point (Nine Slice)
.nine slice scaling?
    .nine slice doesn't really work well if border width can change.
    .for a soft/deckle edge effect probably a "blur" edge min/mult/composited with a texture will give a better effect


Dithering, Bluenosie, Outside
## UI
View modes:
R
G
B
A
RGB
RGBA
M
S
H
ER
EG
EB
ERGB




## Big
.typedoc


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


# PBR Material Format
    named           storage         export packing
    albedo.red     albedo.r        albedo.r
    albedo.green   albedo.g        albedo.g
    albedo.blue    albedo.b        albedo.b
    transparency    albedo.a        albedo.a
    metallic        metallic.r      metallic.r
    smoothness      metallic.a      metallic.a
    height          height.rgb      height.rgb
    emission.red    emission.r      emission.r
    emission.green  emission.g      emission.g
    emission.blue   emission.b      emission.b
    albedo_blendmode
    metallic_blendmode
    smoothness_blendmode
    height_blendmode
    emission_blendmode


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
