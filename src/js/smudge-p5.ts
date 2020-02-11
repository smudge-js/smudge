import { Material2, Smudge, SmudgeUI } from "./index";
import { ColorDescription } from "./material/color";

console.log("hello smudge-p5");

export let testString = "test string";

let smudge: Smudge;
let ui: SmudgeUI;
let state = {
  material: new Material2()
};

export function createCanvas(h = 512, w = 512) {
  Smudge.setLoggingLevel("warn");
  smudge = new Smudge("p5 canvas", h, w);

  ui = new SmudgeUI(smudge);
  smudge.clear();

  unpackScope();
  setTimeout(update, 0);
}

export function noColor() {
  state.material.albedo.color = undefined;
  return state.material.albedo.color;
}
export function color(a: number, b: number, c: number, d: number) {
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
  }

  return state.material.albedo.color;
  // @todo clean up console, use the log library in -p5, turn off noise
}

export function rect(l: number, t: number, w: number, h: number) {
  smudge.rect(l, t, w, h, state.material);
}

function unpackScope() {
  // @todo can we enumerate "exports" to make this auto?
  (window as any).color = color;
  (window as any).noColor = noColor;
  (window as any).rect = rect;
}

function update() {
  ui.update2D();
  ui.update3D();
}

(window as any).createCanvas = createCanvas;
