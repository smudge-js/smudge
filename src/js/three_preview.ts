// let THREE = require('three');
import * as THREE from 'three';
import { PBR } from './pbr2';

(window as any).THREE = THREE;
require('./RGBELoader.js');


let cube: THREE.Mesh;
let renderer: THREE.WebGLRenderer;


export function threePreview(pbr: PBR) {

    console.log("Three.js loaded: ", !!THREE);

    // init Three renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#444444");
    renderer.setSize(512, 512);
    document.body.appendChild(renderer.domElement);

    // set up scene
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 1.5;

    var ambient = new THREE.AmbientLight(0x888888);
    // scene.add(ambient);
    var directional_light_one = new THREE.DirectionalLight(0xFFFFFF);
    directional_light_one.position.x = -1;
    directional_light_one.position.y = 1;
    directional_light_one.position.z = 1;
    scene.add(directional_light_one);

    var directional_light_two = new THREE.DirectionalLight(0x000022);
    directional_light_two.position.x = 1;
    directional_light_two.position.y = 0;
    directional_light_two.position.z = 1;
    scene.add(directional_light_two);



    // build cube
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: "#FFFFFF" });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Render Loop
    var render = function () {
        requestAnimationFrame(render);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    render();
}

function getThreeTextureForBuffer(pbr: PBR, bufferName: string): THREE.DataTexture {
    // get ready to read data out of buffer
    let buffer = pbr.buffers[bufferName];
    if (!buffer) {
        console.error("Could not find buffer named: " + bufferName);
        return
    }
    let width = buffer.width;
    let height = buffer.height;

    // read hdr data from hdr buffer
    buffer.bind();
    let hdr_data = new Float32Array(width * height * 4);
    pbr.gl.readPixels(0, 0, width, height, pbr.gl.RGBA, pbr.gl.FLOAT, hdr_data);

    // scale and covert to ldr
    // let scaled_data = hdr_data.map((x) => x * 255);
    // let ldr_data = Uint8Array.from(scaled_data);

    // console.log("hdr_data", hdr_data);
    // console.log("ldr_data", ldr_data);

    // create texture from ldr data
    // let texture = new THREE.DataTexture(ldr_data, width, height,
    //     THREE.RGBAFormat,
    //     THREE.UnsignedByteType
    // );

    let texture = new THREE.DataTexture(hdr_data, width, height,
        THREE.RGBAFormat,
        THREE.FloatType
    );


    texture.needsUpdate = true;
    return texture;
}

export function threeUpdate(pbr: PBR) {

    // create a new PBR material
    let material = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });


    // pack the three_pbr buffer
    let layout = {
        smoothness: [0, -1, 0, 0],
        metallic: [0, 0, 1, 0],
    };
    let clear_color = [0, 1, 0, 1];


    pbr.pack(layout, clear_color, pbr.buffers["three_pbr"]);
    // pbr.show("three_pbr");

    ///////////////////////////////////
    ///// Load Maps

    // set texture as main albedo map
    material.map = getThreeTextureForBuffer(pbr, "albedo");
    material.metalnessMap = getThreeTextureForBuffer(pbr, "three_pbr");
    material.roughnessMap = material.metalnessMap;
    material.bumpMap = getThreeTextureForBuffer(pbr, "height");
    material.emissiveMap = getThreeTextureForBuffer(pbr, "emission");

    ///////////////////////////////////
    ///// Environment Map



    // console.log("three", (THREE as any), (THREE as any).RGBELoader);

    // let loader = new (THREE as any).RGBELoader();
    let loader = new THREE.TextureLoader();
    let envMap = loader.load("./images/environment_studio.jpg", () => {
        // console.log(envMap);
        envMap.magFilter = THREE.LinearFilter;
        envMap.minFilter = THREE.LinearMipMapLinearFilter;
        envMap.generateMipmaps = true;
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        material.envMap = envMap;
        material.needsUpdate = true;
    });



    ///////////////////////////////////
    ///// PBR Settings

    // material.emissiveMap = texture;
    // material.aoMap = texture; // red
    // material.roughnessMap = texture; // green
    // material.metalnessMap = texture; // blue
    //material.bumpMap = texture; // b&w
    material.roughness = 1.0;
    material.metalness = 1.0;
    material.color = new THREE.Color(1, 1, 1);
    material.envMapIntensity = 1;
    material.emissiveIntensity = 1;
    material.emissive = new THREE.Color(1, 1, 1);

    ///// Assign Material
    cube.material = material;



    // clean up
    pbr.gl.bindFramebuffer(pbr.gl.FRAMEBUFFER, null);

}


// // add cube env map to material
// let loader = new THREE.CubeTextureLoader();
// loader.setPath('./');
// let evnCube = loader.load([
//     'kitten.jpg', 'kitten.jpg',
//     'kitten.jpg', 'kitten.jpg',
//     'kitten.jpg', 'kitten.jpg'
// ], () => {
//     material.envMap = evnCube;
//     material.needsUpdate = true;
//     // cube.material = material;
// });



// EquirectangularReflectionMapping


// // check for texture float support
// console.log("OES_texture_float", !!renderer.context.getExtension('OES_texture_float'));
// console.log("OES_texture_float_linear", !!renderer.context.getExtension('OES_texture_float_linear'));


// // create cavans
//
// var canvas = document.createElement('canvas');
// canvas.width = width;
// canvas.height = height;


// // copy pixel data to canvas via 2d context
//
// var context = canvas.getContext('2d');
// var imageData = context.createImageData(width, height);
// imageData.data.set(data);
// context.putImageData(imageData, 0, 0);

// // texture from canvas
// var texture = new THREE.CanvasTexture(canvas);


// read ldr data from ldr buffer
//
// var ldr_data = new Uint8Array(width * height * 4);
// pbr.gl.readPixels(0, 0, width, height, pbr.gl.RGBA, pbr.gl.UNSIGNED_BYTE, ldr_data);




// read texture from canvas
//
// console.log("three");
// console.log(document.getElementById("gl-canvas"));
// var texture = new THREE.CanvasTexture(document.getElementById("gl-canvas") as HTMLCanvasElement);

// function createImageFromTexture(gl: WebGL2RenderingContext, texture: WebGLTexture, width: number, height: number) {
//     // Create a framebuffer backed by the texture
//     var framebuffer = gl.createFramebuffer();
//     gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
//     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

//     // Read the contents of the framebuffer
//     var data = new Uint8Array(width * height * 4);
//     gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

//     gl.deleteFramebuffer(framebuffer);

//     // Create a 2D canvas to store the result
//     var canvas = document.createElement('canvas');
//     canvas.width = width;
//     canvas.height = height;
//     var context = canvas.getContext('2d');

//     // Copy the pixels to a 2D canvas
//     var imageData = context.createImageData(width, height);
//     imageData.data.set(data);
//     context.putImageData(imageData, 0, 0);

//     var img = new Image();
//     img.src = canvas.toDataURL();
//     return img;
// }



// // instantiate a loader
// var loader = new THREE.TextureLoader();

// // load a resource
// loader.load(
//     // resource URL
//     './kitten.jpg',
//     // Function when resource is loaded
//     function (texture) {
//         // do something with the texture
//         var material = new THREE.MeshBasicMaterial({
//             map: texture
//         });

//         cube.material = material;
//     },
//     // Function called when download progresses
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     // Function called when download errors
//     function (xhr) {
//         console.log('An error happened');
//     }
// );

