import { Material2, Smudge, SmudgeUI, BlendMode } from "../src/js/index";
// import { Matrix } from '../src/js/draw/matrix';

export async function draw() {
  // create a smudge instance
  const smudge = new Smudge("case_study", 512, 512);

  // load a texture
  const noseBrush = await smudge.loadTexture("images/nose_brush.png");

  // show the ui
  const ui = new SmudgeUI(smudge);

  // clear the background to a rough, metallic, brown
  const clearMaterial = new Material2();
  clearMaterial.albedo.color = [0.4, 0.2, 0.1, 1];
  clearMaterial.metallic.color = 1;
  clearMaterial.smoothness.color = 0.1;
  smudge.clear(clearMaterial);

  // create paint material
  // white, slightly translucent, somewhat shiny, not very metalic
  const paintMaterial = new Material2();
  paintMaterial.albedo.color = [0.9, 0.95];
  paintMaterial.smoothness.color = 0.5;
  paintMaterial.metallic.color = 0.15;

  // and give it some height, rounded off with using a shaping texture
  paintMaterial.height.color = [0.01, 0.1];
  paintMaterial.height.textureInfo.texture = noseBrush;
  paintMaterial.height.blendMode = BlendMode.Additive;

  // now caluclate the points in the line
  let x = 256;
  let y = 256;
  const width = 20;
  let segment_length = 1;
  const delta_length = 0.01;
  let angle = 0;
  const segments = 1000;
  const points = [];
  for (let i = 0; i < segments; i++) {
    x = x + Math.sin(angle) * segment_length;
    y = y + Math.cos(angle) * segment_length;
    angle += 0.04 + Math.random() * 0.05;
    segment_length += delta_length;
    points.push([x, y]);
  }

  // draw the line
  smudge.line(points, { width, uvMode: "brush" }, paintMaterial);

  // show the drawing in the ui
  ui.update3D();
  ui.update2D();
}

draw();
