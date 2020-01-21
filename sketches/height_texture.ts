import { Material2, Smudge, SmudgeUI } from "../src/js/index";

export async function draw() {
  // create a smudge instance
  const smudge = new Smudge(undefined, 512, 512);

  const clouds = await smudge.loadTexture("images/clouds.png");

  // show the ui
  const ui = new SmudgeUI(smudge);

  // clear the drawing
  smudge.clear();

  // draw a rect
  const testMaterial = new Material2();
  testMaterial.albedo.color = 0.8;
  testMaterial.height.textureInfo.texture = clouds;
  testMaterial.height.color = 0.01;
  smudge.rect(0, 0, 512, 512, testMaterial);

  // show albedo in ui
  ui.update2D();
  ui.update3D();
}

draw();
