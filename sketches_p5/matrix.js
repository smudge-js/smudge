console.log('Hello P5 Smudge HTML');
const c = createCanvas(512, 512);

albedo(0.3);
background();

albedo(0.8, 0.8, 0.8);
height(0.01);
metallic(0.1);
smoothness(0.5);

translate(canvasWidth * 0.5, canvasHeight * 0.5);
rotate(Math.PI * 0.25);
scale(2, 3);
rect(-50, -50, 100, 100);

resetMatrix();
albedo(0, 0, 0.8);
rect(10, 10, 100, 100);
