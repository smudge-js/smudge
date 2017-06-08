import PBR from '../pbr1';
import {Material} from '../pbr1';

export default function draw(pbr: PBR) {
    const clear = new Material(0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0);

    const red = new Material(1.0, 0.0, 0.0, 1.0);
    red.height = 1.0;
    red.metallic = 1.0;
    red.smoothness = 1.0;

    const green = new Material(0.0, 1.0, 0.0, 1.0);
    green.height = 1.0;
    green.metallic = 0.0;
    green.smoothness = 1.0;

    const blue = new Material(0.0, 0.0, 1.0, 1.0);
    blue.height = 1.0;
    blue.metallic = 1.0;
    blue.smoothness = 0.0;

    pbr.rect(0, 0, 512, 512, clear);

    pbr.rect(10, 10, 10, 10, red);
    pbr.rect(10, 30, 30, 10, green);
    pbr.rect(10, 50, 30, 30, blue);
    pbr.rect(1, 1, 1, 1);
    pbr.rect(1, 3, 510, 1);
}
