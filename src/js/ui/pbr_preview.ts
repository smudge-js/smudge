/* tslint:disable:max-classes-per-file */


import * as THREE from 'THREE';


import { Framebuffer } from '../private/framebuffer';

export class PBRPreview {
    public canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private cube: THREE.Mesh;
    private dirty = false;

    constructor(_targetID: string) {

        // init Three renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor("#000", 0);
        this.renderer.setSize(512, 512);
        this.renderer.setPixelRatio(2);


        // inject preview canvas
        // const t = document.getElementsByClassName("smudge-3d")[0];
        // t.insertBefore(this.renderer.domElement, t.firstChild);
        this.canvas = this.renderer.domElement;

        // set up scene
        const scene = new THREE.Scene();

        // camera
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 1.5;

        // lighting
        const ambient = new THREE.AmbientLight(0x111111);
        scene.add(ambient);

        const directionalLightOne = new THREE.DirectionalLight(0xFFFFFF);
        directionalLightOne.position.x = -1;
        directionalLightOne.position.y = 1;
        directionalLightOne.position.z = 1;
        scene.add(directionalLightOne);

        const directionalLightTwo = new THREE.DirectionalLight(0x111111);
        directionalLightTwo.position.x = 1;
        directionalLightTwo.position.y = 0;
        directionalLightTwo.position.z = 1;
        scene.add(directionalLightTwo);

        // cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });

        this.cube = new THREE.Mesh(geometry, material);
        this.cube.rotateX(Math.PI * -.25);
        this.cube.rotateZ(Math.PI * .2);

        // this.cube.rotateY(.5);
        scene.add(this.cube);



        const arcball = new ArcBall(this.renderer.domElement, this.cube);
        // creating ArcBall for side effects but never need to access it again
        // next lines quite above error. a little silly.
        // tslint:disable-next-line
        arcball;

        // start render loop
        let oldMatrix: THREE.Matrix4;

        const render = () => {
            requestAnimationFrame(render);
            if (this.dirty || !oldMatrix || !this.cube.matrix.equals(oldMatrix)) {
                this.renderer.render(scene, camera);
            }
            oldMatrix = this.cube.matrix.clone();
            this.dirty = false;
        };
        render();


    }

    public update(gl: WebGLRenderingContext, albedo: Framebuffer, smoothMetallic: Framebuffer, height: Framebuffer, emission: Framebuffer) {

        // create a new PBR material
        const material = this.cube.material as THREE.MeshStandardMaterial;


        ///////////////////////////////////
        ///// Load Maps
        material.map = getThreeTextureForBuffer(gl, albedo);
        material.roughnessMap = material.metalnessMap = getThreeTextureForBuffer(gl, smoothMetallic);
        material.bumpMap = getThreeTextureForBuffer(gl, height);
        material.emissiveMap = getThreeTextureForBuffer(gl, emission);

        ///////////////////////////////////
        ///// Environment Map
        const loader = new THREE.TextureLoader();
        const envMap = loader.load("./images/environment_studio.jpg", () => {
            // console.log(envMap);
            envMap.magFilter = THREE.LinearFilter;
            envMap.minFilter = THREE.LinearMipMapLinearFilter;
            envMap.generateMipmaps = true;
            envMap.mapping = THREE.EquirectangularReflectionMapping;
            material.envMap = envMap;
            material.needsUpdate = true;

            this.dirty = true;
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

        ///////////////////////////////////
        ///// Clean up
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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

        this.targetElement.onmousedown = (_e) => {
            this.isMousePressed = true;
        };
        this.targetElement.onmouseup = (_e) => {
            this.isMousePressed = false;
        };

        this.targetElement.onmousemove = (_e) => {
            const rect = this.targetElement.getBoundingClientRect();
            let x = _e.clientX - rect.left;
            let y = _e.clientY - rect.top;

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
        };
    }

    public drag(x: number, y: number, _oldX: number, _oldY: number) {

        // 2D -> 3D point
        const oldV = new THREE.Vector3(this.oldX, this.oldY, 0);
        const newV = new THREE.Vector3(x, y, 0);

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
        const angle = oldV.angleTo(newV);
        const axis = new THREE.Vector3().crossVectors(oldV, newV);

        // rotate the targetMesh, but don't do anything if angle is NaN or 0
        if (angle) {
            axis.normalize();
            this.targetMesh.matrix.premultiply(new THREE.Matrix4().makeRotationAxis(axis, angle));
            this.targetMesh.matrixAutoUpdate = false;
        }
    }
}



function getThreeTextureForBuffer(gl: WebGLRenderingContext, buffer: Framebuffer): THREE.DataTexture {
    // get ready to read data out of buffer

    const width = buffer.width;
    const height = buffer.height;

    // read hdr data from hdr buffer
    buffer.bind();
    const hdrData = new Float32Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.FLOAT, hdrData);

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

    const texture = new THREE.DataTexture(hdrData, width, height, THREE.RGBAFormat, THREE.FloatType);
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;




    texture.needsUpdate = true;
    return texture;
}
