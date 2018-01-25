
# Todo

.fix that "Material->texture_config:TextureInfo" property name doesn't match type name

https://github.com/sverweij/dependency-cruiser


?switch enums to real enums?


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
