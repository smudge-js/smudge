/** @hidden */

export type exportSize = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

/** @hidden */
export interface IExportLayout {
    type: "png" | "exr";
    size: exportSize;
    gamma?: number;
    clear: number[];
    layout: {
        [index: string]: number[],
    };
    // channel_materials: ChannelKey[];
    // blend_mode: BlendModeKey;
}

/** @hidden */
export interface IExportLayouts {
    [index: string]: IExportLayout;
}


/** @hidden */
export type IReadonlyExportLayout = Readonly<IExportLayout>;

const exportLayoutsUnity: IExportLayouts = {
    albedo: <IReadonlyExportLayout>{
        type: "png",
        size: 1024,
        clear: [0, 0, 0, 0],
        layout: {
            albedo: [1, 0, 0, 0, // s.r -> d.r
                0, 1, 0, 0, // s.g -> d.g
                0, 0, 1, 0, // s.b -> d.b
                0, 0, 0, 1], // s.a -> d.a
        },
    },
    metallic_smooth: <IReadonlyExportLayout>{
        type: "png",
        size: 1024,
        clear: [0, 0, 0, 0],
        layout: {
            metallic: [1, 0, 0, 0], // s.r -> d.r
            smoothness: [0, 0, 0, 1], // s.r -> d.a
        },
    },
    height: <IReadonlyExportLayout>{
        type: "exr",
        size: 1024,
        gamma: 1.0,
        clear: [0, 0, 0, 1],
        layout: {
            height: [1, 1, 1, 0], // s.r -> d.rgb
        },
    },
    emission: <IReadonlyExportLayout>{
        type: "png",
        size: 1024,
        clear: [0, 0, 0, 1],
        layout: {
            emission: [1, 0, 0, 0, // s.r -> d.r
                0, 1, 0, 0, // s.g -> d.g
                0, 0, 1, 0, // s.b -> d.b
                0, 0, 0, 1], // s.a -> d.a
        },
    },
};
/** @hidden */
export const exportLayouts = exportLayoutsUnity;
