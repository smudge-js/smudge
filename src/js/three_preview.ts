// let THREE = require('three');
import * as THREE from 'three';
import { Framebuffer } from './pbr2'

let cube: THREE.Mesh;

export function threePreview(buffers: { [key: string]: Framebuffer }) {
    console.log("three PREVIEW");
    console.log(THREE);


    // ------------------------------------------------
    // BASIC SETUP
    // ------------------------------------------------

    // Create an empty scene
    var scene = new THREE.Scene();

    // Create a basic perspective camera
    var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 1.5;

    // Create a renderer with Antialiasing
    var renderer = new THREE.WebGLRenderer({ antialias: true });

    // Configure renderer clear color
    renderer.setClearColor("#FF0000");

    // Configure renderer size
    renderer.setSize(512, 512);

    // Append Renderer to DOM
    document.body.appendChild(renderer.domElement);

    // ------------------------------------------------
    // FUN STARTS HERE
    // ------------------------------------------------

    // Create a Cube Mesh with basic material
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: "#FFFFFF" });


    cube = new THREE.Mesh(geometry, material);

    // Add cube to Scene
    scene.add(cube);

    // Render Loop
    var render = function () {
        requestAnimationFrame(render);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Render the scene
        renderer.render(scene, camera);
    };

    render();

}

export function threeUpdate(buffers: { [key: string]: Framebuffer }) {
    console.log("tree");
    console.log(document.getElementById("gl-canvas"));

    var material = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });
    var texture = new THREE.CanvasTexture(document.getElementById("gl-canvas") as HTMLCanvasElement);
    texture.needsUpdate = true;

    var loader = new THREE.CubeTextureLoader();
    loader.setPath('./');

    var textureCube = loader.load([
        'kitten.jpg', 'kitten.jpg',
        'kitten.jpg', 'kitten.jpg',
        'kitten.jpg', 'kitten.jpg'
    ]);
    material.envMap = textureCube;

    material.map = texture;
    // material.emissiveMap = texture;
    // material.aoMap = texture; // red
    // material.roughnessMap = texture; // green
    // material.metalnessMap = texture; // blue
    material.bumpMap = texture; // b&w
    material.roughness = 0;

    cube.material = material;


}



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