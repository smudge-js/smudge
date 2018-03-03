/* tslint:disable:max-classes-per-file */

import * as gl_constants from 'gl-constants';


import { ColorDescription } from './color';
import { Texture } from '../private/texture';


export interface IBlendMode {
    equation: GLenum;
    sFactor: GLenum;
    dFactor: GLenum;
}
export type IReadonlyBlendMode = Readonly<IBlendMode>;

export const BlendMode = {
    Blend: <IReadonlyBlendMode>{
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

    // Darkest: <IReadonlyBlendMode>{
    //     equation: gl_constants.MIN,
    //     sFactor: gl_constants.SRC_ALPHA,
    //     dFactor: gl_constants.ONE,
    // },

    // Lightest: <IReadonlyBlendMode>{
    //     equation: gl_constants.MAX,
    //     sFactor: gl_constants.SRC_ALPHA,
    //     dFactor: gl_constants.ONE,
    // },

    Multiply: <IReadonlyBlendMode>{
        equation: gl_constants.FUNC_ADD,
        sFactor: gl_constants.DST_COLOR,
        dFactor: gl_constants.ZERO,
    },
};


export class TextureInfo {
    public texture: Texture = undefined;
    public colorMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    public colorBias = [0, 0, 0, 0];
    public uvMatrix: Float32Array | number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

export class MaterialChannel {
    public color: ColorDescription = undefined;
    public blendMode: IBlendMode = undefined;
    public textureInfo: TextureInfo = new TextureInfo();

    constructor(color?: ColorDescription, blendMode?: IBlendMode, textureConfig?: TextureInfo) {
        this.color = color;
        this.blendMode = blendMode;
        if (textureConfig) {
            this.textureInfo = textureConfig;
        }
    }
}

export class Material2 {
    public static clearing = new Material2();

    public default: MaterialChannel = new MaterialChannel(undefined, BlendMode.Blend, undefined);
    public albedo: MaterialChannel = new MaterialChannel();
    public metallic: MaterialChannel = new MaterialChannel();
    public smoothness: MaterialChannel = new MaterialChannel();
    public height: MaterialChannel = new MaterialChannel();
    public emission: MaterialChannel = new MaterialChannel();

    [key: string]: MaterialChannel;


}

Material2.clearing.default.color = 0;

