


// function blendModes(gl: WebGLRenderingContext) {
//     // wrapped in a function to get a gl context to pull constants from
//     // todo: better way?

//     // color(RGBA) = (sourceColor * sFactor) + (destinationColor * dFactor)
//     const gl2 = gl as any;
//     return {
//         // ignore destination completely
//         overwrite: {
//             blendEquation: gl.FUNC_ADD,
//             sFactor: gl.ONE,
//             dFactor: gl.ZERO
//         },

//         // standard alpha blending (normal)
//         blend: {
//             blendEquation: gl.FUNC_ADD,
//             sFactor: gl.SRC_ALPHA,
//             dFactor: gl.ONE_MINUS_SRC_ALPHA
//         },

//         // per-component multiply (multiply)
//         multiply: {
//             blendEquation: gl.FUNC_ADD,
//             sFactor: gl.DST_COLOR,
//             dFactor: gl.ZERO
//         },

//         // per-component add (linear dodge)
//         add: {
//             blendEquation: gl.FUNC_ADD,
//             sFactor: gl.ONE,
//             dFactor: gl.ONE
//         },

//         // per-component subtract (subtract)
//         subtract: {
//             blendEquation: gl.FUNC_REVERSE_SUBTRACT,
//             sFactor: gl.ONE,
//             dFactor: gl.ONE
//         },

//         // per-component min(darken)
//         darkest: {
//             blendEquation: gl2.MIN,
//             sFactor: gl.ONE,
//             dFactor: gl.ONE
//         },

//         // per-component max(lighten)
//         lightest: {
//             blendEquation: gl2.MAX,
//             sFactor: gl.ONE,
//             dFactor: gl.ONE
//         }
//     }
// };