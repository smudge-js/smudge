/* tslint:disable:max-classes-per-file */

import * as gl_constants from 'gl-constants';
import { strEnum } from '../util';

import { ColorDescription } from './color';
import { Texture } from '../private/texture';


export interface IBlendMode {
    equation: GLenum;
    sFactor: GLenum;
    dFactor: GLenum;
}
export type IReadonlyBlendMode = Readonly<IBlendMode>;



export const BlendMode = {
    Normal: <IReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE_MINUS_SRC_ALPHA,
    },

    Replace: <IReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.ONE,
        dFactor: gl_constants.ZERO,
    },

    Additive: <IReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE,
    },

    Subtractive: <IReadonlyBlendMode>{
        equation: gl_constants.FUNC_REVERSE_SUBTRACT,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE,
    },

    Darkest: <IReadonlyBlendMode>{
        equation: gl_constants.MIN,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE,
    },

    Lightest: <IReadonlyBlendMode>{
        equation: gl_constants.MAX,
        sFactor: gl_constants.SRC_ALPHA,
        dFactor: gl_constants.ONE,
    },

    Multiply: <IReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.DST_COLOR,
        dFactor: gl_constants.ZERO,
    },
};










// type MaterialConfig = Partial<Material>;

// export class Material {
//     public albedo_blend_mode = BlendMode.Normal;
//     public metallic_blend_mode = BlendMode.Normal;
//     public smoothness_blend_mode = BlendMode.Normal;
//     public height_blend_mode = BlendMode.Normal;
//     public emission_blend_mode = BlendMode.Normal;

//     public red = 0;
//     public green = 0;
//     public blue = 0;
//     public transparency = 0;
//     public metallic = 0;
//     public smoothness = 0;
//     public height = 0;
//     public emission_red = 0;
//     public emission_green = 0;
//     public emission_blue = 0;


//     public textureInfo: TextureInfo;

//     constructor(config: MaterialConfig);
//     constructor(
//         red?: number,
//         green?: number,
//         blue?: number,
//         transparency?: number,
//         metallic?: number,
//         smoothness?: number,
//         height?: number,
//         emission_red?: number,
//         emission_green?: number,
//         emission_blue?: number
//     );
//     constructor(
//         config: number | MaterialConfig = 0,
//         green = 0,
//         blue = 0,
//         transparency = 0,
//         metallic = 0,
//         smoothness = 0,
//         height = 0,
//         emission_red = 0,
//         emission_green = 0,
//         emission_blue = 0
//     ) {
//         if (typeof config === 'number') {
//             this.red = config;
//             this.green = green;
//             this.blue = blue;
//             this.transparency = transparency;
//             this.metallic = metallic;
//             this.smoothness = smoothness;
//             this.height = height;
//             this.emission_red = emission_red;
//             this.emission_green = emission_green;
//             this.emission_blue = emission_blue;
//         } else {
//             Object.assign(this, config);
//         }
//     };


//     toString() {
//         return `Material(rgba ${this.red} ${this.green} ${this.blue} ${this.transparency} ms ${this.metallic} ${this.smoothness} h ${this.height} ergb ${this.emission_red} ${this.emission_green} ${this.emission_blue})`;
//     }

//     static clearing = new Material(0, 0, 0, 1, 0, 0, 0, 0, 0, 0);
//     static white = new Material(1.0, 1.0, 1.0, 1.0);
// }




export class TextureInfo {
    public texture: Texture = undefined;
    public colorMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    public colorBias = [0, 0, 0, 0];
    public uvMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

}




export class MaterialChannel {
    public color: ColorDescription = undefined;
    public blendMode: IBlendMode = undefined;
    public textureConfig: TextureInfo = new TextureInfo();

    constructor(color?: ColorDescription, blendMode?: IBlendMode, textureConfig?: TextureInfo) {
        this.color = color;
        this.blendMode = blendMode;
        if (textureConfig) {
            this.textureConfig = textureConfig;
        }
    }
}



export class Material2 {
    public default: MaterialChannel = new MaterialChannel(undefined, BlendMode.Normal, undefined);
    public albedo: MaterialChannel = new MaterialChannel();
    public metallic: MaterialChannel = new MaterialChannel();
    public smoothness: MaterialChannel = new MaterialChannel();
    public height: MaterialChannel = new MaterialChannel();
    public emission: MaterialChannel = new MaterialChannel();
}

// export class MaterialChannelMap {
//     [name: string]: MaterialChannel;
// }

// // this is a little trick
// // _Material2 couldn't have the index signature on it, because it has some
// // specific properties that don't conform
// // Merging the index sig in this way works though.
// export type Material2 = _Material2 & MaterialChannelMap;
