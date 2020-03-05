console.log('Hello P5 Smudge HTML');
const c = createCanvas(512, 512);

albedo(0.5);

background();

albedo(0.4);
height(0.001);
smoothness(0.5);

blendMode(Blend, Albedo);
blendMode(Additive, Height);
ellipse(0, 0, 100, 100);
ellipse(0, 50, 100, 100);

blendMode(Additive, Albedo);
blendMode(Additive, Height);
ellipse(100, 0, 100, 100);
ellipse(100, 50, 100, 100);

blendMode(Subtractive, Albedo);
blendMode(Additive, Height);
ellipse(200, 0, 100, 100);
ellipse(200, 50, 100, 100);

blendMode(Multiply, Albedo);
blendMode(Additive, Height);
ellipse(300, 0, 100, 100);
ellipse(300, 50, 100, 100);

blendMode(Additive, 'unknown'); // friendly error
