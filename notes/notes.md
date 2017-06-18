# Bugs

network error on download with some pixel content. find a clean repo?
maybe png data was larger than a data url can hold?
just move to a proper download library?

# Notes

####################################
## Style Guide

### Dos
- bind back to null / clean up after binds at end of functions
- error checking: at the very least make a test and use console_report and console_error this will at least make it easier to go back and put in proper handling.

### Don'ts
- not using jsx for interface, too much tooling at this point



####################################
## Todo / Clean Up / Refactor

Material.lerp(mat1, mat2, .3);

.Planning blending modes.
    gl.blendFunc
    gl.blendFuncSeparate
    gl.blendColor
    gl.blendEquation
        FUNC_ADD
        FUNC_SUBTRACT
        FUNC_REVERSE_SUBTRACT
        gl2.MIN
        gl2.MAX
    Porter-Duff 

    http://photoblogstop.com/photoshop/photoshop-blend-modes-explained

.made a mess gl_constants
    using imported gl_constants instead of getting them from gl instance.
    how to use the constants without an instance?


.Made a mess when refactoring buffer drawing loops
    buffers now dynamically assign color data based on "buffer_layout" and materials. the relationships are not elegant, resulting in some casts to "any" which could+should be cleaned up. A better arrangement might clean it all the way up, but these pages have some power tools that might help if needed.
    also part of (solving) the mess how can i use typescript to properly create a dynmaically read property. Perhaps i should use an accessor getChannel(enum) the enum would list the properties that are channel data, preventing people from trying to access a non channel data property as channnel data.
    https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html
    https://basarat.gitbooks.io/typescript/docs/types/moving-types.html
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html


.make a blit channel function that can blit a buffer channel to another buffer channel
    blit(smoothness, red, canvas, alpha) -> copy the red channel of smoothness to the alpha channel of the canvas


x.move buffer_width* into Framebuffer
    x.this is in the PBR1.ts now, but couples much better to Framebuffer. This would also allow for different oversampling amounts per buffer.

.refactor the geo into a class
    x.basics
    .move set vertex and uv shader attribs into geo class? (using standard naming convention)
    .move drawArrays (drawIndexed) into geo class?


.object wrappers
    .add human readable names to object wrappers, to make debug messages much clearer. e.g. Framebuffer.name = "albedo"
        x.Framebuffer
        .Geo
        x.Programs

.storage buffer
    create structure of buffer names, channel names, depth, packing
    drive code from it instead of hardcoding

.pbr.show* and pbr.get* functions are looking like they belong to pbr_ui not pbr

.needs better app.ts sketch.ts interface. right now you can't have each sketch determine its size, etc.

.cleanup.i've got this:
    const gl2 = gl as any;
    but could probably get rid of that if i uncommented out the ext and gl2 parts of the webgl.d.ts

.RESEARCH webgl renderbuffer MSAA (http://www.realtimerendering.com/blog/webgl-2-new-features/)

Material.lerp(m1, m2)


####################################
## Research Leads
    other interesting extensions
        EXT_blend_minmax
        EXT_frag_depth
    new github desktop

####################################
## Blog Post Ideas

.Floating Point Texture Attachments
    might not work: floating point texture renderbuffer attachment
    might work: user a renderbuffer and then copy to texture. I'd rather right straight to textures so they can be fed into shaders
    try oes extension for floats instead of webgl2?
    Just a quick post about trying to figure this out. With error messages to make it googleable.
    finally! https://www.khronos.org/registry/webgl/extensions/EXT_color_buffer_float/

.Print
    Finally, while digital screens cannot recreate qualities like smoothness and metallicness and height, it is somewhat possible to recreate these qualities in printed material using methods like selective gloss coating, foil stamping, and embossing. It might be interesting to use this system to create images wiht print in mind.

.Variety of Lighting
    [the effect is more pronouced when the object or lights are moving, or with more dramatic environments/lighting]
    [show different lighting? another post?]

. Inspiration
    This project builds on ideas from several other packages including Processing + p5.js, Substance Designer, and Unity.

    Processing—and its javascript cousin p5.js—is a creative coding library widely used by artists, designers, and students. I have used Processing in many of my creative coding classes


. Physically Based Rendering
    [this section may adjust based upon how much we suggest what pbr is up top]
    Most digital images, and most digital image authoring software and libraries, represent images as pixels that encode only the image’s color. These images and packages do not describe other properties of the image such as how shiny, metallic, or thick each pixel is. These material properties are important expressive aspects of traditional media image-making.

    Physically Based Rendering (PBR) is method of 3D rendering which seeks to simulate the real-world interactions of light and materials more accurately than previous rendering models. PBR materials use multiple images (maps) to represent material properties such as albedo (color), roughness, metallic response, emissive color, and height.

    Tools for creating and rendering PBR materials have become more widespread in the past few years. Unity 3D, a real-time engine used for game and interactive application development, introduced PBR support in 2015. Authoring packages such as Substance Designer, Substance Painter, and Quixel, allow artists to work with this more expressive representation of images using familiar tools. Combining this pipeline with VR enables powerful tools for creating virtual prototypes and material studies very quickly.

####################################
## Design Ideas / Questions

.Color Matrix Transform
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


.opengl is going to fight us on this, but I want to consider a stateless api. No: set up state, draw with state. Yes: draw(params, params, params).
    .maybe build libarary in two parts, a pure stateless, harder to use base layer, and an "adapter" layer that sits over that and maintains state.

## Discussion/Documentation Point (Transparency)
.transparency own channel
.add alpha for rgb, m, s, h, ergb, t
.yeah even transparency gets an alpha
x.RESEARCH.is alpha special?
    .y see: blendFuncSeparate


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

## Implementation/Documenation Point (Object Binding)
.for our OOP wrappers like Framebuffer, Texture, Geometry should we have a common name for the funciton that binds them to the context?
    .should this `bind` function do more than just bind, and otherwise set things up
        .e.g. FramebufferInstance.bind() might bind the buffer and set the viewport.


## Implementation/Documenation Point (HDR)
## Implementation/Documenation Point (OVERSAMPLING)

## Implementation/Documenation Point (Shader Conventions)
x.create conventions for names of uniforms/attributes passed to shader material class?
    .now partially embodied in the `Material` class



## Discussion/Documentation Point (Funciton/Range Parameters)
.material color properties are currently numbers.
    could they be functions? would functions be per object or per pixel?
    could they be ranges? per object? per pixel?
    ranges would be good for tinting a grayscale (eg. gray to purple->yellow duotone)

## Discussion Point (Nine Slice)
.nine slice scaling?
    .nine slice doesn't really work well if border width can change.
    .for a soft/deckle edge effect probably a "blur" edge min/mult/composited with a texture will give a better effect

## Dithering, Bluenosie, Outside




## Big
.typedoc


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
http://www.andersriggelsen.dk/glblendfunc.php