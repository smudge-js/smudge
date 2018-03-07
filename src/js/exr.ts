import { setFloat16 } from "@petamoriken/float16";

/**
 * Exports an float-half OpenEXR RGBA image
 * http://www.openexr.com/TechnicalIntroduction.pdf
 * http://www.openexr.com/openexrfilelayout.pdf
 *
 * Partially based on miniexr
 * https://github.com/aras-p/miniexr/blob/master/miniexr.cpp
 *
 * @pixels: Float32Array RGBA data, should be width*height*4 long
 */


export function makeExr(width: number, height: number, pixels: Float32Array, gamma = 2.2): Blob {
    const channels = 4; // rgba

    const bytesPerChannel = 2; // half float

    // exr data starts with a header
    const headerSize = 331;

    // then a table that lists the offset from file start to each line in image
    const scanlineTableSize = 8 * height;

    // then image data itself
    const pixelRowSize = width * channels * bytesPerChannel;
    const fullRowSize = pixelRowSize + 8;
    const dataSize = height * fullRowSize;

    // allocate the space
    const buffer = new ArrayBuffer(headerSize + scanlineTableSize + dataSize);
    const bufferView = new DataView(buffer);
    let i = 0;

    // data writers
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
    function write_string(s: string) {
        write_int8_array(string_to_codeArray(s));
        write_int8(0);
    }

    function write_attribute(name: string, type: string, value: number[]) {
        write_string(name); // attribute name
        write_string(type); // attribute type
        write_int32(value.length); // attribute size
        write_int8_array(value); // attribute value
    }


    ////////////////////////////////////////////
    // HEADER

    // magic exr identifier
    write_int8_array([0x76, 0x2f, 0x31, 0x01]);

    // version, boolean flags (all set false)
    write_int8_array([2, 0, 0, 0]);

    // channel data
    let channelData: number[] = [];
    channelData = channelData.concat(channel('B', 'half', true));
    channelData = channelData.concat(channel('G', 'half', true));
    channelData = channelData.concat(channel('R', 'half', true));
    channelData = channelData.concat(channel('A', 'half', true));
    channelData.push(0);
    write_attribute('channels', 'chlist', channelData);

    // compression - no compression
    write_attribute('compression', 'compression', [0]);

    // dataWindow
    write_attribute('dataWindow', 'box2i', box2i(0, 0, width - 1, height - 1));

    // display window
    write_attribute('displayWindow', 'box2i', box2i(0, 0, width - 1, height - 1));

    // lineOrder - increasing Y
    write_attribute('lineOrder', 'lineOrder', [0]);

    // pixelAspectRaio - 1.0f
    write_attribute('pixelAspectRatio', 'float', [0, 0, 0x80, 0x3f]);

    // screenWindowCenter
    write_attribute('screenWindowCenter', 'v2f', [0, 0, 0, 0, 0, 0, 0, 0]);

    // screenWindowWidth
    write_attribute('screenWindowWidth', 'float', [0, 0, 0x80, 0x3f]);

    // header terminator
    write_int8(0);



    ////////////////////////////////////////////
    // LINE OFFSET TABLE

    let offset = headerSize + scanlineTableSize;
    for (let y = 0; y < height; ++y) {
        write_int32(offset);
        write_int32(0);
        offset += fullRowSize;
    }

    ////////////////////////////////////////////
    // SCANLINE DATA

    for (let y = 0; y < height; y++) {
        write_int32(y); // row
        write_int32(pixelRowSize); // size

        // a
        for (let x = 0; x < width; x++) {
            const value = pixels[((height - y - 1) * width + x) * 4 + 3];
            const gammaValue = Math.pow(value, gamma);
            setFloat16(bufferView, i, gammaValue, true);
            i += 2;
        }

        // b
        for (let x = 0; x < width; x++) {
            const value = pixels[((height - y - 1) * width + x) * 4 + 2];
            const gammaValue = Math.pow(value, gamma);
            setFloat16(bufferView, i, gammaValue, true);
            i += 2;
        }

        // g
        for (let x = 0; x < width; x++) {
            const value = pixels[((height - y - 1) * width + x) * 4 + 1];
            const gammaValue = Math.pow(value, gamma);
            setFloat16(bufferView, i, gammaValue, true);
            i += 2;
        }

        // r
        for (let x = 0; x < width; x++) {
            const value = pixels[((height - y - 1) * width + x) * 4 + 0];
            const gammaValue = Math.pow(value, gamma);
            setFloat16(bufferView, i, gammaValue, true);
            i += 2;
        }
    }


    ////////////////////////////////////////////
    // CONVERT TO BLOB

    const blob = new Blob([bufferView], { type: "image/exr" });
    return blob;
}


function string_to_codeArray(s: string): number[] {
    const data = [];
    for (let index = 0; index < s.length; index++) {
        data.push(s.charCodeAt(index));
    }
    return data;
}

function channel(name: string, pixelType: "uint" | "half" | "float", linear: boolean): number[] {
    let data: number[] = [];
    data = data.concat(string_to_codeArray(name));
    data.push(0);
    if (pixelType === "uint") {
        data = data.concat([0, 0, 0, 0]);
    }
    if (pixelType === "half") {
        data = data.concat([1, 0, 0, 0]);
    }
    if (pixelType === "float") {
        data = data.concat([2, 0, 0, 0]);
    }
    data.push(linear ? 1 : 0);
    data = data.concat([0, 0, 0]); // reserved
    data = data.concat([1, 0, 0, 0]); // x sampling
    data = data.concat([1, 0, 0, 0]); // y sampling
    return data;
}

function smallEndian(value: number): number[] {
    const data: number[] = [];
    data.push(value & 0xFF);
    data.push((value >> 8) & 0xFF);
    data.push((value >> 16) & 0xFF);
    data.push((value >> 24) & 0xFF);
    return data;
}

function box2i(minX: number, minY: number, maxX: number, maxY: number) {
    let data: number[] = [];
    data = data.concat(smallEndian(minX));
    data = data.concat(smallEndian(minY));
    data = data.concat(smallEndian(maxX));
    data = data.concat(smallEndian(maxY));
    return data;
}

