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

export const bufferLayouts: IBufferLayouts = {
  albedo: <IReadonlyBufferLayout>{
    super_sampling: 4,
    depth: 16,
    channels: 4,
  },
  metallic: <IReadonlyBufferLayout>{
    super_sampling: 4,
    depth: 16,
    channels: 1,
  },
  smoothness: <IReadonlyBufferLayout>{
    super_sampling: 4,
    depth: 16,
    channels: 1,
  },
  height: {
    super_sampling: 4,
    depth: 16,
    channels: 1,
  } as IReadonlyBufferLayout,
  emission: {
    super_sampling: 4,
    depth: 16,
    channels: 4,
  } as IReadonlyBufferLayout,
  // bugfix: {
  //   // @todo fix this
  //   // for some reason, if the last buffer_layout has a super_sampling > 1 it throws off the
  //   // show() drawing size. this is a placeholder fix
  //   super_sampling: 4,
  //   depth: 16,
  //   channels: 4,
  //   // channel_materials: ["emission_red", "emission_green", "emission_blue", "transparency"],
  //   // blend_mode: "emission_blend_mode",
  // } as IReadonlyBufferLayout,
};

