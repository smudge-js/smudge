import { PBR, Material, BlendMode, Texture, TextureInfo } from '../../pbr';
import { mat4 } from 'gl-matrix';

export async function draw() {



  let canvasWidth = 2048;
  let canvasHeight = 2048;

  let pbr = new PBR(undefined, canvasWidth, canvasHeight);


  // new Material(red, green, blue, transparency, metallic, smoothness, height, emission_red, emission_green, emission_blue)
  const background = new Material(0.3, 0.3, 0.3, 1.0, 0.2, 0.2, 0.1);
  const metalLines = new Material(0, 0, 0, 0.1, 0.2, 0, 0.1);
  metalLines.height = 0.3;
  metalLines.height_blend_mode = BlendMode.Additive;
  // black.albedo_blend_mode = BlendMode.Additive;

  pbr.rect(0, 0, canvasWidth, canvasWidth, background); // background

  let linesCount = 3000;
  let rectsCount = 3000;
  let specklesCount = 100000;
  let minLineLength = 50;

  for (let r = 0; r < rectsCount; r++) {
    metalLines.height = random(0, 0.3);
    metalLines.transparency = 0;
    pbr.rect(random(0, canvasWidth), random(0, canvasHeight), random(100, 200), random(100, 200), metalLines);
  };

  for (let l = 0; l < linesCount; l++) {
    let diameter = random(5, 15);
    metalLines.transparency = 0.05;
    metalLines.height = random(0.075, 0.125);
    pbr.rect(random(0 - canvasWidth, canvasWidth), random(0, canvasHeight), random(minLineLength, canvasWidth), random(1, 3), metalLines);
  };

  for (let s = 0; s < specklesCount; s++) {
    metalLines.transparency = 0.05;
    metalLines.height = 0;
    pbr.rect(random(0 - canvasWidth, canvasWidth), random(0, canvasHeight), random(4, 10), random(4, 10), metalLines);
  };



  pbr.show();

  function ellipse(xVal: number, yVal: number, width: number, height: number, mat: Material) {
    for (let x = xVal; x < width + xVal; x++) {
      for (let y = yVal; y < height + yVal; y++) {
        let d = dist(x, y, width / 2 + xVal, height / 2 + yVal);
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
