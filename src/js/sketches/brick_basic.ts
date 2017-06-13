import PBR from '../pbr1';
import {Material} from '../pbr1';

export default function draw(pbr: PBR) {
  //setting parameters for canvas
  //must be 512 because defined somewhere else...
  //either let user change it or don't put it in this doc.
  let canvasX = 512;
  let canvasY = 512;

  //set up canvas "material"
  const clear = new Material(0.7, 0.7, 0.7, 1.0, 1.0, 0.0, 0.5);
  pbr.rect(0, 0, canvasX, canvasY, clear);

  // let i = 0;
  let j = 0;

  let brickWidth = 100;
  let brickHeight = 20;
  let mortarThickness = 3;

  let bricksPerRow = canvasX / (mortarThickness * 2 + brickWidth);
  let bricksPerCol = canvasY / (mortarThickness * 2 + brickHeight);

  for (let y = 0; y < canvasY; y += (canvasY / bricksPerCol) + mortarThickness) {
    j++;
    for (let x = 0; x < canvasX + brickWidth; x += (canvasX / bricksPerRow) + mortarThickness) {

      // new Material(red, green, blue, transparency, metallic, smoothness, height, emission_red, emission_green, emission_blue)
      let mat = new Material(196/255, 114/ 255, 92/255, 1.0);
      mat.red = random(165, 205)/255;
      mat.green = random(101, 120) / 255;
      mat.blue = random(75, 100) / 255;
      mat.height = 5;
      mat.metallic = 0.0;
      mat.smoothness = 0;

      // this was from "demo_grid" file. I know what it means. I think syntax is important for me to learn.
      // let mat = i++ % 2 ? odd : even;

      //alternate starting brick position if row is odd or even
      if (j % 2 == 0) {
        pbr.rect(x - brickWidth / 2, y, brickWidth, brickHeight, mat);
      } else {
        pbr.rect(x, y, brickWidth, brickHeight, mat);
      }

    }
  }


}

function random(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
}
