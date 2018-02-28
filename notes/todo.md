- [Next Steps](#next-steps)
- [Phase I](#phase-i)
    - [Bugs](#bugs)
    - [Refactoring + Style](#refactoring-style)
        - [Internal](#internal)
    - [Enhancements + Feature Ideas](#enhancements-feature-ideas)
        - [API](#api)
        - [UI/API - Exports](#uiapi---exports)
        - [Deployment](#deployment)
        - [UI - API](#ui---api)
        - [UI - UI](#ui---ui)
        - [UI - 3D](#ui---3d)
        - [Material](#material)
        - [Matrix](#matrix)
        - [Development Tools](#development-tools)
    - [Texture Primitive Library](#texture-primitive-library)
    - [Docs](#docs)
- [Phase II](#phase-ii)
    - [Refactoring](#refactoring)
        - [Internal](#internal)
    - [Enahancements + Feature Ideas](#enahancements-feature-ideas)
        - [Material](#material)
        - [Misc](#misc)
- [Completed](#completed)
    - [Bugs](#bugs)


# Next Steps
- [ ] bugs
- [x] Restore basic API functions under new Material model.
- [x] pbr2 is big, can we pull the shape stuff into /geometery ?
- [x] Refactor code names pbr->smudge?
- [ ] file by file code review
- [ ] basic geo classes/types
    - quad would use these, line would use these
    - [ ] point
    - [ ] point list
    - [ ] rect
- [ ] High Priority Features
- [ ] Write Docs + Examples

# Phase I

## Bugs

## Refactoring + Style

### Internal
- [ ] "Material->texture_config:TextureInfo" property name doesn't match type name, names are inconsistent


## Enhancements + Feature Ideas

### API
- [ ] a way to set up the drawing matrix (this is stateful, which we largely avoid, but a once-at-the-top call to set up the logical dimensions would make sense anyway)
    - [ ] Set canvas size seperately from "logical" size. So you can resize rendering dimensions without altering positions in code.


### UI/API - Exports
- [ ] Higher DPI export
- [ ] Higher Depth (EXR) export
- [ ] Named Export
- [ ] Full Set Export as .zip
- [ ] Export 3D View
- [ ] download full texture set at once? .JSZip https://github.com/Stuk/jszip
- [ ] ability to name material downloads
    - [ ] posible format [project]\_[version]_[property].png



### Deployment
- [ ] export smudge.js so you can just include the compiled js and use it in a js project
- [ ] also factor this so it can be npm installed and used.

### UI - API
- [ ] A function to create a 2D UI
- [ ] A function to create a 3D UI
- [ ] an API call to update the 3D view
- [ ] these functions might take some settings and return a dom object, probably insert the object as well
- [ ] you might not want a UI, maybe you just want the script to run, render off screen and download the result or something, make example of this

### UI - UI
- [ ] visual design update
- [ ] would be nice if live preview remembered which channel you were previewing on refresh
- [ ] show single channel channels as grayscale, not redscale: pack and blit maybe useful to achive this

### UI - 3D
- [ ] 3D
    - [ ] control height strength
    - [ ] maybe adjust strength of metallic/smoothness
    - [ ] a few lighting + env map settings
    - [ ] auto rotate model
    - [ ] zoom
    - [ ] pan
    - [ ] sphere in addition to box model
    - [ ] tiling?

### Material
- [ ] add second texture for "paper" this texture gets UVs based on position of paper can be used for texturing drawing in a way that lines up between calls.
```javascript
sourceColorMatrix * sourceSample(sourceUV • sourceUVMatrix) + sourceColorBias
*
paperColorMatrix * paperSample(paperUV• paperUVMatrix) + paperColorBias
*
color
+
colorBias
```
- [ ] example using default texture. This would maybe be a common case (maybe not). A bumpy texture that modulates color + height, for example. Does it work right?


### Matrix
- [ ] currently two types of matrix (for 3d and 2d) one is a UVMatrix. can these be one, with somesort of autopromotion/demotion as needed?

### Development Tools
- [ ] Doc building
- [ ] Add [depcruise](https://github.com/sverweij/dependency-cruiser) to doc building


## Texture Primitive Library
- [ ] vertical gradient 0->1
- [ ] vertical gradient 0->1->0
- [ ] circle gradient 1->0
- [ ] checker
- [ ] brick
- [ ] etc.




## Docs
- [] gen docs with typedocs?
    this is looking like it might need more manual intervention...
        - typedoc is documenting to many needless files.
        - documentation is to tied to code, not high level enough.
        - some types etc are just not clearly presented through generated docs


# Phase II

## Refactoring 

### Internal
- [ ] ?switch enums to real enums?
- [ ] generally audit the draw pathway/relationship between geo/material/programming 
- [ ] shaders
    - [ ] common names for uniforms and attribs
    - [ ] are all three being used? should there be multiple shaders, or one to rule them all?

## Enahancements + Feature Ideas

### Material
- [ ] Material.colorizeTexture(mat.albedo, [1,0,0], [0,10]);
    - Would set up the bias and matrix color params to map black-white to colors
- [ ] material lerp would be nice 
- [ ] (phase never) magic prarams. be able to pass functions or ranges, and then have them executed or randomly sampled. This could be done on the JS call level, but would be more interestng per pixel, which really just boils down to custom shaders. Probably won't do.


### Misc
- [ ] stroke for ellipse and rect
- [ ] get pixels
    - [ ] agree this is need, need usecase to design
- [ ] maksing system
    - [ ] draw custom mask, use for drawing
    - [ ] mask based on existing channel (draw only where height > .8)
    - [ ] ability to soften/blur masks
- [ ] filters
    - [ ] blur
    - [ ] levels
- [ ] Material Presets?
- [ ] color utils (maybe extend color type to class)
    - [ ] accept hex values for colors
    - [ ] darken/lighten
    - [ ] color modes hsb, etc.
- [ ] transparency of transparency, this is a big topic, think about how it works, if it should be changed, and document in own section.
- [ ] ellipse/rect modes for center/radius, corners, etc. after p5.js
- [ ] layers or targets. Multiple targets you can draw into that get flattened out with a composite operation (blend, add, etc.)
- [ ] nine slicing (rects) and three-slicing (lines) would be pretty nice...


# Completed


## Bugs 
- [x] the 3D preview is built right away and if the drawing takes async time (say it waits for an image load) the 3D preview isn't rebuilt, probably should change API so you can tell the 3D preview when to update. This could be tied into the asyc "peek" mode that shows work in progress.
    - [x] Probably should OOP the ui add a call for show(packing/channelgroup) and update3D


- [x] look into that "bugfix" channel layout and why it is needed. Could it have something to do with "this.gl.viewport"?
    - [x] commented out bugfix channel appears to be working, leaving commented in for now in case of regression
    - [ ] take it out completely if it looks okay after a little more experimenting

- [x] I think this may fixed, but I'm not sure what it means. Take a sec to investigate:
    - [x] why does the three_pbr packing have to have oversamling at 1 for blit to fill the whole thing. higher oversampilng result in clipped blits. why?!
    - [x] looks fixed