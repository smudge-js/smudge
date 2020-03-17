// import { ChannelKey, BlendModeKey } from '../material/material';

// export const BlendModeKey = strEnum([
//     'albedo_blend_mode',
//     'metallic_blend_mode',
//     'smoothness_blend_mode',
//     'height_blend_mode',
//     'emission_blend_mode',
// ]);
// export type BlendModeKey = keyof typeof BlendModeKey;

// export const ChannelKey = strEnum([
//     'red',
//     'green',
//     'blue',
//     'transparency',
//     'metallic',
//     'smoothness',
//     'height',
//     'emission_red',
//     'emission_green',
//     'emission_blue',
// ]);
// export type ChannelKey = keyof typeof ChannelKey;

/** @hidden */
export interface IBufferLayout {
  super_sampling: number;
  depth: number;
  channels: number;
  // channel_materials: ChannelKey[];
  // blend_mode: BlendModeKey;
}
/** @hidden */
export type IReadonlyBufferLayout = Readonly<IBufferLayout>;

/** @hidden */

export interface IBufferLayouts {
  [index: string]: IReadonlyBufferLayout;
}

/** @hidden */
export const bufferLayouts: IBufferLayouts = {
  albedo: {
    super_sampling: 4,
    depth: 16,
    channels: 4,
  },
  metallic: {
    super_sampling: 4,
    depth: 16,
    channels: 1,
  },
  smoothness: {
    super_sampling: 4,
    depth: 16,
    channels: 1,
  },
  height: {
    super_sampling: 4,
    depth: 16,
    channels: 1,
  },
  emission: {
    super_sampling: 4,
    depth: 16,
    channels: 4,
  },
};
