import { setFloat16 } from "@petamoriken/float16";

export function makeExr(width: number, height: number, pixels: Float32Array): Blob {
    // http://www.openexr.com/TechnicalIntroduction.pdf
    // http://www.openexr.com/openexrfilelayout.pdf
    // https://gist.github.com/fpsunflower/e5c99116ff94114d1cbe
    // https://github.com/aras-p/miniexr/blob/master/miniexr.cpp
    const channels: number = 4;

    // exr data starts with a header
    let headerSize = 313;

    if (channels === 4) {
        headerSize += 18;
    }

    // then a table that lists the offset from file start to each line in image
    const scanlineTableSize = 8 * height;

    // then image data itself

    const pixelRowSize = width * channels * 2;
    const fullRowSize = pixelRowSize + 8;
    const dataSize = height * fullRowSize;

    // allocate the space
    const buffer = new ArrayBuffer(headerSize + scanlineTableSize + dataSize);
    const bufferView = new DataView(buffer);

    // start writing
    let i = 0;

    // write the header
    function write_int8(data: number) {
        bufferView.setInt8(i++, data);
    }
    function write_int32(data: number) {
        bufferView.setInt32(i, data, true);
        i += 4;
    }
    function write_int8_array(data: number[]) {
        data.forEach((datum) => write_int8(datum));
    }
    function write_string(data: string) {
        for (let index = 0; index < data.length; index++) {
            write_int8(data.charCodeAt(index));
        }
    }



    // magic exr identifier
    write_int8_array([0x76, 0x2f, 0x31, 0x01]);


    // version, boolean flags (all set false)
    write_int8_array([2, 0, 0, 0]);

    // channels
    write_string('channels'); // attribute name
    write_int8(0);
    write_string('chlist'); // attribute type
    write_int8(0);

    // attribute size length of following data, including final 0
    if (channels === 3) {
        write_int8_array([55, 0, 0, 0]);
    } else {
        write_int8_array([73, 0, 0, 0]);
    }

    // B, half
    write_string('B');
    write_int8(0);
    write_int8_array([1, 0, 0, 0]); // pixel type 1 = HALF
    write_int8(0); // linear = 0
    write_int8_array([0, 0, 0]); // reserved
    write_int8_array([1, 0, 0, 0, 1, 0, 0, 0]); // xSampling, ySampling

    // G, half
    write_string('G');
    write_int8_array([0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]); // short version of above

    // R, half
    write_string('R');
    write_int8_array([0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]); // short version of above

    // A, half
    if (channels === 4) {
        write_string('A');
        write_int8_array([0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]); // short version of above
    }

    write_int8(0);

    // compression - no compression
    write_string('compression');
    write_int8(0);
    write_string('compression');
    write_int8(0);
    write_int8_array([1, 0, 0, 0]);
    write_int8(0);

    // dataWindow - width, height
    write_string('dataWindow');
    write_int8(0);
    write_string('box2i');
    write_int8(0);
    write_int8_array([16, 0, 0, 0]);
    write_int8_array([0, 0, 0, 0, 0, 0, 0, 0]);
    write_int32(width - 1);
    write_int32(height - 1);

    // display window - width, height
    write_string('displayWindow');
    write_int8(0);
    write_string('box2i');
    write_int8(0);
    write_int8_array([16, 0, 0, 0]);
    write_int8_array([0, 0, 0, 0, 0, 0, 0, 0]);
    write_int32(width - 1);
    write_int32(height - 1);

    // lineOrder - increasing Y
    write_string('lineOrder');
    write_int8(0);
    write_string('lineOrder');
    write_int8(0);
    write_int8_array([1, 0, 0, 0]);
    write_int8(0);

    // pixelAspectRaio - 1.0f
    write_string('pixelAspectRatio');
    write_int8(0);
    write_string('float');
    write_int8(0);
    write_int8_array([4, 0, 0, 0]);
    write_int8_array([0, 0, 0x80, 0x3f]);

    // screenWindowCenter
    write_string('screenWindowCenter');
    write_int8(0);
    write_string('v2f');
    write_int8(0);
    write_int8_array([8, 0, 0, 0]);
    write_int8_array([0, 0, 0, 0, 0, 0, 0, 0]);


    // screenWindowWidth
    write_string('screenWindowWidth');
    write_int8(0);
    write_string('float');
    write_int8(0);
    write_int8_array([4, 0, 0, 0]);
    write_int8_array([0, 0, 0x80, 0x3f]);

    //
    write_int8(0);


    // write line offset to scanline table
    let offset = headerSize + scanlineTableSize;
    for (let y = 0; y < height; ++y) {
        write_int32(offset);
        write_int32(0);
        offset += fullRowSize;
    }

    // write data

    for (let y = 0; y < height; y++) {
        write_int32(y);
        write_int32(pixelRowSize);

        // a
        if (channels === 4) {
            for (let x = 0; x < width; x++) {
                setFloat16(bufferView, i, pixels[((height - y - 1) * width + x) * 4 + 3], true);
                i += 2;
            }
        }


        // b
        for (let x = 0; x < width; x++) {
            setFloat16(bufferView, i, pixels[((height - y - 1) * width + x) * 4 + 2], true);
            i += 2;
        }

        // g
        for (let x = 0; x < width; x++) {
            setFloat16(bufferView, i, pixels[((height - y - 1) * width + x) * 4 + 1], true);
            i += 2;

            // if (x === 1) {

            //     console.log(y, pixels[((height - y - 1) * width + x) * 4 + 1]);

            // }
        }

        // r
        for (let x = 0; x < width; x++) {
            setFloat16(bufferView, i, pixels[((height - y - 1) * width + x) * 4 + 0], true);
            i += 2;
        }




    }





    // show start of file as  hex dump
    // let output = "";
    // const intArray = new Uint8Array(buffer);

    // for (let index = 0; index < 400; index++) {
    //     const value = intArray[index];
    //     let hex = value.toString(16);
    //     if (hex.length < 2) {
    //         hex = "0" + hex;
    //     }
    //     output += hex;
    //     if (index % 4 === 3) {
    //         output += " ";
    //     }
    //     if (index % (4 * 14) === (4 * 14) - 1) {
    //         output += "\n";
    //     }

    // }

    // console.log(output);


    const blob = new Blob([bufferView], { type: "image/exr" });

    return blob;


}
