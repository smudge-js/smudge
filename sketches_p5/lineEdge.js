console.log('Hello P5 Smudge HTML');
const c = createCanvas(512, 512);

async function draw() {
  albedo(0.3);
  smoothness(1.0);

  background();

  albedo(0.8, 0.8, 0.8);
  // height(0.1);
  metallic(0.1);
  smoothness(0.5);

  {
    lineWidth(12);
    const points = [];
    for (let a = 0; a < 3.14; a += 0.5) {
      points.push([256 + Math.sin(a) * 150, 256 + Math.cos(a) * 150]);
    }
    line(points);
  }

  {
    lineWidth(12);
    const circle = await loadBundledTexture('circle_sm.png');
    useTexture(circle);
    const noseBrush = await loadBundledTexture('nose_brush.png');
    useTexture(noseBrush, Height);
    const points = [];
    for (let a = 0; a < 3.14; a += 0.5) {
      points.push([256 + Math.sin(a) * 200, 256 + Math.cos(a) * 200]);
    }
    line(points);
  }
}
