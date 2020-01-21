const getNormals = require("polyline-normals");
import { defaults, each } from "lodash";

import { consoleError } from "../logging";

import { Quad } from "./quad";
const _ = { defaults, each };

export interface ILineOptions {
  width?: number;
  align?: "center" | "left" | "right";
  close?: boolean;
  uvMode?: "segment" | "stretch_points" | "brush";
}

/**
 * capLine does a couple of tightly related things:
 * - adds a point `capDistance` from the front of the line and `capDistance` from the end of the line
 * - calculates the uvX positions for a brush capped line
 */

function capLine(points: number[][], capDistance = 0) {
  // return early if nothing to do
  // if (capDistance === 0) {
  //     return { points, startCapIndex: 0, endCapIndex: points.length };
  // }
  if (points.length < 2) {
    consoleError("capLine requires line with at least two points");
    return undefined;
  }

  // find length of line
  let lineLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const length = Math.sqrt(x * x + y * y);
    lineLength += length;
  }

  // adjust cap size
  capDistance = Math.min(capDistance, lineLength * 0.5);

  // walk the line again, find the index and position of the cap points
  let walkedLength = 0;
  let startCapIndex: number;
  let endCapIndex: number;
  const cappedPoints: number[][] = [];
  const uvXs: number[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const length = Math.sqrt(x * x + y * y);

    // push the current point
    cappedPoints.push(a);

    // calc, push uvX
    if (walkedLength < capDistance) {
      const uvX = (walkedLength / capDistance) * 0.5;
      uvXs.push(uvX);
    } else if (walkedLength > lineLength - capDistance) {
      const uvX =
        ((walkedLength - (lineLength - capDistance)) / capDistance) * 0.5 + 0.5;
      uvXs.push(uvX);
    } else {
      uvXs.push(0.5);
    }

    // find start cap, insert point + uvX
    if (walkedLength < capDistance && walkedLength + length >= capDistance) {
      const n = (capDistance - walkedLength) / length;
      const startCapPosition = [a[0] + x * n, a[1] + y * n];
      startCapIndex = cappedPoints.length;
      cappedPoints.push(startCapPosition);
      uvXs.push(0.5);
    }

    // find end cap, insert point + uvX
    if (
      walkedLength < lineLength - capDistance &&
      walkedLength + length >= lineLength - capDistance
    ) {
      const n = (lineLength - capDistance - walkedLength) / length;
      const endCapPosition = [a[0] + x * n, a[1] + y * n];
      endCapIndex = cappedPoints.length;
      cappedPoints.push(endCapPosition);
      uvXs.push(0.5);
    }

    walkedLength += length;
  }

  // add last point
  cappedPoints.push(points[points.length - 1]);
  uvXs.push(1);

  // build the uvX locations
  // const uvXs: number[] = [];
  // for (let i = 0; i < cappedPoints.length - 1; i++) {
  //     if (i < startCapIndex) {
  //         uvXs.push(0);
  //     } else if (i >= endCapIndex) {
  //         uvXs.push(1);
  //     } else {
  //         uvXs.push(.5);
  //     }
  // }
  // uvXs.push(1);

  return { points: cappedPoints, startCapIndex, endCapIndex, uvXs };
}

/** @hidden */
export function buildLineQuads(gl: WebGLRenderingContext, points: number[][], _options: number | ILineOptions = 1): Quad[] {
    const quads: Quad[] = [];

    // validate input
    if (points.length < 2) {
        consoleError("line(): points array should have length > 1");
        return;
    }

    // process options
    let options: ILineOptions = {};
    if (typeof _options === "number") {
        options = {
            width: _options,
        };
    } else {
      quads.push(new Quad(gl, verticies));
      // this.quad(verticies, material, matrix);
    }
  }

  return quads;
}
