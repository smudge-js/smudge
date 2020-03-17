console.log('Hello P5 Smudge HTML');
const c = createCanvas(512, 512);

async function draw() {
  albedo(0.3);
  background();

  albedo(0.8, 0.8, 0.8);
  height(0.00001);
  metallic(0.1);
  smoothness(0.5);

  const circle = await loadTexture('dist/images/circle.png');
  useTexture(circle);
  const noseBrush = await loadTexture('dist/images/nose_brush.png');
  useTexture(noseBrush, Height);
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
  }

  lineWidth(6);
  line(points);

  height(0.05);
  rect(10, 10, 100, 100);
}
