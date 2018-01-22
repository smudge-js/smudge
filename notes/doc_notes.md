# What Smudge Does

[[ what it does ]]

# Smudge API

## Project Setup

[[ how to include and start with smudge ]]

## PBR Object
[[ Overview]]

- Constructor
- pbr.clear()
- pbr.show()
- pbr.width
- pbr.height


## Drawing Shapes
- pbr.rect()
- pbr.ellipse()
- pbr.quad()
- pbr.line()
    opts: align, width, close

### Matrices
using mat4 from gl-matrix;



## Materials
[[ Overview, Materials capture more properties than basic color ]]


### Material Type Overview
Material
    .default
    .albedo
    .metallic
    .smoothness
    .height
    .emission: MaterialChannel
        .color: Color = Gray | GrayA | RGB | RGBA
        .blend_mode: BlendMode
            .equation: GLenum
            .sFactor: GLenum
            .dFactor: GLenum
        .texture_config: TextureInfo
            .texture: Texture
                .texture: WebGLTexture
                .image: HTMLImageElement
                .loaded: boolean
            .colorMatrix: []
            .colorBias: []
            .uvMatrix: []

### Creating A Material

[[ constructor ]]
[[ copy contructor ]]
[[ default material values ]]


### Material Channels
[[ list, describe, show ]]
    [[ value inherting ]]
    [[ channel masking ]]

- Channels
    - default
    - albedo
    - metallic
    - smoothness
    - height
    - emission



### Colors

[[ flexible, used for colors (albedo) and values (height) ]]
[[  Gray | GrayA | RGB | RGBA ]]
[[ how promotion works ]]

### Blend Modes

[[ What Blend Modes do ]]
[[ built in blend modes ]]
[[ custom blendmodes, if you know GL ]]

- Normal
- Replace
- Additive
- Subtractive
- Darkest
- Lightest
- Multiply


### Textures + TextureInfo

- Constructor
- texture
- colorMatrix + colorBias
[[ how to tint + recolor images ]]
- uvMatrix









## UI

## Export


