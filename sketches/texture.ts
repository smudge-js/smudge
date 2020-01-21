import { Material2, Smudge, SmudgeUI } from "../src/js";
import { UVMatrix } from "../src/js/draw";

export async function draw() {
  // create a smudge instance
  const smudge = new Smudge(undefined, 512, 512);

  // load a texture
  const texture_a = await smudge.loadTexture("images/letter_a.png");
  const burst = await smudge.loadTexture("images/burst_white_transparent.png");
  // show the ui
  const ui = new SmudgeUI(smudge);

  // clear the drawing
  const paper = new Material2();
  paper.albedo.color = [0.5];
  smudge.clear(paper);

  // draw a basic textured rect
  const basic_material = new Material2();
  basic_material.albedo.color = 1;
  basic_material.albedo.textureInfo.texture = texture_a;
  smudge.rect(0, 0, 200, 200, basic_material);

  // draw texture to other channels
  const smooth_material = new Material2();
  smooth_material.albedo.color = [0.3, 0.3, 0];
  smooth_material.smoothness.color = 1;
  smooth_material.smoothness.textureInfo.texture = texture_a;
  smudge.rect(200, 0, 200, 200, smooth_material);

  // manipulate texture colors
  const colorized_material = new Material2();
  colorized_material.albedo.color = 1;
  colorized_material.albedo.textureInfo.texture = texture_a;
  colorized_material.albedo.textureInfo.colorBias = [1, 1, 1, 0];
  colorized_material.albedo.textureInfo.colorMatrix = [
    -1, 0, 0, 0,
    0, -.5, 0, 0,
    0, 0, -1, 0,
    0, 0, 0, 1,
  ];
  smudge.rect(0, 200, 200, 200, colorized_material);

  // transform texture
  const transformed_texture = new Material2();
  transformed_texture.albedo.color = 1;
  transformed_texture.albedo.textureInfo.texture = texture_a;
  transformed_texture.albedo.textureInfo.uvMatrix = new UVMatrix().translate(.5, .5).rotate(3.14 * .25).scale(2).translate(-.5, -.5).get();
  smudge.rect(200, 200, 200, 200, transformed_texture);

  // show albedo in ui

  ui.update3D();
}

draw();
