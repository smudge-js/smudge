
import PBR from './js/pbr1';

let pbr = new PBR();

draw();

function draw() {
    pbr.rect(10, 10, 10, 10);
    pbr.rect(10, 30, 30, 10);
    pbr.rect(10, 50, 30, 30);
    pbr.rect(1, 1, 1, 1);
    pbr.rect(1, 3, 510, 1);
}
