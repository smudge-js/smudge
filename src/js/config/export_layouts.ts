/** @hidden */
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
        clear: [0, 0, 0, 1],
        layout: {
            emission: [1, 0, 0, 0, // s.r -> d.r
                0, 1, 0, 0, // s.g -> d.g
                0, 0, 1, 0, // s.b -> d.b
                0, 0, 0, 1] // s.a -> d.a
        }
    },
}
/** @hidden */
export const export_layouts = export_layouts_unity;
