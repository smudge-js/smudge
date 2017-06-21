import { PBR, Material, BlendMode } from '../pbr';

export function draw() {

  let canvasWidth = 2048;
  let canvasHeight = 2048;

  let pbr = new PBR(undefined, canvasWidth, canvasHeight);

  // new Material(red, green, blue, transparency, metallic, smoothness, height, emission_red, emission_green, emission_blue)
  const background = new Material(0.8, 0.8, 0.8, 1.0, 0.8, 0.2,0.2);
  const black = new Material(0, 0, 0, 1, 0.8, 0,0.1);
  // black.albedo_blend_mode = BlendMode.Additive;

  pbr.rect(0, 0, canvasWidth, canvasWidth, background); // background

  let linesCount = 1000;
  let minLineLength=50;

  for (let g = 0; g<linesCount; g++){
    let diameter = random(5,15);
    black.transparency=random(0.05,0.3);
    pbr.rect(random(-150,150),random(0,canvasHeight),random(minLineLength,canvasWidth+150),1,black);

  };

  pbr.show();

  function ellipse(xVal: number, yVal: number, width: number, height: number, mat: Material) {
    for (let x = xVal; x < width+xVal; x++) {
      for (let y = yVal; y < height+yVal; y++) {
        let d = dist(x, y, width/2 + xVal, height/2 + yVal);
        let t = map(d, 0, height / 2, 1, 0);
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
