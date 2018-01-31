# Hiding things in generated docs
```
At top of page
/** @hidden **/
/** */

Two comments needed: bottom one annotates the thing underneath it. That lets the top one apply to the whole file.
```

# Concerns

- Switching from a drawProgram which has two vertexAttribs to basicProgram which has only one was causing an issue. Both vertexAttrib indexes were enabled for drawProgram. basicProgram didn't need the second one, but it was enabled with nothing bound to it. this throws an error. that makes some sense. 
    - Where in the code was the other attribute unbound? Why wasn't the old bound data still hanging around even unused?
    - Anyway, need a way to clean up. Added `program.done()` for now. Is that good?


# Style Guide / Code Review Checks

### Dos
- WebGL: bind back to null + clean up after binds at end of functions, do this inside looped internal anon functions too, not just at end of parent funciton
- error checking: at the very least make a test and use console_report and console_error
    - maybe make a report handler that takes a boolean and handles success and failure differently
    - this will make it easier to go back and put in proper handling.
    

# Resources

## Material
- [Photoshop Blending Modes](http://photoblogstop.com/photoshop/photoshop-blend-modes-explained)
- chroma.js - great docs, very full featured, not OOP. consider using it as a backend for a color object? (coffee)
- Qix-/color - constructor without new. no hsl/v constructor?


- [TypeScript Deep Dive](https://www.gitbook.com/book/basarat/typescript/details)


####################################
## Research Leads
.other interesting extensions
    EXT_blend_minmax
    EXT_frag_depth

.webgl renderbuffer MSAA (http://www.realtimerendering.com/blog/webgl-2-new-features/)
    .perhaps use this over extra large renderbuffers?

.new github desktop

.is there a way to use WebGLRenderingContext gl constants without a gl instance? for example in config objects, etc. without just defining them as literals?
    .YES  WebGLRenderingContext.LINE_LOOP

.What is the best way to handle immutability in Typescript/Javascript
    .e.g. how can i make the BlendMode presets read only, or copy on read? maybe just make them functions that return newly built?
    intead of
    BlendMode.Normal = {}
    BlendMode.Normal = () => ({});
    see: https://basarat.gitbooks.io/typescript/content/docs/tips/quickObjectReturn.html
    three things it could be:
        mutable
        immutalbe
        mutable copy of immutable (unreachable) template (copy on read) -> this would probably work

    .Cloning..
        Object.create(obj)
        Object.assign(obj)
    Also factory method https://basarat.gitbooks.io/typescript/docs/arrow-functions.html#tip-quick-object-return

###################################
## Blending





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
https://blog.cloudflare.com/generating-documentation-for-typescript-projects/