import * as _ from 'lodash';
import * as THREE from 'three';

import { PBR, Framebuffer } from './pbr2';

// (window as any).THREE = THREE;


export class PBRPreview {
    private renderer: THREE.WebGLRenderer;
    private cube: THREE.Mesh;

    constructor(private readonly pbr: PBR, targetID: string) {
        console.log("three constructor");
        // init Three renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor("#000", 0);
        this.renderer.setSize(512, 512);

        // inject preview canvas
        let t = document.getElementById("pbr-preview");
        t.insertBefore(this.renderer.domElement, t.firstChild);

        // set up scene
        var scene = new THREE.Scene();

        // camera
        var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 1.5;

        // lighting
        var ambient = new THREE.AmbientLight(0x111111);
        scene.add(ambient);

        var directional_light_one = new THREE.DirectionalLight(0xFFFFFF);
        directional_light_one.position.x = -1;
        directional_light_one.position.y = 1;
        directional_light_one.position.z = 1;
        scene.add(directional_light_one);

        var directional_light_two = new THREE.DirectionalLight(0x111111);
        directional_light_two.position.x = 1;
        directional_light_two.position.y = 0;
        directional_light_two.position.z = 1;
        scene.add(directional_light_two);

        // cube
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        // var material = new THREE.MeshBasicMaterial({ color: "#FFFFFF" });
        let material = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });

        this.cube = new THREE.Mesh(geometry, material);
        scene.add(this.cube);

        let arcball = new ArcBall(this.renderer.domElement, this.cube);


        // start render loop
        var render = () => {
            requestAnimationFrame(render);
            this.renderer.render(scene, camera);
        };
        render();


    }

    update() {
        console.log("update");

        // create a new PBR material
        // let material = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });
        let material = this.cube.material as THREE.MeshStandardMaterial;

        // pack the three_pbr buffer
        // @todo had to reduce oversampling from 4 to 1 on next line, why
        let three_pbr = new Framebuffer("three_pbr", this.pbr.gl, 1024, 1024, 1, 16);

        let clear_color = [0, 1, 0, 1];
        let layout = {
            smoothness: [0, -1, 0, 0], // negate smoothness.r and pack into g
            metallic: [0, 0, 1, 0], // pack metallic.r into b
        };


        this.pbr.pack(layout, clear_color, three_pbr);

        ///////////////////////////////////
        ///// Load Maps
        material.map = getThreeTextureForBuffer(this.pbr, getBuffer(this.pbr, "albedo"));
        material.roughnessMap = material.metalnessMap = getThreeTextureForBuffer(this.pbr, three_pbr);
        material.bumpMap = getThreeTextureForBuffer(this.pbr, getBuffer(this.pbr, "height"));
        material.emissiveMap = getThreeTextureForBuffer(this.pbr, getBuffer(this.pbr, "emission"));

        ///////////////////////////////////
        ///// Environment Map

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

        material.roughness = 1.0;
        material.metalness = 1.0;
        material.color = new THREE.Color(1, 1, 1);
        material.envMapIntensity = 1;
        material.emissiveIntensity = 1;
        material.emissive = new THREE.Color(1, 1, 1);

        ///////////////////////////////////
        ///// Update Material

        material.needsUpdate = true;
        // cube.material = material;


        ///////////////////////////////////
        ///// Clean up

        this.pbr.gl.bindFramebuffer(this.pbr.gl.FRAMEBUFFER, null);
    }


}

function map(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return ((x - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

class ArcBall {
    private oldX = 0;
    private oldY = 0;
    private isMousePressed = false;

    constructor(private targetElement: HTMLElement, private targetMesh: THREE.Mesh) {

        targetElement.onmousedown = (e) => {
            this.isMousePressed = true;
        }
        targetElement.onmouseup = (e) => {
            this.isMousePressed = false;
        }

        targetElement.onmousemove = (e) => {
            var rect = targetElement.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            // scale mouse position to -1 to 1 range
            x = map(x, 0, rect.width, -1, 1);
            y = map(y, 0, rect.height, -1, 1);

            // flip y
            y *= -1;

            // make the arc ball area smaller
            x *= 2;
            y *= 2;

            if (this.isMousePressed) {
                this.drag(x, y, this.oldX, this.oldY);
            }

            this.oldX = x;
            this.oldY = y;
        }
    }

    drag(x: number, y: number, oldX: number, oldY: number) {

        // 2D -> 3D point
        let oldV = new THREE.Vector3(this.oldX, this.oldY, 0);
        let newV = new THREE.Vector3(x, y, 0);

        // snap outside clicks onto ball
        if (oldV.length() > 1) {
            oldV.normalize();
        }
        if (newV.length() > 1) {
            newV.normalize();
        }

        // find the z position on the ball given the x and y
        oldV.z = Math.sqrt(1 - oldV.length() * oldV.length());
        newV.z = Math.sqrt(1 - newV.length() * newV.length());

        // calculate the angle and axis of rotation
        let angle = oldV.angleTo(newV);
        let axis = new THREE.Vector3().crossVectors(oldV, newV);

        // rotate the targetMesh, but don't do anything if angle is NaN or 0
        if (angle) {
            axis.normalize();
            this.targetMesh.matrix.premultiply(new THREE.Matrix4().makeRotationAxis(axis, angle));
            this.targetMesh.matrixAutoUpdate = false;
        }
    }


}

function getBuffer(pbr: PBR, bufferName: string): Framebuffer {
    let buffer = pbr.buffers[bufferName];
    if (!buffer) {
        console.error("Could not find buffer named: " + bufferName);
        return
    }
    return buffer;
}

function getThreeTextureForBuffer(pbr: PBR, buffer: Framebuffer): THREE.DataTexture {
    // get ready to read data out of buffer

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
