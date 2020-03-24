import { Material2, Smudge, SmudgeUI } from './index';
import {
  setLoggingLevel,
  consoleTrace,
  consoleReport,
  consoleError,
  friendlyError,
  consoleWarn,
} from './logging';
import { ColorDescription } from './material/color';
import { ILineOptions } from './draw/line';
import { Matrix } from './draw';
import { cloneDeep } from 'lodash';
import { BlendModeName, BlendMode } from './material/material';
import { Texture } from './private/texture';

let smudge: Smudge;
let ui: SmudgeUI;

// find the dir of the current script.
// current script will be the last script when it is loaded because later scripts won't be on the dom yet
const scripts = document.getElementsByTagName('script');
const path = scripts[scripts.length - 1].src.split('?')[0]; // remove any ?query
const mydir =
  path
    .split('/')
    .slice(0, -1)
    .join('/') + '/';

/** The width of the canvas */
export let canvasWidth = 0;

/** The height of the canvas */
export let canvasHeight = 0;

interface IStateLayout {
  material: Material2;
  lineOptions: ILineOptions;
  matrix: Matrix;
}

let state: IStateLayout = {
  material: new Material2(),
  lineOptions: {
    width: 1.0,
    align: 'center',
    close: false,
    uvMode: 'brush',
  },
  matrix: new Matrix(),
};

const states: IStateLayout[] = [];

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

export async function createCanvas(h = 512, w = 512) {
  setLoggingLevel('report');
  smudge = new Smudge('p5 canvas', h, w);
  ui = new SmudgeUI(smudge, { combine2D3D: true });

  canvasWidth = w;
  canvasHeight = h;
  smudge.clear();

  unpackExports();

  setTimeout(_draw, 0);
  // setTimeout(update, 0);
  return exports;
}

async function _draw() {
  if ((window as any).draw) {
    await (window as any).draw();
  }
  update();
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

export const Blend = 'Blend';
export const Replace = 'Replace';
export const Additive = 'Additive';
export const Subtractive = 'Subtractive';
export const Multiply = 'Multiply';

export const Albedo = 'albedo';
export const Emission = 'emission';
export const Height = 'height';
export const Metallic = 'metallic';
export const Smoothness = 'smoothness';

/**
 * Sets the blend mode used for compositing when drawing.
 * @param mode One of the blend mode constants: Blend | Replace | Additive | Subtractive | Multiply
 * @param channel? One of the material channels constants: Albedo | Emission | Height | Metallic | Smoothness
 * @returns void
 */
export function blendMode(mode: BlendModeName, channel?: string): void {
  if (channel === undefined) {
    // state.material.default.blendMode = BlendMode[mode];
    state.material.albedo.blendMode = BlendMode[mode];
    state.material.emission.blendMode = BlendMode[mode];
    state.material.height.blendMode = BlendMode[mode];
    state.material.metallic.blendMode = BlendMode[mode];
    state.material.smoothness.blendMode = BlendMode[mode];
    return;
  }

  if (!['albedo', 'emission', 'height', 'metallic', 'smoothness'].includes(channel)) {
    return friendlyError(`blendMode() channel parameter should be a material channel constant.`);
  }

  state.material[channel].blendMode = BlendMode[mode];
}

///////////////////////////////////////////////////////////////////////////////
// Textures

export async function loadTexture(path: string) {
  return smudge.loadTexture(path);
}

export async function loadBundledTexture(path: string) {
  console.log(mydir);
  return smudge.loadTexture(mydir + 'images/' + path);
}

export function useTexture(texture: Texture, channel?: string): void {
  if (channel === undefined) {
    // state.material.default.blendMode = BlendMode[mode];
    state.material.albedo.textureInfo.texture = texture;
    state.material.emission.textureInfo.texture = texture;
    state.material.height.textureInfo.texture = texture;
    state.material.metallic.textureInfo.texture = texture;
    state.material.smoothness.textureInfo.texture = texture;
    return;
  }

  if (!['albedo', 'emission', 'height', 'metallic', 'smoothness'].includes(channel)) {
    return friendlyError(`useTexture() channel parameter should be a material channel constant.`);
  }

  state.material[channel].textureInfo.texture = texture;
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
  smudge.rect(x, y, w, h, state.material, state.matrix);
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
  smudge.ellipse(x, y, w, h, state.material, state.matrix);
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
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param x3
 * @param y3
 * @param x4
 * @param y4
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
    state.material,
    state.matrix
  );
}

/**
 * Fills a arbitrary triangle with the current material.
 * Takes the x and y coordinates of each corner.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param x3
 * @param y3
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
    state.material,
    state.matrix
  );
}

///////////////////////////////////////////////////////////////////////////////
// Line

/**
 * Sets the width used for drawing lines
 * @param w the new width in pixels
 * @category Shapes
 */

export function lineWidth(w: number) {
  state.lineOptions.width = w;
}

/**
 * Determines if the width of the line should fall to the left, right, or center of the provided coordinates.
 * @param value 'center' | 'left' | 'right'
 * @category Shapes
 */

export function lineAlign(value: 'center' | 'left' | 'right') {
  if (!['center', 'left', 'right'].includes(value)) {
    friendlyError("lineAlign parameter should be one of 'center', 'left', or 'right'");
  }
  state.lineOptions.align = value;
}

/**
 * Determines if the last point in a multi-point line should connect with the first to create a closed shape.
 * @param value boolean
 * @category Shapes
 */

export function lineClose(value: boolean) {
  state.lineOptions.close = value;
}

/**
 * Draws a line between two points
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @category Shapes
 */
export function line(x1: number, y1: number, x2: number, y2: number): void;

/**
 * Draws a line connecting all the points given as an array.
 * @param a
 * @category Shapes
 */
export function line(points: number[][]): void;

export function line(a: number[][] | number, y1?: number, x2?: number, y2?: number): void {
  if (Array.isArray(a)) {
    smudge.line(a, state.lineOptions, state.material, state.matrix);
  }
  if (typeof a === 'number') {
    consoleTrace(state.lineOptions);
    smudge.line(
      [
        [a, y1],
        [x2, y2],
      ],
      state.lineOptions,
      state.material,
      state.matrix
    );
  }
}

///////////////////////////////////////////////////////////////////////////////
// Matrix
/**
 * Rotates the coordinate system used for drawing.
 * @param angle amount to roate in radians
 */
export function rotate(angle: number) {
  state.matrix.rotate(angle);
}

/**
 * Translates the coordinate system used for drawing.
 * @param x horizontal translation
 * @param y vertical translation
 */
export function translate(x: number, y: number) {
  state.matrix.translate(x, y, 0);
}

/**
 * Scales the coordinate system used for drawing.
 * @param x horizontal scalse
 * @param y vertical scalse
 */
export function scale(x: number, y?: number) {
  state.matrix.scale(x, y, 1);
}

/**
 * Resets the coordinate system used for drawing to the default.
 * @param x horizontal scalse
 * @param y vertical scalse
 */
export function resetMatrix() {
  state.matrix = new Matrix();
}

///////////////////////////////////////////////////////////////////////////////
// Push Pop

/**
 * Saves the current configuration state, so you can easily return to it with pop().
 *
 * The configuration state inclues the current coordinate matrix, the material settings, and the line settings.
 */
export function push() {
  states.push(cloneDeep(state));
}

/**
 * Restores the configuration state saved using push().
 *
 * The configuration state inclues the current coordinate matrix, the material settings, and the line settings.
 */
export function pop() {
  if (!states.length) {
    friendlyError('pop() called too many times. Are you pops and pushes ballanced?');
    return;
  }
  state = states.pop();
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
