import { ChannelKey, BlendModeKey } from './material';

interface BufferLayout {
    super_sampling: number;
    depth: number;
    channels: number;
    channel_materials: ChannelKey[];
    blend_mode: BlendModeKey;
}
export type ReadonlyBufferLayout = Readonly<BufferLayout>;


export const buffer_layouts = {
    albedo: <ReadonlyBufferLayout>{
        super_sampling: 4,
        depth: 16,
        channels: 4,
        channel_materials: ["red", "green", "blue", "transparency"],
        blend_mode: "albedo_blend_mode"
    },
    metallic: <ReadonlyBufferLayout>{
        super_sampling: 4,
        depth: 16,
        channels: 1,
        channel_materials: ["metallic", "metallic", "metallic", "transparency"],
        blend_mode: "metallic_blend_mode"
    },
    smoothness: <ReadonlyBufferLayout>{
        super_sampling: 4,
        depth: 16,
        channels: 1,
        channel_materials: ["smoothness", "smoothness", "smoothness", "transparency"],
        blend_mode: "smoothness_blend_mode"
    },
    height: <ReadonlyBufferLayout>{
        super_sampling: 4,
        depth: 16,
        channels: 1,
        channel_materials: ["height", "height", "height", "transparency"],
        blend_mode: "height_blend_mode"
    },
    emission: <ReadonlyBufferLayout>{
        super_sampling: 4,
        depth: 16,
        channels: 4,
        channel_materials: ["emission_red", "emission_green", "emission_blue", "transparency"],
        blend_mode: "emission_blend_mode"
    }
};



