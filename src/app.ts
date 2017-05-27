import {sayHello} from "./js/hello.ts"

let testUser = {
    firstName: "TypeScripty",
    lastName: "Language"
}

var p = document.createElement("p");
p.innerHTML = sayHello(testUser);
document.body.appendChild(p);


// adapted from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
helloGL();

function helloGL(): void {
    let canvas: HTMLCanvasElement = document.getElementById("gl-canvas") as HTMLCanvasElement;
    let gl: WebGLRenderingContext = initWebGL(canvas);
    if (!gl) {
        console.error("GL could not be initialized.");
        return;
    }

    gl.clearColor(0.5, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl: WebGLRenderingContext = null;

    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a GL context, give up now
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
    }

    return gl;
}
