# What Smudge Does

# Smudge API

## PBR Object
[Overview]
- Constructor
- pbr.clear()
- pbr.show()
- pbr.width
- pbr.height


## Shapes
- pbr.rect()
- pbr.ellipse()
- pbr.quad()
- pbr.line()
    opts: align, width, close


## Materials
[Overview]
- Constructor
- Copy Constructor
- Defaults

- Blending Options
    albedo_blend_mode
    metallic_blend_mode
    smoothness_blend_mode
    height_blend_mode
    emission_blend_mode

- Channels
    - red
    - green
    - blue
    - transparency
    - metallic
    - smoothness
    - height
    - emission_red
    - emission_green
    - emission_blue

    channel masking (m.red = undefined)


## Blend Modes
[Overview]
- Normal
- Replace
- Additive
- Subtractive
- Darkest
- Lightest
- Multiply



## Matrices
using mat4 from gl-matrix;
