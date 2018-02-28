// import {PBR} from '../pbr2';
// import {Material, BlendMode} from '../material';

import { PBR, Material, BlendMode } from '../../src/js/index';

export function draw() {

  let canvasWidth = 128;
  let canvasHeight = 128;

  let pbr = new PBR(undefined, canvasWidth, canvasHeight);

  const background = new Material(1.0,1.0,1.0,1.0);
  const black = new Material(0,0,0,1);

  pbr.clear();

  pbr.rect(0, 0, canvasWidth, canvasWidth, background); // background

  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      let d = dist(x, y, canvasWidth / 2, canvasHeight / 2);
      var t = map(d, 0, canvasHeight / 2, 1, 0);
      black.transparency = t;
      pbr.rect(x, y, 1, 1, black);

    }
  }

  pbr.show();

}

function dist(x1:number,y1:number,x2:number,y2:number){
  return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
}

function map(in_val:number, in_min:number, in_max:number, out_min:number, out_max:number) {
  return ( in_val - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}
