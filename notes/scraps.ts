/* tslint:disable */

// loading RGBE HDR
console.log("three", (THREE as any), (THREE as any).RGBELoader);
let loader = new (THREE as any).RGBELoader();


// add cube env map to material
let loader = new THREE.CubeTextureLoader();
loader.setPath('./');
let evnCube = loader.load([
  'kitten.jpg', 'kitten.jpg',
  'kitten.jpg', 'kitten.jpg',
  'kitten.jpg', 'kitten.jpg'
], () => {
  material.envMap = evnCube;
  material.needsUpdate = true;
  // cube.material = material;
});



// EquirectangularReflectionMapping


// check for texture float support
console.log("OES_texture_float", !!renderer.context.getExtension('OES_texture_float'));
console.log("OES_texture_float_linear", !!renderer.context.getExtension('OES_texture_float_linear'));


// create cavans
var canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;


// copy pixel data to canvas via 2d context

var context = canvas.getContext('2d');
var imageData = context.createImageData(width, height);
imageData.data.set(data);
context.putImageData(imageData, 0, 0);

// texture from canvas
var texture = new THREE.CanvasTexture(canvas);

// read ldr data from ldr buffer
var ldr_data = new Uint8Array(width * height * 4);
pbr.gl.readPixels(0, 0, width, height, pbr.gl.RGBA, pbr.gl.UNSIGNED_BYTE, ldr_data);




// read texture from canvas

console.log("three");
console.log(document.getElementById("gl-canvas"));
var texture = new THREE.CanvasTexture(document.getElementById("gl-canvas") as HTMLCanvasElement);

function createImageFromTexture(gl: WebGL2RenderingContext, texture: WebGLTexture, width: number, height: number) {
  // Create a framebuffer backed by the texture
  var framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  // Read the contents of the framebuffer
  var data = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

  gl.deleteFramebuffer(framebuffer);

  // Create a 2D canvas to store the result
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');

  // Copy the pixels to a 2D canvas
  var imageData = context.createImageData(width, height);
  imageData.data.set(data);
  context.putImageData(imageData, 0, 0);

  var img = new Image();
  img.src = canvas.toDataURL();
  return img;
}



// // instantiate a loader
var loader = new THREE.TextureLoader();

// load a resource
loader.load(
  // resource URL
  './kitten.jpg',
  // Function when resource is loaded
  function (texture) {
    // do something with the texture
    var material = new THREE.MeshBasicMaterial({
      map: texture
    });

    cube.material = material;
  },
  // Function called when download progresses
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // Function called when download errors
  function (xhr) {
    console.log('An error happened');
  }
);


