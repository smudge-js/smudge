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



const export_layouts_unity = {
    albedo: {
        clear: [0, 0, 0, 0],
        layout: {
            albedo: [1, 0, 0, 0, // s.r -> d.r
                0, 1, 0, 0, // s.g -> d.g
                0, 0, 1, 0, // s.b -> d.b
                0, 0, 0, 1] // s.a -> d.a
        }
    },
    metallic_smooth: {
        clear: [0, 0, 0, 0],
        layout: {
            metallic: [1, 0, 0, 0], // s.r -> d.r
            smoothness: [0, 0, 0, 1] // s.r -> d.a
        }
    },
    height: {
        clear: [0, 0, 0, 1],
        layout: {
            height: [1, 1, 1, 0] // s.r -> d.rgb
        }
    },
    emission: {
        clear: [0, 0, 0, 0],
        layout: {
            emission: [1, 0, 0, 0, // s.r -> d.r
                0, 1, 0, 0, // s.g -> d.g
                0, 0, 1, 0, // s.b -> d.b
                0, 0, 0, 1] // s.a -> d.a
        }
    },
}
export const export_layouts = export_layouts_unity;
