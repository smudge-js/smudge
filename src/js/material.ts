import * as gl_constants from 'gl-constants';
import { strEnum } from './util';


export interface BlendMode {
    equation: GLenum,
    sFactor: GLenum,
    dFactor: GLenum
}
export type ReadonlyBlendMode = Readonly<BlendMode>;

export const BlendMode = {
    Normal: <ReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE_MINUS_SRC_ALPHA
    },

    REPLACE: <ReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.ONE,
        dFactor: gl_constants.ZERO
    },

    Additive: <ReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE
    },

    Subtractive: <ReadonlyBlendMode>{
        equation: gl_constants.FUNC_REVERSE_SUBTRACT,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE
    },

    Darkest: <ReadonlyBlendMode>{
        equation: gl_constants.MIN,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE
    },

    Lightest: <ReadonlyBlendMode>{
        equation: gl_constants.MAX,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE
    },

    Multiply: <ReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.DST_COLOR,
        dFactor: gl_constants.ZERO
    },

}




export const BlendModeKey = strEnum([
    'albedo_blend_mode',
    'metallic_blend_mode',
    'smoothness_blend_mode',
    'height_blend_mode',
    'emission_blend_mode'
])
export type BlendModeKey = keyof typeof BlendModeKey;


export const ChannelKey = strEnum([
    'red',
    'green',
    'blue',
    'transparency',
    'metallic',
    'smoothness',
    'height',
    'emission_red',
    'emission_green',
    'emission_blue'
])
export type ChannelKey = keyof typeof ChannelKey;



export class Material {
    public albedo_blend_mode = BlendMode.Normal;
    public metallic_blend_mode = BlendMode.Normal;
    public smoothness_blend_mode = BlendMode.Normal;
    public height_blend_mode = BlendMode.Normal;
    public emission_blend_mode = BlendMode.Normal;

    constructor(
        public red = 0,
        public green = 0,
        public blue = 0,
        public transparency = 0,
        public metallic = 0,
        public smoothness = 0,
        public height = 0,
        public emission_red = 0,
        public emission_green = 0,
        public emission_blue = 0
    ) { };

    toString() {
        return `Material(rgba ${this.red} ${this.green} ${this.blue} ${this.transparency} ms ${this.metallic} ${this.smoothness} h ${this.height} ergb ${this.emission_red} ${this.emission_green} ${this.emission_blue})`;
    }

    static clearing = new Material(0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
    static white = new Material(1.0, 1.0, 1.0, 1.0);
}