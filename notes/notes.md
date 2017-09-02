# Notes


####################################
## Libraries

### Color Library
- chroma.js - great docs, very full featured, not OOP. consider using it as a backend for a color object? (coffee)
- Qix-/color - constructor without new. no hsl/v constructor?


####################################
## Style Guide / Code Review Checks

### Dos
- WebGL: bind back to null + clean up after binds at end of functions
- error checking: at the very least make a test and use console_report and console_error
    .this will make it easier to go back and put in proper handling.


####################################
## Todo / Clean Up / Refactor


### Interface - API

Gregs list:
    line();
    line([points], stroke_material(thickness?), matrix);
    poly()
    stroke, for ellipse and rect

we are trying to figure out what to eat for dinner, not the worst possible way to cook it.


check out es6 await on the image download


masks
layers
images
typography

tileable

.Material.lerp(mat1, mat2, .3);
    //lerp in color space?
.Needs a line();


.discuss material interface for working with color (albedo and emissive, and sometimes 1channe)
    mat.red = 1
    mat.setAlbedo(1, 1, 1); ->red, green, blue
    mat.setAlbedo(1, 1, 1, 1); ->red, green, blue, transparency
    mat.setAlbedo([1, 1, 1]); ->red, green, blue
    mat.setAlbedo([1, 1, 1, 1]); ->red, green, blue, transparency
    mat.setAlbedo([1, 1, 1], 1); ->red, green, blue, transparency
    mat.setAlbedo([1, 1, 1, .5], 1); ->red, green, blue, transparency(1), warn? (the .5 is extra)
    mat.setAlbedo(1, 1, 1, 1, BlendMode.Normal); ->red, green, blue, transparency, albedo_blend_mode

    mat.setMetallic(1); m
    mat.setMetallic(1, 1); m, t
    mat.setMetallic(1, 1, BlendMode.Normal); m, t, mbm
    mat.setMetallic([1, .5, .5, .6]); m, t (.5s skipped) // maybe better to error here.




.transform?
    .intial support for passing in matrix.
    .DISCUSS. this interface has users using gl-matrix
        .gl-matrix uses constructors without new, and is basically a namespaced static library, not OOP, so style doesn't match (say material)
        .it asks for a mat4 which allows for 3d rotations, but thats a bit inconvienent if you are working in 2D (need to specify axis of rotation for example)
        .can i promot a 3 to 4matrix?

.Planning blending modes.
    http://photoblogstop.com/photoshop/photoshop-blend-modes-explained

.load images


### Interface - GUI
.preview window: show single channel channels as grayscale, not redscale: pack and blit maybe useful

.download full texture set at once?
    .JSZip
        https://github.com/Stuk/jszip

### Internals
.not fully happy with the relationship between GLPrograms and Geometries
    currently
    .pbr2.ts/drawGeometry configs material properties of glprogram
    .pbr2.ts/drawGeometry asks geometry.ts/Geometery/Subclass to configure geo properties of program + draw

    This seems reasonable enough, but i'm finding the coupling a little off, some considerations
    .the glprogram needs data from geo and from material
    .for comparison, three js has a mesh object that contains both geo and material
    .also the model matrix adjustment for unitsquare/cirlce should happen in the geometry/subclass, because not all geo wants that...

.we should have a common naming convention for glprogram Attribs and Uniforms. Should use Three.js names?      
    Maybe, might make using their shaders possibe. on the other hand their shaders probably won't mean much for our project.
    .create a documentation page that has the required and optional attributes and uniforms, their names, and purposes


.object wrappers
    .add human readable names to object wrappers, to make debug messages much clearer. e.g. Framebuffer.name = "albedo"
        x.Framebuffer
        x.Programs




### Docs

.gen docs with typedocs
    .this is looking like it might need more manual intervention...
        .typedoc is documenting to many needless files.
        .documentation is to tied to code, not high level enough.
        .some types etc are just not clearly presented through generated docs



####################################
## Research Leads
.other interesting extensions
    EXT_blend_minmax
    EXT_frag_depth

.RESEARCH webgl renderbuffer MSAA (http://www.realtimerendering.com/blog/webgl-2-new-features/)
    .this is more urgent now, that the textures being too big is an issue.


.new github desktop

.is there a way to use WebGLRenderingContext gl constants without a gl instance? for example in config objects, etc. without just defining them as literals?


.What is the best way to handle immutability in Typescript/Javascript
    .e.g. how can i make the BlendMode presets read only, or copy on read? maybe just make them functions that return newly built?
    intead of
    BlendMode.Normal = {}
    BlendMode.Normal = () => ({});
    see: https://basarat.gitbooks.io/typescript/content/docs/tips/quickObjectReturn.html
    three things it could be:
        mutable
        immutalbe
        mutable copy of immutable (unreachable) template -> this would probably work often

.Cloning..
    Object.create(obj)

###################################
## Blending



####################################
## Blog Post Ideas


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
    i could pass in a matrix to transform/swizzle color. This might even work to do a HSB to RGB (look that up)
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


.opengl is going to fight us on this, but I want to consider a stateless api.
    No: set up state, draw with state.
    Yes: draw(params, params, params).

    .maybe build library in two parts, a pure stateless layer, and an "adapter" layer that sits over that and maintains state to be more like p5.

## Discussion/Documentation Point (Transparency)
.transparency own channel
.add alpha for rgb, m, s, h, ergb, t
.yeah even transparency gets an alpha
x.RESEARCH.is alpha special?
    .y see: blendFuncSeparate


## Discussion/Documentation Point (Per Group Controlls)
x.add idea of channel group (channel groups are pretty much just the channels that share a buffer) (metallic is group with just metallic, rgb is group with r g b);
x.add blend mode to material channels/groups, can/shoud we do this per channel?
x.have drawing operations skip channels/groups if material value is undefined x.colorMask
.material constructor that takes objects for named params

## Discussion/Documentation Point (Texturing)
.Do i like the idea of drawing each shape to temp buffer and then using that drawing to write to the real buffers?

## Discussion/Documentation Point (Stenciling)
.expose stencil buffer?! draw stencil, draw normal (fragments stenciled), clear stencil


## bad sugar idea
.pseudo language sugar idea: create bit mask values for each channel, create "swizle aliases" like this. rgbm = r | g | b | m
    .probably a bad idea because gbr wouldn't work unless you did every ordering. and if you did do every ordering, user might expect order to matter.

## Implementation Point (Data Storage/Packing)
x.i'm storing smoothness in metallic.a which matches the export but doesn't work for previewing well at all
    x.so split these into their own channelgroups like height, create packer to swizle them into the desired export layout
        x.single channel buffer/texture?
.RESEARCH.how does that work with alpha blending?
    all channels use Transparency for their alpha, probably needs to be seperate
    and transparency probably needs ITS OWN alpha...
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
    working with half-floats

## Implementation/Documenation Point (OVERSAMPLING)
    using large textures now. this is more memory and fill intensive, use built in MSAA with renderbuffers?

## Implementation/Documenation Point (Shader Conventions)
.create conventions for names of uniforms/attributes passed to shader material class?
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
