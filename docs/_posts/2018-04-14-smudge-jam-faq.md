---
layout: post
title: "Smudge Jam FAQ"
date: 2018-04-11 00:01:01 -0500
categories: smudge
author: Justin Bakse
poster_image: /media/jam/arcs_render.jpg
---

## Quick Start

1. Open this folder in VS Code.
2. Open Chrome
3. Install "Live Sever" Extension, if needed, restart.
4. Press the "Go Live" button in the info bar at the bottom of VS Code.

## Now What?

1. Try some different examples by changing editing the last `<script>` tag in `index.html`
2. Look at the [Smudge Blog](https://jbakse.github.io/smudge/) for some more info about Smudge, including a [general introduction](https://jbakse.github.io/smudge/)
3. Look at the [Smudge API Documentation](https://jbakse.github.io/smudge/api_doc/)
4. Look at the [Smudge Jam FAQ](https://jbakse.github.io/smudge/posts/smudge-jam-faq.html)
5. Copy one of the examples and start hacking.

<!-- ## What is PBR

## Creating a material

## Drawing shapes

    rects
    line
    quad
    ellipse

## Using a texture

## Prompts

## Award Categories

    robot face
    subway wall -->

## Coordinates

- `[0,0]` is the bottom left hand corner.
- `+x` is right
- `+y` is up

## Materials

You work with Materials a lot in Smudge. Here is a cheat sheet for Materials, including the type and default value for a new Material.

```c
Material
    default: MaterialChannel
        color: ColorDescription = undefined
        blendMode: IBlendMode = BlendMode.Blend
        textureInfo: TextureInfo
                public texture: Texture = undefined
                public colorMatrix: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
                public colorBias: number[] = [0, 0, 0, 0];
                public uvMatrix: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    albedo: MaterialChannel = undefined
    metallic: MaterialChannel = undefined
    smoothness: MaterialChannel = undefined
    height: MaterialChannel = undefined
    emission: MaterialChannel = undefined
```

Materials have 5 physical property MaterialChannels: albedo (base color), matallic, smoothness, height, emission (glow)

Materials also have a `default` MaterialChannel. If a property channel is undefined, values from `default` are used.

### MaterialChannels

- color
  - the color/value to write to that properties channel.
  - Color values are 0-1.
  - If `color === undefined` nothing is written to the channel.
  - Colors can be given as a single grayscale scalar: `.5`; grayscale array `[.5]`, grayscale+alpha array: `[.5, 1]`, rgb array: `[.5, 0, 0]`, or rgba array: `[.5, .5, .5, .5]`
- blendMode
  - how to blend the material to the destination channel
  - BlendMode.Blend
  - BlendMode.Replace
  - BlendMode.Additive
  - BlendMode.Subtractive
  - BlendMode.Multiply
- textureInfo.texture
  - the texture to use when drawing
  - is multiplied with `color`
  - if `textureInfo.texture === undefined` a texture is not used
- textureInfo.colorMatrix
  - [tricky]
  - a matrix to multiply the src color by, can be used for swizzling colors
- textureInfo.colorBias
  - [tricky]
  - a number to add to the RGBA values
- textureInfo.uvMatrix
  - a matrix to multiply the UVs by
  - this is used to rotate/scale the texture on the shape being drawn

### Material Tips

To make a deep clone of a material, you can use lodash, which is already loaded in the jamp pack index:

```javascript
cloneMat = _.cloneDeep(material);
```
