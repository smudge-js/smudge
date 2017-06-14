import PBR from './js/pbr1';
import draw from './js/sketches/brick_complex'

var pbr = new PBR(undefined, 512, 512, 8);

draw(pbr);

pbr.show();
