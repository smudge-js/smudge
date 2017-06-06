
import PBR from './js/pbr1';

let pbr = new PBR();

draw();

function draw() {
    const red = [1.0, 0.0, 0.0, 1.0];
    const green = [0.0, 1.0, 0.0, 1.0];
    const blue = [0.0, 0.0, 1.0, 1.0];

    pbr.rect(10, 10, 10, 10, red);
    pbr.rect(10, 30, 30, 10, green);
    pbr.rect(10, 50, 30, 30, blue);
    pbr.rect(1, 1, 1, 1);
    pbr.rect(1, 3, 510, 1);

    pbr.show();
}
