import { ChannelKey, BlendModeKey } from './material';

interface IBufferLayout {
    super_sampling: number;
    depth: number;
    channels: number;
    channel_materials: ChannelKey[];
    blend_mode: BlendModeKey;
}
export type IReadonlyBufferLayout = Readonly<IBufferLayout>;



export const bufferLayouts = {
    albedo: <IReadonlyBufferLayout>{
        super_sampling: 4,
        depth: 16,
        channels: 4,
        channel_materials: ["red", "green", "blue", "transparency"],
        blend_mode: "albedo_blend_mode",
    },
    metallic: <IReadonlyBufferLayout>{
        super_sampling: 1,
        depth: 16,
        channels: 1,
        channel_materials: ["metallic", "metallic", "metallic", "transparency"],
        blend_mode: "metallic_blend_mode",
    },
    smoothness: <IReadonlyBufferLayout>{
        super_sampling: 4,
        depth: 16,
        channels: 1,
        channel_materials: ["smoothness", "smoothness", "smoothness", "transparency"],
        blend_mode: "smoothness_blend_mode",
    },
    height: {
        super_sampling: 4,
        depth: 16,
        channels: 1,
        channel_materials: ["height", "height", "height", "transparency"],
        blend_mode: "height_blend_mode",
    } as IReadonlyBufferLayout,
    emission: {
        super_sampling: 4,
        depth: 16,
        channels: 4,
        channel_materials: ["emission_red", "emission_green", "emission_blue", "transparency"],
        blend_mode: "emission_blend_mode",
    } as IReadonlyBufferLayout,
    bugfix: {
        // @todo fix this
        // for some reason, if the last buffer_layout has a super_sampling > 1 it throws off the
        // show() drawing size. this is a placeholder fix
        super_sampling: 1,
        depth: 16,
        channels: 4,
        channel_materials: ["emission_red", "emission_green", "emission_blue", "transparency"],
        blend_mode: "emission_blend_mode",
    } as IReadonlyBufferLayout,
    // three_pbr: <ReadonlyBufferLayout>{
    //     super_sampling: 1,
    //     depth: 16,
    //     channels: 4,
    //     channel_materials: ["smoothness", "smoothness", "metallic", "transparency"],
    //     blend_mode: "emission_blend_mode"
    // },
};
