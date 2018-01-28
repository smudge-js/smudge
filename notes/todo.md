# Next Steps

Restore basic API functions under new Material model.

pbr2 is big, can we pull the shape stuff into /geometery ?



Should probably make a Point interface/class and probably make a pointList interface/class
    quad would use these, line would use these

https://github.com/jbail/lumberjack


# How does this work again?

Switching from drawProgram which has to vertexAttribs to basicProgram which has only one was causing an issue. Both vertexAttrib indexes were enabled for drawProgram. basicProgram didn't need the second one, but it was enabled with nothing bound to it. this throws an error.

So, i need a way to clean up when finished using a program.


# Todo

.fix that "Material->texture_config:TextureInfo" property name doesn't match type name

https://github.com/sverweij/dependency-cruiser


?switch enums to real enums?


so the 3D preview is built right away and if the drawing takes async time (say it waits for an image load) the 3D preview isn't rebuilt

## UI

- Sketches should not display a UI by default. 
- A function to create a 2D UI
- A function to create a 3D UI
- these functions might take some settings and return a dom object, probably insert the object as well
- you might not want a UI, maybe you just want the script to run, render off screen and download the result or something


## Texture Primitive Library

- vertical gradient 0->1
- vertical gradient 0->1->0
- circle gradient 1->0
- checker
- brick
- etc.

# Build System


@talia
.quick + dirty interface standup. make a shell for pbr2_ui to populate with buttons, skin buttons, etc.

@talia
.contribute better download to p5?
    x.network error on download with some pixel content.
        x.find a clean repro? any "noisey" image that doesn't compress well
            x.maybe png data was larger than a data url can hold? Yes, that was it.
                x.just move to a proper download library? using file-saver.js now


@talia demos/sketchs
.Blend Modes
.Example with each blend mode, with alpha at 100% and 50%
.Probably a couple color combos each.
.creating materials with 0, 0, 0, with {} and with copy constructor new Material(mymat)

@talia Naming + Branding

@talia Blog Design

@talia Website + Documentation Design
