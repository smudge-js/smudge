import { Material2, Smudge, SmudgeUI } from "../src/js/index";

export async function draw() {
  const smudge = new Smudge(undefined, 512, 512);
  const ui = new SmudgeUI(smudge);

  const tex_a = await smudge.loadTexture("images/letter_a.png");

  const myClear = new Material2();
  myClear.albedo.color = [1, 0, 0];
  smudge.clear(myClear);

  // draw a rect
  const myMaterial = new Material2();
  myMaterial.albedo.color = 1;

  // prettier-ignore
  // don't mess up the matrix format
  myMaterial.albedo.textureInfo.colorMatrix = [
    1, 0, 0, 1,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0
  ];
  myMaterial.albedo.textureInfo.colorBias = [0, 0, 0, 0];
  myMaterial.albedo.textureInfo.texture = tex_a;
  smudge.rect(50, 50, 400, 400, myMaterial);

  // show albedo in ui
  ui.update2D();
  ui.update3D();
}

draw();
