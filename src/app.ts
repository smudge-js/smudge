import PBR from './js/pbr1';
import draw from './js/sketches/brick_complex2'

var pbr = new PBR(undefined, 1024, 1024, 4);

draw(pbr);

pbr.show();
