console.log('Hello P5 Smudge HTML');
const c = createCanvas(512, 512);
console.log('c', c);

albedo(0.1);
background();

fill(1);

albedo(1, 0, 0);
height(0.01, 0.5);

rect(10, 10, 10, 20);
square(30, 10, 10);
ellipse(50, 10, 10, 20);
circle(70, 10, 10);
quad(90, 10, 100, 20, 110, 20, 100, 10);
triangle(110, 10, 120, 20, 130, 10);

ellipse(100, 100, 100, 100);
ellipse(150, 100, 100, 100);
ellipse(200, 100, 100, 100);
