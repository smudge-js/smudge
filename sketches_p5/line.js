console.log('Hello P5 Smudge HTML');
const c = createCanvas(512, 512);

albedo(0.3);
background();

albedo(0.8, 0.8, 0.8);
height(0.01);
metallic(0.1);
smoothness(0.5);

line(10, 10, 500, 500);

lineWidth(10);
line(10, 100, 100, 10);

lineAlign('right');
lineClose(true);

line([
  [10, 200],
  [40, 200],
  [40, 230],
  [10, 230],
]);
