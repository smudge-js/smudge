console.log('Hello P5 Smudge HTML');
const c = createCanvas(512, 512);

albedo(0.3);
background();

albedo(0.8, 0.8, 0.8);
height(0.0005);
metallic(0.1);
smoothness(0.5);

blendMode(Additive, Height);

let pos = { x: 256, y: 64 };
let speed = 10;
let delta_a = 0.05;
let a = 0;

const points = [];
for (let i = 0; i < 1000; i++) {
  pos.x += Math.cos(a) * speed;
  pos.y += Math.sin(a) * speed;

  points.push([pos.x, pos.y]);

  a += delta_a + Math.sin(i * 0.1) * 0.01;
  delta_a += 0.0001;

  //ellipse(pos.x, pos.y, 10, 10);
}

lineWidth(6);
line(points);
