// this was from "demo_grid" file. I know what it does, I just don't know what it means. I think syntax is important for me to learn.
// let mat = i++ % 2 ? odd : even;

import { PBR, Material, BlendMode, Texture, TextureInfo } from '../../src/js/index';
import { mat4 } from 'gl-matrix';

export async function draw() {
  //setting parameters for canvas
  //must be 512 because defined somewhere else...
  //either let user change it or don't put it in this doc?
  //I made these vars so that we can reference them later in the code without asking why that number
  let canvasX = 512;
  let canvasY = 512;

  let pbr = new PBR(undefined, canvasX, canvasY);

  //set up canvas "material"
  const clear = new Material(0.7, 0.7, 0.7, 1.0, .1, .3, 0.1);
  pbr.rect(0, 0, canvasX, canvasY, clear);

  // let i = 0;
  let j = 0;

  // changeable parameters
  let brickWidth = 80;
  let brickHeight = 30;
  let mortarThickness = 2;

  // calculations to make the loop only go as long as bricks fit on canvas
  let bricksPerRow = canvasX / (mortarThickness * 2 + brickWidth);
  let bricksPerCol = canvasY / (mortarThickness * 2 + brickHeight);



  // new Material(red, green, blue, transparency, metallic, smoothness, height, emission_red, emission_green, emission_blue)
  let brickBase = new Material(185 / 255, 110 / 255, 92 / 255, 1.0);
  brickBase.height = 0.9;
  brickBase.metallic = 0.2;
  brickBase.smoothness = 0.2;

  let subRect = 10;
  let brickOverlay = new Material(185 / 255, 110 / 255, 92 / 255, 0.3);

  let numSpeckles = 100;
  let specklesWhite = new Material(1.0, 1.0, 1.0, 1.0);
  let specklesDark = new Material(0.1, 0.1, 0.1, 0.5);



  for (let y = 0; y < canvasY; y += (canvasY / bricksPerCol) + mortarThickness) {
    j++;
    for (let x = 0; x < canvasX + brickWidth; x += (canvasX / bricksPerRow) + mortarThickness) {

      let xBounds = x + brickWidth;
      let yBounds = y + brickHeight;

      brickBase.red = colorVariation(185 / 255, 20 / 255);
      brickBase.green = colorVariation(110 / 225, 10 / 225);
      brickBase.blue = colorVariation(88 / 255, 13 / 255)
      brickBase.height = random(0.5, 1.0);

      //alternate starting brick position if row is odd or even
      if (j % 2 == 0) {
        //draw brick
        pbr.rect(x - brickWidth / 2, y, brickWidth, brickHeight, brickBase);

        //draw brick overlays
        for (let o = 0; o < 200; o++) {
          brickOverlay.red = colorVariation(brickBase.red, 0.075);
          brickOverlay.green = colorVariation(brickBase.green, 0.075);
          brickOverlay.blue = colorVariation(brickBase.blue, 0.075);
          brickOverlay.height = brickBase.height;
          pbr.rect(random((x - brickWidth / 2), (x - brickWidth / 2) + brickWidth - subRect), random(y, yBounds - subRect), subRect, subRect, brickOverlay);
        }

        //draw speckles
        for (let s = 0; s < numSpeckles; s++) {
          specklesWhite.transparency = random(0.3, 0.9);
          specklesWhite.height = brickBase.height + random(-.5, -.1);
          specklesDark.height = brickBase.height + random(-.5, -.1);
          pbr.rect(random((x - brickWidth / 2), (x - brickWidth / 2) + brickWidth), random(y, y + brickHeight), 1, 1, specklesWhite);
          pbr.rect(random((x - brickWidth / 2), (x - brickWidth / 2) + brickWidth), random(y, y + brickHeight), 1, 1, specklesDark);
        }

      } else {
        //draw brick
        pbr.rect(x, y, brickWidth, brickHeight, brickBase);

        //draw brick overlays
        for (let o = 0; o < 600; o++) {
          brickOverlay.red = colorVariation(brickBase.red, 0.075);
          brickOverlay.green = colorVariation(brickBase.green, 0.075);
          brickOverlay.blue = colorVariation(brickBase.blue, 0.075);
          brickOverlay.height = brickBase.height;
          pbr.rect(random(x, xBounds - subRect), random(y, yBounds - subRect), subRect, subRect, brickOverlay);
        }

        //draw speckles
        for (let s = 0; s < numSpeckles; s++) {
          specklesWhite.transparency = random(0.3, 0.9);
          specklesWhite.height = brickBase.height + random(-.5, -.1);
          specklesDark.height = brickBase.height + random(-.5, -.1);
          pbr.rect(random(x, xBounds), random(y, yBounds), 1, 1, specklesWhite);
          pbr.rect(random(x, xBounds), random(y, yBounds), 1, 1, specklesDark);
        }
      }


    }
  }

  // pbr.rect(0, 0, 1024, 5);
  // pbr.rect(0, 1020, 1024, 5);
  // pbr.rect(0, 0, 5, 1024);
  // pbr.rect(1020, 0, 5, 1024);
}

function random(min = 0, max = 1): number {
  return Math.random() * (max - min) + min;
}

function colorVariation(c = 0, cVar = 1): number {
  return c += random(cVar * (-1), cVar);
}

// function drawBrick(x, y, width, height, material, numSpeckles){
//   pbr.rect(x, y, width, height, material);
//     let numSpeckles = 20;
//   for (let s=0; s<numSpeckles; s++){
//         pbr.rect(random(x,x+brickWidth),random(y,y+brickHeight),1,1,specklesMat);
//       }
// }
