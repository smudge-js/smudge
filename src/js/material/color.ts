export type Gray = number | [number];
export type GrayA = [number, number];
export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];
export type ColorDescription = Gray | GrayA | RGB | RGBA;

/** @hidden */
export function colorDescriptionToRGBA(color: ColorDescription): RGBA {
    const rgba: RGBA = [0, 0, 0, 0];

    if (color === undefined) {
        return undefined;
    }

    if (typeof color === "number") {
        rgba[0] = color;
        rgba[1] = color;
        rgba[2] = color;
        rgba[3] = 1;
        return rgba;
    }
    if (color.length === 1) {
        rgba[0] = color[0];
        rgba[1] = color[0];
        rgba[2] = color[0];
        rgba[3] = 1;
        return rgba;
    }
    if (color.length === 2) {
        rgba[0] = color[0];
        rgba[1] = color[0];
        rgba[2] = color[0];
        rgba[3] = color[1];
        return rgba;
    }
    if (color.length === 3) {
        rgba[0] = color[0];
        rgba[1] = color[1];
        rgba[2] = color[2];
        rgba[3] = 1;
        return rgba;
    }
    if (color.length === 4) {
        return color as RGBA;
    }


}
