console.log('Hello P5 Smudge HTML');
const c = createCanvas(512, 512);

albedo(0.3);
background();

albedo(0.8, 0.8, 0.8);
height(0.01);
metallic(0.1);
smoothness(0.5);

let pos = { x: 256, y: 64 };
let speed = 2;
let delta_a = 0.01;
let a = 0;

for (let i = 0; i < 3000; i++) {
  pos.x += Math.cos(a) * speed;
  pos.y += Math.sin(a) * speed;
  a += delta_a + Math.sin(i * 0.1) * 0.01;
  delta_a += 0.00001;

  ellipse(pos.x, pos.y, 10, 10);
}
