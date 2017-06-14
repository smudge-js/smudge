import PBR from '../pbr1';
import {Material} from '../pbr1';

export default function draw(pbr: PBR) {
  // setting parameters for canvas
  let canvasX = 1024;
  let canvasY = 1024;

  // changeable parameters
  let brickWidth = 120;
  let brickHeight = 40;
  let mortarThickness = 2.5;

  // calculations to make the loop only go as long as bricks fit on canvas
  let bricksPerRow = canvasX / (mortarThickness * 2 + brickWidth);
  let bricksPerCol = canvasY / (mortarThickness * 2 + brickHeight);



  // new Material(red, green, blue, transparency, metallic, smoothness, height, emission_red, emission_green, emission_blue)

  //set up canvas "material"
  const mortar = new Material(0.7, 0.7, 0.7, 1.0, 1.0, 0.0, 0.1);

  let mortarTexture = new Material (0.8, 0.8, 0.8, 1.0);
  mortarTexture.height = 0.25;

  let brickBase = new Material(185 / 255, 110 / 255, 92 / 255, 0.7);
  brickBase.height = 0.17;
  brickBase.metallic = 0.0;
  brickBase.smoothness = 0;

  let subRect = 10;
  let brickOverlay = new Material(185 / 255, 110 / 255, 92 / 255, 0.3);

  let numSpeckles = 100;
  let specklesWhite = new Material(1.0, 1.0, 1.0, 1.0);
  let specklesDark = new Material(0.1, 0.1, 0.1, 0.3);
  specklesDark.transparency = 0.3;

  let xStart = 0;
  let j = 0;

  //draw canvas/mortar
    pbr.rect(0, 0, canvasX, canvasY, mortar);
    for (let c = 0; c < 10000; c++) {
      pbr.rect(random(0, canvasX), random(0, canvasY), random(1,2), random(1,2), mortarTexture);
    }


  for (let y = 0; y < canvasY; y += (canvasY / bricksPerCol) + mortarThickness) {
    j++;
    for (let x = 0; x < canvasX + brickWidth; x += (canvasX / bricksPerRow) + mortarThickness) {

      brickBase.red = colorVariation(185 / 255, 20 / 255);
      brickBase.green = colorVariation(110 / 225, 10 / 225);
      brickBase.blue = colorVariation(88 / 255, 13 / 255)


      let yBounds = y + brickHeight;

        if (j % 2 == 0) {
          xStart = x - brickWidth / 2;
        } else {
          xStart = x;
        }

        //draw brick
        pbr.rect(xStart, y, brickWidth, brickHeight, brickBase);

        brickOverlay.height = random(0.4, 0.9);

        //draw brick overlays
        for (let o = 0; o<600; o++){
          brickOverlay.red = colorVariation(brickBase.red, 0.075);
          brickOverlay.green = colorVariation(brickBase.green, 0.075);
          brickOverlay.blue = colorVariation(brickBase.blue, 0.075);
          brickOverlay.height += random(0.01, 0.1);
          pbr.rect(random(xStart, xStart + brickWidth - subRect), random(y, yBounds-subRect), subRect, subRect, brickOverlay);
        }


        //draw speckles
        specklesWhite.height = brickOverlay.height - 0.05;
        specklesDark.height = brickOverlay.height;
        for (let s = 0; s < numSpeckles; s++) {
          specklesWhite.transparency = 0.1;
          pbr.rect(random(xStart, xStart + brickWidth), random(y, yBounds), random(1,2), random(1,2), specklesWhite);
          pbr.rect(random(xStart, xStart + brickWidth), random(y, yBounds), 1, 1, specklesDark);
        }


    }
  }


}

function random(min = 0, max = 1): number {
  return Math.random() * (max - min) + min;
}

function colorVariation(c = 0, cVar = 1): number {
  return c += random(cVar * (-1), cVar);
}
