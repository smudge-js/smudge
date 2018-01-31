- [Next Steps](#next-steps)
- [Bugs](#bugs)
- [Refactoring + Style](#refactoring-style)
- [Enhancements + Feature Ideas](#enhancements-feature-ideas)
    - [UI](#ui)
    - [Material](#material)
    - [Development Tools](#development-tools)
    - [Texture Primitive Library](#texture-primitive-library)
- [Concerns](#concerns)


# Next Steps

- [ ] bugs
- [x] Restore basic API functions under new Material model.
- [ ] pbr2 is big, can we pull the shape stuff into /geometery ?
- [ ] Refactor code names pbr->smudge?
- [ ] file by file code review
- [ ] basic geo classes/types
    - quad would use these, line would use these
    - [ ] point
    - [ ] point list
    - [ ] rect

# Bugs
- [ ] the 3D preview is built right away and if the drawing takes async time (say it waits for an image load) the 3D preview isn't rebuilt, probably should change API so you can tell the 3D preview when to update. This could be tied into the asyc "peek" mode that shows work in progress.


# Refactoring + Style

- [ ] "Material->texture_config:TextureInfo" property name doesn't match type name, names are inconsistent
- [ ] ?switch enums to real enums?



# Enhancements + Feature Ideas

## UI

- [x] Sketches should not display a UI by default. 
- [ ] A function to create a 2D UI
- [ ] A function to create a 3D UI
- [ ] these functions might take some settings and return a dom object, probably insert the object as well
- [ ] you might not want a UI, maybe you just want the script to run, render off screen and download the result or something, make example of this
- [ ] visual design


## Material
- [ ] Material.colorizeTexture(mat.albedo, [1,0,0], [0,10]);
    - Would set up the bias and matrix color params to map black-white to colors

## Development Tools
- [ ] Doc building
- [ ] Add [depcruise](https://github.com/sverweij/dependency-cruiser) to doc building


## Texture Primitive Library

- vertical gradient 0->1
- vertical gradient 0->1->0
- circle gradient 1->0
- checker
- brick
- etc.





# Concerns

- Switching from a drawProgram which has two vertexAttribs to basicProgram which has only one was causing an issue. Both vertexAttrib indexes were enabled for drawProgram. basicProgram didn't need the second one, but it was enabled with nothing bound to it. this throws an error. that makes some sense. 
    - Where in the code was the other attribute unbound? Why wasn't the old bound data still hanging around even unused?
    - Anyway, need a way to clean up. Added `program.done()` for now. Is that good?