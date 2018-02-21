// import {PBR} from '../pbr2';
// import {Material, BlendMode} from '../material';

import { PBR, Material, BlendMode } from '../smudge';

export function draw() {

  let canvasWidth = 128;
  let canvasHeight = 128;

  let pbr = new PBR(undefined, canvasWidth, canvasHeight);

  const background = new Material(1.0, 1.0, 1.0, 1.0);
  const black = new Material(0, 0, 0, 1);

  pbr.rect(0, 0, canvasWidth, canvasWidth, background); // background

  radialGradient(15, 15, 100, 100, black);

  pbr.show();

  function radialGradient(xVal: number, yVal: number, width: number, height: number, mat: Material) {
    for (let x = xVal; x < width + xVal; x++) {
      for (let y = yVal; y < height + yVal; y++) {
        let d = dist(x, y, width / 2 + xVal, height / 2 + yVal);
        let t = map(d, 0, height / 2, 1, 0);
        mat.transparency = t;
        pbr.rect(x, y, 1, 1, mat);
      }
    }
  }

}



function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function map(in_val: number, in_min: number, in_max: number, out_min: number, out_max: number) {
  return (in_val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function random(min = 0, max = 1): number {
  return Math.random() * (max - min) + min;
}
