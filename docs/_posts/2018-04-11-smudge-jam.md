---
layout: post
title: "Smudge Jam"
date: 2018-04-11 00:01:02 -0500
categories: smudge
author: Justin Bakse
poster_image: /media/jam/jam_render.png
---

Smudge Jam will be small, informal, invite-only code jam held to collect feedback on **Smudge**.

Smudge Jam will be held on:<br/>
**Saturday April 21, 2pm to 8pm+**

Smudge Jam will be held at:<br/>
**Parsons Design + Technology Studios, Room D1208, 6 East 16th Street, Manhattan**

## What is Smudge?

**Smudge** is a half-baked, untested, undocumented, and unstable JavaScript library for procedurally generating images with physical properties like smoothness and metallicness, heavily influenced by [Processing](https://processing.org/) and [Substance Designer](https://www.allegorithmic.com/products/substance-designer).

Like Processing, Smudge allows you to create images by drawing basic shapes like rectangles and circles. But Smudge allows you much more control over the material properties used to draw. You can specify the albedo (base color), smoothness, metallicness, height, and emissive colors. Smudge renders your drawing to separate buffers for each property and can export a texture set that can be used with [Physically Based Rendering](https://www.marmoset.co/posts/basic-theory-of-physically-based-rendering/) in applications like Unity.

Adding PBR properties to the toolkit allows you to procedurally generate images with more lifelike material properties—metallic foils, shiny acrylics, matte tempras, glossy clear coats—and achieve some effects—like paint buildup—much more easily.

An interactive demo is worth a 1000 words. You can drag the cube below to rotate it to see how the drawing interacts with the simulated environmental lighting.

<div id="sketch_jam" class="smudge-wrap"></div>
<script src="/smudge/media/sketches_2/jam.js" data-ui-target="sketch_jam"></script>

Here is the code that draws that golden circle.

```javascript
const goldLeaf = new Material2();
goldLeaf.albedo.color = [1, 0.8, 0];
goldLeaf.smoothness.color = 0.6;
goldLeaf.metallic.color = 0.9;
goldLeaf.height.color = 0.0005;
smudge.ellipse(50, 50, 412, 412, goldLeaf);
```

Here is [all of the code](/smudge/media/brick/brick.js).

Here is [a brick wall](/smudge/media/brick/brick.js).

Here is [the Smudge Blog](/smudge/), but it's a bit of a mess.

## What is Smudge Jam?

Smudge Jam will be small, informal code jam held to collect feedback on **Smudge**.

I want to learn what works, what doesn't, and how people might use it. This will help me to decide how (and whether) to move forward with this project.

<span style="font-size: 2em; line-height: 2;">Cheap food and drinks will be provided!<br/>Music will be provided!<br/>Stupid, worthless prizes will be provided!<br/>Computers will **not** be provided. Bring your own laptop.</span>

### Agenda

We'll get each other set up and started with the Smudge library. We'll hang out and code. There may be a survey. At the end we'll show off what we make and we'll vote on who gets the stupid, worthless prizes. Everyone who participates can put it on their CV. I hope you can come!

- **2:00** Welcome
- **2:15** Introduction to PBR + Smudge
- **3:00** Coding, Coding, Coding
- **6:00** Show off, Voting, Awards
- **7:00+** Food, Social

### Smudge Jam Pack

Download the [Smudge Jam Pack](/smudge/smudge_jam_pack.zip) to get the library and some examples.

### Smudge Jam FAQ

I'll (maybe) be posting answers to questions on the [Smudge Jam FAQ](/smudge/posts/smudge-jam-faq.html) during the event.
