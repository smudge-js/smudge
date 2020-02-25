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

///////////////////////////////////////////////////////////////////////////////
// Setup

/**
 * Create a new canvas to draw into.
 *
 * It is generally a good idea to set `h` and `w` to the same power of 2 value
 * (e.g. 512x512, 1024x1024)
 *
 * @param h The height of canvas in pixels.
 * @param w The width of the canvas in pixels.
 * @category Setup
 */
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
 * Sets the color drawn to the **Albedo** channel when filling shapes.
 *
 * @param r The intensity of the red component, 0 to 1
 * @param g The intensity of the green component, 0 to 1
 * @param b The intensity of the blue component, 0 to 1
 * @param a The alpha value used for compositing, 0 to 1
 * @returns The newly set albedo color.
 * @category Materials
 */

export function albedo(r: number, g: number, b: number, a: number): ColorDescription;
export function albedo(r: number, g: number, b: number): ColorDescription;
export function albedo(gray: number, a: number): ColorDescription;
export function albedo(gray: number): ColorDescription;
export function albedo(color: ColorDescription): ColorDescription;
export function albedo(): ColorDescription;
export function albedo(a?: number, b?: number, c?: number, d?: number): ColorDescription {
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

/**
 * Disables drawing to the **Albedo** channel when filling shapes.
 * @category Materials
 */
export function noAlbedo() {
  state.material.albedo.color = undefined;
}

/**
 * Sets the value drawn to the **Metallic** channel when filling shapes.
 * @param m The intensity of the metalic component, 0 to 1
 * @param a The alpha value used for compositing, 0 to 1
 * @category Materials
 */
export function metallic(m: number): ColorDescription;
export function metallic(color: ColorDescription): ColorDescription;
export function metallic(): ColorDescription;
export function metallic(m?: number, a?: number): ColorDescription {
  if (arguments.length === 0) {
    state.material.metallic.color = undefined;
  } else if (arguments.length === 1) {
    state.material.metallic.color = m;
  } else if (arguments.length === 2) {
    state.material.metallic.color = [m, a];
  } else {
    friendlyError('Too many parameters passed to metallic()');
  }
  return state.material.metallic.color;
}

/**
 * Disables drawing to the **Metallic** channel when filling shapes.
 * @category Materials
 */
export function noMetallic() {
  state.material.metallic.color = undefined;
}

/**
 * Sets the value drawn to the **Height** channel when filling shapes.
 * @param m The intensity of the height component, 0 to 1
 * @param a The alpha value used for compositing, 0 to 1
 * @category Materials
 */
export function smoothness(s: number): ColorDescription;
export function smoothness(color: ColorDescription): ColorDescription;
export function smoothness(): ColorDescription;
export function smoothness(s?: number, a?: number) {
  if (arguments.length === 0) {
    state.material.smoothness.color = undefined;
  } else if (arguments.length === 1) {
    state.material.smoothness.color = s;
  } else if (arguments.length === 2) {
    state.material.smoothness.color = [s, a];
  } else {
    friendlyError('Too many parameters passed to smoothness()');
  }
  return state.material.smoothness.color;
}

/**
 * Disables drawing to the **Smoothness** channel when filling shapes.
 * @category Materials
 */
export function noSmoothness() {
  state.material.smoothness.color = undefined;
}

/**
 * Sets the color drawn to the **Emission** channel when filling shapes.
 *
 * @param r The intensity of the red component, 0 to 1
 * @param g The intensity of the green component, 0 to 1
 * @param b The intensity of the blue component, 0 to 1
 * @param a The alpha value used for compositing, 0 to 1
 * @returns The newly set emission color.
 * @category Materials
 */

export function emission(r: number, g: number, b: number, a: number): ColorDescription;
export function emission(r: number, g: number, b: number): ColorDescription;
export function emission(gray: number, a: number): ColorDescription;
export function emission(gray: number): ColorDescription;
export function emission(color: ColorDescription): ColorDescription;
export function emission(): ColorDescription;

export function emission(a?: number, b?: number, c?: number, d?: number) {
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

/**
 * Disables drawing to the **Emission** channel when filling shapes.
 * @category Materials
 */
export function noEmission() {
  state.material.emission.color = undefined;
}

/**
 * Sets the value drawn to the **Height** channel when filling shapes.
 * @param m The intensity of the height component, 0 to 1
 * @param a The alpha value used for compositing, 0 to 1
 * @category Materials
 */
export function height(h: number): ColorDescription;
export function height(color: ColorDescription): ColorDescription;
export function height(): ColorDescription;
export function height(h?: number, a?: number) {
  if (arguments.length === 0) {
    state.material.height.color = undefined;
  } else if (arguments.length === 1) {
    state.material.height.color = h;
  } else if (arguments.length === 2) {
    state.material.height.color = [h, a];
  } else {
    friendlyError('Too many parameters passed to height()');
  }
  return state.material.height.color;
}

/**
 * Disables drawing to the **Height** channel when filling shapes.
 * @category Materials
 */
export function noHeight() {
  state.material.height.color = undefined;
}

///////////////////////////////////////////////////////////////////////////////
// Shapes
/**
 * Clears all channels of the full canvas to the values in the current material.
 * @category Shapes
 */
export function background() {
  smudge.clear(state.material);
}

/**
 * Fills a rectangle with the current material.
 * @param x The horizonal position
 * @param y The vertial position
 * @param w The width
 * @param h The Height
 * @category Shapes
 */
export function rect(x: number, y: number, w: number, h: number) {
  smudge.rect(x, y, w, h, state.material);
}

/**
 * Fills a square with the current material.
 * @param x The horizonal position
 * @param y The vertial position
 * @param w The width and height
 * @category Shapes
 */
export function square(x: number, y: number, w: number) {
  rect(x, y, w, w);
}

/**
 * Fills an ellipse with the current material.
 * @param x The horizonal position
 * @param y The vertial position
 * @param w The width
 * @param h The Height
 * @category Shapes
 */
export function ellipse(x: number, y: number, w: number, h: number) {
  smudge.ellipse(x, y, w, h, state.material);
}

/**
 * Fills a circle with the current material.
 * @param x The horizonal position
 * @param y The vertial position
 * @param d The diameter
 * @category Shapes
 */
export function circle(x: number, y: number, d: number) {
  ellipse(x, y, d, d);
}

/**
 * Fills a arbitrary quadrilateral with the current material.
 * Takes the x and y coordinates of each corner.
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @param  {number} x3
 * @param  {number} y3
 * @param  {number} x4
 * @param  {number} y4
 * @category Shapes
 */
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

/**
 * Fills a arbitrary triangle with the current material.
 * Takes the x and y coordinates of each corner.
 * @param  {number} x1
 * @param  {number} y1
 * @param  {number} x2
 * @param  {number} y2
 * @param  {number} x3
 * @param  {number} y3
 * @category Shapes
 */
export function triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
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

/**
 * This function exists in p5 but is not supported in smudge.
 * @category Unsupported
 */
export function fill() {
  friendlyError('fill() is not supported.');
}
/**
 * This function exists in p5 but is not supported in smudge.
 * @category Unsupported
 */
export function noFill() {
  friendlyError('noFill() is not supported.');
}
/**
 * This function exists in p5 but is not supported in smudge.
 * @category Unsupported
 */
export function stroke() {
  friendlyError('stroke() is not supported.');
}
/**
 * This function exists in p5 but is not supported in smudge.
 * @category Unsupported
 */
export function noStroke() {
  friendlyError('noStroke() is not supported.');
}

///////////////////////////////////////////////////////////////////////////////
// Private

function unpackExports() {
  // tslint:disable-next-line:forin
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
