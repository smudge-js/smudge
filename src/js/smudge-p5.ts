import { Material2, Smudge, SmudgeUI } from './index';
import {
  setLoggingLevel,
  consoleTrace,
  consoleReport,
  consoleError,
  friendlyError,
} from './logging';
import { ColorDescription } from './material/color';

let smudge: Smudge;
let ui: SmudgeUI;
const state = {
  material: new Material2(),
};

export function createCanvas(h = 512, w = 512) {
  setLoggingLevel('warn');
  smudge = new Smudge('p5 canvas', h, w);

  ui = new SmudgeUI(smudge);
  smudge.clear();

  unpackExports();
  setTimeout(update, 0);

  return exports;
}

///////////////////////////////////////////////////////////////////////////////
// Materials
/**
 * Set the color used for the albedo of the current material.
 * @param  {number} a
 * @param  {number} b
 * @param  {number} c
 * @param  {number} d
 */
export function albedo(
  a: number,
  b: number,
  c: number,
  d: number
): ColorDescription {
  if (arguments.length === 0) {
    state.material.albedo.color = undefined;
  } else if (arguments.length === 1) {
    state.material.albedo.color = a;
  } else if (arguments.length === 2) {
    state.material.albedo.color = [a, b];
  } else if (arguments.length === 3) {
    state.material.albedo.color = [a, b, c];
  } else if (arguments.length === 4) {
    state.material.albedo.color = [a, b, c, d];
  } else {
    friendlyError('Too many parameters passed to color()');
  }

  return state.material.albedo.color;
}
export function noAlbedo() {
  state.material.albedo.color = undefined;
}

export function metallic(v: number, a: number) {
  if (arguments.length === 0) {
    state.material.metallic.color = undefined;
  } else if (arguments.length === 1) {
    state.material.metallic.color = v;
  } else if (arguments.length === 2) {
    state.material.metallic.color = [v, a];
  } else {
    friendlyError('Too many parameters passed to metallic()');
  }
  return state.material.metallic.color;
}

export function noMetallic() {
  state.material.metallic.color = undefined;
}

export function smoothness(v: number, a: number) {
  if (arguments.length === 0) {
    state.material.smoothness.color = undefined;
  } else if (arguments.length === 1) {
    state.material.smoothness.color = v;
  } else if (arguments.length === 2) {
    state.material.smoothness.color = [v, a];
  } else {
    friendlyError('Too many parameters passed to smoothness()');
  }
  return state.material.smoothness.color;
}

export function noSmoothness() {
  state.material.smoothness.color = undefined;
}

export function emission(a: number, b: number, c: number, d: number) {
  if (arguments.length === 0) {
    state.material.emission.color = undefined;
  } else if (arguments.length === 1) {
    state.material.emission.color = a;
  } else if (arguments.length === 2) {
    state.material.emission.color = [a, b];
  } else if (arguments.length === 3) {
    state.material.emission.color = [a, b, c];
  } else if (arguments.length === 4) {
    state.material.emission.color = [a, b, c, d];
  } else {
    friendlyError('Too many parameters passed to emission()');
  }

  return state.material.emission.color;
}

export function noEmission() {
  state.material.emission.color = undefined;
}

export function height(v: number, a: number) {
  if (arguments.length === 0) {
    state.material.height.color = undefined;
  } else if (arguments.length === 1) {
    state.material.height.color = v;
  } else if (arguments.length === 2) {
    state.material.height.color = [v, a];
  } else {
    friendlyError('Too many parameters passed to height()');
  }
  return state.material.height.color;
}

export function noHeight() {
  state.material.height.color = undefined;
}

///////////////////////////////////////////////////////////////////////////////
// Shapes

export function background() {
  smudge.clear(state.material);
}

export function rect(x: number, y: number, w: number, h: number) {
  smudge.rect(x, y, w, h, state.material);
}

export function square(x: number, y: number, w: number) {
  rect(x, y, w, w);
}

export function ellipse(x: number, y: number, w: number, h: number) {
  smudge.ellipse(x, y, w, h, state.material);
}

export function circle(x: number, y: number, d: number) {
  ellipse(x, y, d, d);
}

export function quad(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
) {
  smudge.quad(
    [
      [x1, y1],
      [x2, y2],
      [x3, y3],
      [x4, y4],
    ],
    state.material
  );
}

export function triangle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  smudge.quad(
    [
      [x1, y1],
      [x2, y2],
      [x2, y2],
      [x3, y3],
    ],
    state.material
  );
}

///////////////////////////////////////////////////////////////////////////////
// Unsupported p5

export function fill() {
  friendlyError('fill() is not supported.');
}
export function noFill() {
  friendlyError('noFill() is not supported.');
}
export function stroke() {
  friendlyError('stroke() is not supported.');
}
export function noStroke() {
  friendlyError('noStroke() is not supported.');
}

///////////////////////////////////////////////////////////////////////////////
// Private

function unpackExports() {
  for (const e in exports) {
    (window as any)[e] = exports[e];
  }
}

function update() {
  ui.update2D();
  ui.update3D();
}

///////////////////////////////////////////////////////////////////////////////
// Startup

consoleReport('hello smudge-p5');
(window as any).createCanvas = createCanvas;
